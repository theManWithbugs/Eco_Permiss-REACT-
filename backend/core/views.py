import json

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from .serializers import *
from .models import *
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .choices import *

from rest_framework.parsers import MultiPartParser, FormParser
from django.core.paginator import Paginator
from django.forms import model_to_dict
from django.http import JsonResponse
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework import serializers


# =========================
# Variáveis de status HTTP
# =========================
# SUCESSO (200 - 299)
status_200 = "Solicitação efetuada com sucesso!"
status_201 = "Operação realizada com sucesso!"
status_204 = "Sucesso, mas o servidor não retorna nenhum corpo."
# ERROS DO CLIENTE (400 - 499)
status_401 = "Não permitido: Você deve estar autenticado para isso!"
status_403 = "Alerta: Permissão de acesso negada!"
status_404 = "Error: O item solicitado não foi localizado!"
status_422 = "Formato correto, mas dados falharam na validação."
# ERROS DO SERVIDOR (500 - 599)
status_500 = "O servidor quebrou ou encontrou um erro interno."
status_503 = "Servidor temporariamente fora do ar ou em manutenção"


# =========================
# VIEWS GET
# =========================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    """
    Retorna dados essenciais que dizem respeito ao usuario atual
    """

    try:
        user = request.user
        serializer = SerializerGetUser(user)
        return JsonResponse(data=serializer.data, status=200)
    except Exception as e:
        return JsonResponse("Ocorreu um erro: {}".format(e), status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def solic_pesq_user(request):
    """
    Retorna as solicitações de pesquisa do usuário autenticado, paginadas.
    Atenção: Se o formato dos campos unidade_cons ou area_atuacao mudar no model, ajuste o split!
    """
    objs = DadosSolicPesquisa.objects.filter(user_solic=request.user).values(
        'id', 'acao_realizada', 'status').order_by('-data_solicitacao')

    page_number = request.GET.get('page', 1)
    paginator = Paginator(objs, 10)
    page_obj = paginator.get_page(page_number)

    #Aqui é feito diferente porque quando se usa values é retornado um dicionario
    itens_json = []
    for item in page_obj:
        itens_json.append(item)

    return JsonResponse({
        'objs': itens_json,
        'currentPage': page_obj.number,
        'totalPages': paginator.num_pages,
        'hasNext': page_obj.has_next(),
        'hasPrevious': page_obj.has_previous()
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def minhas_solic_ugai(request):
    """
    Retorna as solicitações de UGAI do usuário autenticado.
    """

    objs = DadosSolicUgai.objects.filter(
        user_solic=request.user).order_by('-data_solicitacao')

    page_number = request.GET.get('page', 1)
    paginator = Paginator(objs, 10)
    page_obj = paginator.get_page(page_number)

    itens_json = []
    for item in page_obj:
        d = model_to_dict(item)
        d["ugai"] = str(item.ugai)
        d['id'] = str(item.id)
        itens_json.append(d)

    return JsonResponse({
        'objs': itens_json,
        'currentPage': page_obj.number,
        'totalPages': paginator.num_pages,
        'hasNext': page_obj.has_next(),
        'hasPrevious': page_obj.has_previous()
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_choices(request):
    """
    Retorna as opções de choices para UCS e área de atuação.
    """
    #Choices solic_pesq
    ucs = UCS_CHOICES
    areas_atuacao = CHOICES_AREA_ATUACAO

    #Choices solic_ugai
    ugais = CHOICES_UGAIS

    ugais_now = Ugai.objects.all()

    itens_ugais = []
    for x in ugais_now:
        d = model_to_dict(x)
        d['id'] = str(x.id)
        itens_ugais.append(d)

    dados = {
        "choices_ucs": ucs,
        "choices_area": areas_atuacao,
        "choices_ugais": ugais,
        "ugais": itens_ugais

    }
    return Response(data=dados, status=200)


# =========================
# VIEWS POST
# =========================


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def membros_pesq(request):
    """
    Retorna os membros da equipe de uma pesquisa pelo id.
    """

    class SerializerDocMembro(serializers.ModelSerializer):
        class Meta:
            model = AnexoMembroEquipe
            fields = ["id", "documento", "nome_original"]

    class SerializerMembrosPesq(serializers.ModelSerializer):
        anexos = SerializerDocMembro(many=True, read_only=True)

        class Meta:
            model = MembroEquipePesq
            fields = [
                "id",
                "nome",
                "rg",
                "cpf",
                "instituicao",
                "email",
                "confirmado",
                "anexos"
            ]

    try:
        id_pesquisa = request.data.get("id")

        membros = MembroEquipePesq.objects.filter(
            pesquisa=id_pesquisa
        ).prefetch_related("anexos")

        serializer = SerializerMembrosPesq(membros, many=True)

        return Response(serializer.data, status=200)

    except Exception as e:
        return Response(
            {"erro": f"Ocorreu um erro: {str(e)}"},
            status=500
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def solic_pesquisa(request):
    """
    Cria uma solicitação de pesquisa e associa
    unidades de conservação e áreas de atuação.
    """
    ano = timezone.now().year
    mes_num = timezone.now().month
    meses = [
        None,'janeiro','fevereiro','março','abril','maio','junho',
        'julho','agosto','setembro','outubro','novembro','dezembro'
    ]
    mes = meses[mes_num]

    required_files = ["doc_ident", "doc_cpf", "doc_seg_vida", "licenca"]
    # Forma mais fácil de verificar se todos os documentos do solicitante foram recebidos
    if not all(request.FILES.get(field) for field in required_files):
        return Response(
            {"message": "Todos os documentos do solicitante devem ser anexados!"}, status=400
        )

    # Verifica se as unidades de conservação recebidas estão presentes no banco
    ucs = UnidadesConservacao.objects.all().values('nome')
    ucs_list = []
    for x in ucs:
        d = x["nome"]
        ucs_list.append(d)
    for nome in request.data.get('unidade_cons', '').split(','):
        nome = nome.strip()
        if nome not in ucs_list:
            return Response(
                {"message": f"A unidade {nome} não é uma unidade de conservação valida!"},
                status=400
            )

    # Verifica se as areas de atuação recebidas estão presentes no banco
    areas = AreaAtuacao.objects.all().values('nome')
    areas_list = []
    for x in areas:
        d = x["nome"]
        areas_list.append(d)
    for nome in request.data.get('area_atuacao', '').split(','):
        nome = nome.strip()
        if nome not in areas_list:
            return Response(
                {"message": f"A área {nome} não é uma área de atuação valida!"},
                status=400
            )

    try:
        pesquisa = DadosSolicPesquisa.objects.create(
            user_solic=request.user,
            acao_realizada=request.data.get('acao_realizada'),
            foto=request.data.get('foto'),
            # licenca_inst=request.data.get('licenca_inst'),
            inicio_atividade=request.data.get('inicio_atividade'),
            final_atividade=request.data.get('final_atividade'),
            retorno_comuni=request.data.get('retorno_comuni'),
            status='PENDENTE'
        )

        doc_ident = request.FILES.get('doc_ident')
        if doc_ident:
            path = default_storage.save(
                f'docs_pesquisa/{ano}/{mes}/doc_ident/{doc_ident.name}',
                ContentFile(doc_ident.read())
            )
            pesquisa.doc_ident = path

        doc_cpf = request.FILES.get('doc_cpf')
        if doc_cpf:
            path = default_storage.save(
                f'docs_pesquisa/{ano}/{mes}/doc_cpf/{doc_cpf.name}',
                ContentFile(doc_cpf.read())
            )
            pesquisa.doc_cpf = path

        doc_seg_vida = request.FILES.get('doc_seg_vida')
        if doc_seg_vida:
            path = default_storage.save(
                f'docs_pesquisa/{ano}/{mes}/doc_seg_vida/{doc_seg_vida.name}',
                ContentFile(doc_seg_vida.read())
            )
            pesquisa.doc_seg_vida = path

        for arquivo in request.FILES.getlist('licenca'):
            AnexExtraPesqLicenca.objects.create(
                solicitacao=pesquisa,
                doc_url=arquivo
            )

        for arquivo in request.FILES.getlist('outros'):
            AnexExtraPesqOutros.objects.create(
                solicitacao=pesquisa,
                doc_url=arquivo
            )

        pesquisa.save()

        # Unidades de Conservação
        for nome in request.data.get('unidade_cons', '').split(','):
            # O strip aqui é usado para excluir espaços em branco
            # Tanto no inicio quanto no fim da string
            nome = nome.strip()
            if nome:
                unidade = UnidadesConservacao.objects.get(nome=nome)
                pesquisa.unidades.add(unidade)

        # Áreas de Atuação
        for nome in request.data.get('area_atuacao', '').split(','):
            nome = nome.strip()
            if nome:
                area = AreaAtuacao.objects.get(nome=nome)
                pesquisa.area_atuacao.add(area)

        return Response(
            {
                "message": "Solicitação criada com sucesso!",
                "id": pesquisa.id,
                # "arquivos": arquivos_enviados
            },
            status=201
        )

    except Exception as e:
        return Response({"error": str(e)}, status=400)

# Aqui vem os dados de info pesquisa
#-------------------------------------------------------------#
# Salva membros da equipe de pesquisa
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def membros_solic_pesq(request):
    """
    Salva uma lista de membros para uma pesquisa específica.
    Aceita arquivos enviados em multipart e os associa a cada membro criado.
    """
    dados = request.data.get('formsets', [])
    id_pesq = request.data.get('id_pesquisa')

    if isinstance(dados, str):
        dados = json.loads(dados)

    obj_pai = get_object_or_404(DadosSolicPesquisa, id=id_pesq)
    serializer = SerializerMembroEquipe(data=dados, many=True)
    if serializer.is_valid():
        membros_criados = serializer.save(pesquisa=obj_pai)

        for index, membro in enumerate(membros_criados):
            for uploaded_file in request.FILES.getlist(f'membro_{index}'):
                AnexoMembroEquipe.objects.create(
                    membro=membro,
                    documento=uploaded_file,
                    nome_original=uploaded_file.name
                )

        return Response("Solicitação realizada com sucesso!", status=200)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def info_pesquisa(request):
    """
    Pega os dados da pesquisa selecionada pelo usuario
    """
    class SerializerAnexosOutros(serializers.ModelSerializer):
        class Meta:
            model = AnexExtraPesqOutros
            fields = "__all__"

    class SerializerAnexosLicenca(serializers.ModelSerializer):
        class Meta:
            model = AnexExtraPesqLicenca
            fields = "__all__"

    class SerializerInfoPesq(serializers.ModelSerializer):
        outros_documentos = SerializerAnexosOutros(many=True, read_only=True)
        licencas = SerializerAnexosLicenca(many=True, read_only=True)

        class Meta:
            model = DadosSolicPesquisa
            exclude = ["unidades", "area_atuacao"]


    id = request.data.get('id')
    obj = get_object_or_404(DadosSolicPesquisa, id=id)

    serializer = SerializerInfoPesq(
        obj,
        context={'request': request}
    )

    return Response(serializer.data, status=200)


# =========================
# TESTES E UTILITÁRIOS
# =========================

# Criar solicitação de UGAI
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def solic_ugai(request):
    """
    Cria uma solicitação de UGAI.
    Atenção: alguns campos são preenchidos automaticamente.
    """
    serializer = SeializerRegUGAI(data=request.data)
    if serializer.is_valid():
        serializer.save(
            user_solic=request.user,
            quantidade_pessoas=2
        )
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_url_doc(request):
    """
    Retorna os documentos finais associados a uma pesquisa.
    Atenção: espera o campo 'id_pesq' no body.
    """

    id_pesquisa = request.data.get('id_pesq')
    pesquisa = get_object_or_404(DadosSolicPesquisa, id=id_pesquisa)
    if not id_pesquisa:
        return Response(status_404, status=404)
    try:
        objs = ArquivosRelFinal.objects.filter(pesquisa_ref=pesquisa)
        serializer = SerializerDoc(objs, many=True, context={'request': request})
        return Response(serializer.data, status=200)
    except Exception as e:
        # ATENÇÃO: Logar exceções em produção
        return Response(f"Ocorreu um erro: {e}", status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def excluir_arq(request):
    """
    Exclui um documento final de pesquisa pelo id.
    Atenção: espera o campo 'documento_id' no body.
    """
    id = request.data.get('documento_id')
    try:
        arquivo = ArquivosRelFinal.objects.get(id=id)
        documentos_associados = ArquivosRelFinal.objects.filter(id=id)
        for doc in documentos_associados:
            doc.delete_documento()
        arquivo.delete_documento()
        return Response("Documento excluído com sucesso", status=200)
    except ArquivosRelFinal.DoesNotExist:
        return Response("Documento não encontrado", status=404)


# =========================
# UPLOAD DE ARQUIVOS
# =========================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes((MultiPartParser, FormParser))
def file_upload(request):
    """
    Faz o upload de arquivos PDF finais de pesquisa.
    Espera 'documento' e 'pesquisa_id' no body.
    """
    arquivo_recebido = request.FILES.get('documento')
    pesquisa_id = request.data.get('pesquisa_id')
    pesquisa = get_object_or_404(DadosSolicPesquisa, id=pesquisa_id)

    if not pesquisa.status == "APROVADO":
        return Response("Apenas permitido para pesquisas em andamento!", status=403)

    if not arquivo_recebido:
        return Response("Nenhum arquivo enviado", status=400)

    arq_nome = arquivo_recebido.name
    doc_type = arq_nome.split('.')[-1]

    if doc_type != 'pdf':
        return Response("Apenas formato pdf aceito!", status=400)

    try:
        ArquivosRelFinal.objects.create(
            pesquisa_ref=pesquisa,
            documento=arquivo_recebido
        )
        return Response("Arquivo Salvo com sucesso!", status=201)
    except Exception as e:
        return Response(f"Ocorreu um erro: {e}", status=500)
