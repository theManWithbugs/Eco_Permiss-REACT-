import json

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.paginator import Paginator
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import http
from django.http import JsonResponse

from .choices import *
from .models import *
from .serializers import *
from .utils import enviar_codigo_recuperacao, enviar_username

from django.views.decorators.csrf import csrf_exempt
import random

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
# GLOBAL
# =========================
#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#
def max_file_size(file):
    max_size_bytes = 5 * 1024 * 1024

    if file.size > max_size_bytes:
        # Ele lança o erro  diretamente no bloco try
        raise ValidationError(f"O arquivo {file.name} ultrapassa o tamanho maximo permitido!")
    return;

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_choices(request):
    """
    Retorna as opções de choices para UCS e área de atuação.
    """
    #Choices solic_pesq
    ucs = UCS_CHOICES
    areas_atuacao = CHOICES_AREA_ATUACAO

    #Choices solic_ugai
    ugais = CHOICES_UGAIS
    ori_sexual = ORIENTACOES_CHOICES
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
        "choices_ori": ori_sexual,
        "ugais": itens_ugais
    }
    return Response(data=dados, status=200)

#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#

# =========================
# REGISTRAR USUÁRIO PADRÃO
# =========================
#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#
@api_view(['POST'])
def reg_usuario(request):
    serializer_user = UserRegistrationSerializer(data=request.data)
    if serializer_user.is_valid():
        user = serializer_user.save()
        try:
            enviar_username(user.email, user.username)
        except Exception as exc:
            print(f"Falha ao enviar e-mail de cadastro: {exc}")
        return Response(
            {
                "messages": "Usuário criado com sucesso!",
                "username": user.username,
            },
            status=201,
        )
    return Response(serializer_user.errors, status=400)

#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#


# =========================
# RECUPERAR CREDÊNCIAIS
# =========================
#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#
@csrf_exempt
@api_view(['POST'])
def recup_credenc(request):
    email = request.data.get('email')

    def gerar_codigo():
        return random.randint(1000, 9999)

    try:
        user = get_object_or_404(User, email=email)
        dados_user = get_object_or_404(DadosPessoais, usuario=user)
        codigo = gerar_codigo()

        dados_user.codigo_recup = codigo
        dados_user.save()
        enviar_codigo_recuperacao(user.email, user.username, codigo)
        return Response({"message": "Código enviado por e-mail!"},
                        status=200)
    except Exception as e:
        return Response({"message": "Usuario não localizado!"}, status=400)


@csrf_exempt
@api_view(['POST'])
def validar_codigo_recup(request):
    email = request.data.get('email')
    codigo = request.data.get('codigo')

    try:
        user = get_object_or_404(User, email=email)
        dados_user = get_object_or_404(DadosPessoais, usuario=user)

        if int(dados_user.codigo_recup) != int(codigo):
            return JsonResponse({"message": "Código inválido!"}, status=http.HTTPStatus.BAD_REQUEST)

        return JsonResponse({"id": str(user.id)}, status=http.HTTPStatus.OK)
    except Exception:
        return JsonResponse({"message": "Usuário não localizado!"}, status=http.HTTPStatus.BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def redefinir_senha(request):
    user_id = request.data.get('id_user')
    new_password = request.data.get('new_password')
    if not user_id:
        return Response({"message": "id_user não fornecido."}, status=400)

    if not new_password:
        return Response({"message": "new_password não fornecido."}, status=400)

    user = get_object_or_404(User, id=user_id)

    try:
        user.set_password(new_password)
        user.save()
        return Response({"message": "Senha alterada com sucesso!"}, status=200)
    except Exception as e:
        return Response({"message": f"Não foi possível alterar suas credenciais! {e}"}, status=500)

#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#

# =========================
# ALTERAR DADOS DO USUARIO
# =========================
#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def alterar_dados_user(request):
    user = request.user
    dados_pss = get_object_or_404(DadosPessoais, usuario=user)

    serializer = AlterarDadosPss(
        instance=user,
        data=request.data,
        context={'dados_pessoais': dados_pss}
    )

    if serializer.is_valid():
        try:
            serializer.save()
            return Response({"message": "Dados alterados com sucesso!"}, status=200)
        except Exception as e:
            return Response({"message": f"{e}"}, status=500)

    return Response(serializer.errors, status=500)

#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#

#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    """
    Retorna dados essenciais que dizem respeito ao usuario atual
    """

    try:
        user = request.user
        dados_pss = get_object_or_404(DadosPessoais, usuario=user)

        serializer = SerializerGetUser(user)
        serializer_pss = SerializerDadosPss(dados_pss)

        return JsonResponse(
            data={
                "user": serializer.data,
                "dados_pessoais": serializer_pss.data,
            },
            status=200,
        )
    except Exception as e:
        return JsonResponse(
            {"message": "Ocorreu um erro: {}".format(e)},
            status=500,
        )


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

# =========================
# REALIZAR SOLIC_PESQ
# =========================
#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#
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

    required_files = ["doc_ident", "doc_cpf", "doc_seg_vida"]
    # Forma mais fácil de verificar se todos os documentos do solicitante foram recebidos
    if not all(request.FILES.get(field) for field in required_files):
        return Response(
            {"message": "Todos os documentos do solicitante devem ser anexados!"}, status=400
        )

    ucs = UnidadesConservacao.objects.all().values('nome')
    areas = AreaAtuacao.objects.all().values('nome')

    # Verifica se as unidades de conservação recebidas estão presentes no banco
    ucs_list = []
    for x in ucs:
        d = x["nome"]
        ucs_list.append(d)
    for nome in request.data.get('unidade_cons', '').split(','):
        nome = nome.strip()

        if not nome:
            return Response(
                {"message": f"Nenhuma unidade de conservação selecionada!"},
                status=400
            )

        if nome not in ucs_list:
            return Response(
                {"message": f"A unidade {nome} não é uma unidade de conservação valida!"},
                status=400
            )

    # Verifica se as areas de atuação recebidas estão presentes no banco
    areas_list = []
    for x in areas:
        d = x["nome"]
        areas_list.append(d)
    for nome in request.data.get('area_atuacao', '').split(','):
        nome = nome.strip()

        if not nome:
            return Response(
                {"message": f"Nenhuma área de atuação selecionada!"},
                status=400
            )

        if nome not in areas_list:
            return Response(
                {"message": f"A área {nome} não é uma área de atuação valida!"},
                status=400
            )

    # Verifica o tamanho dos arquivos antes de salvar o objeto principal
    try:
        if request.FILES.get('doc_ident'): max_file_size(request.FILES.get('doc_ident'))
        if request.FILES.get('doc_cpf'): max_file_size(request.FILES.get('doc_cpf'))
        if request.FILES.get('doc_seg_vida'): max_file_size(request.FILES.get('doc_seg_vida'))
        for arquivo in request.FILES.getlist('licenca'): max_file_size(arquivo)
        for arquivo in request.FILES.getlist('outros'): max_file_size(arquivo)
    except ValidationError as e:
        return Response({"message": str(e)}, status=400)

    try:
        pesquisa = DadosSolicPesquisa.objects.create(
            user_solic=request.user,
            acao_realizada=request.data.get('acao_realizada'),
            foto=request.data.get('foto'),
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
                "id": pesquisa.id
            },
            status=200
        )

    except Exception as e:
        return Response({"error": str(e)}, status=400)
#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#

# =========================
# CRIAR SOLIC_UGAI
# =========================
#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def solic_ugai(request):
    """
    Cria uma solicitação de UGAI.
    Atenção: alguns campos são preenchidos automaticamente.
    """
    serializer = SerializerRegUGAI(data=request.data)
    if serializer.is_valid():
        serializer.save(
            user_solic=request.user,
            quantidade_pessoas=2,
            status="PENDENTE"
        )
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#

# =========================
# INFORMAÇÕES DA SOLIC_PESQUISA
# =========================
#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def membros_pesq(request):
    """
    Retorna os membros da equipe de uma pesquisa pelo id.
    """

    class SerializerDocMembro(serializers.ModelSerializer):
        class Meta:
            model = AnexoMembroEquipe
            fields = [
                "id",
                "nome_original",
                "doc_ident",
                "doc_cpf",
                "doc_seg_vida",
                "doc_cart_vacin",
                "licenca",
                "outros",
            ]

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
def info_membro_pesq(request):
    """
    Aqui vai ser realizado a busca de todos os dados de cada membro
    atualmente incluso na solicitação de pesquisa
    """
    id_pesq = request.data.get('id')
    membros = MembroEquipePesq.objects.filter(
        pesquisa=id_pesq
        ).prefetch_related("anexos")

    serializer = SerializerMembrosPesq(membros, many=True)

    return Response(serializer.data, status=200)

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
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    membros_criados = serializer.save(pesquisa=obj_pai)
    # Todos os campos de arquivo do AnexoMembroEquipe — um por campo, um por membro
    campos_arquivo = ['doc_ident', 'doc_cpf', 'doc_seg_vida', 'doc_cart_vacin', 'licenca', 'outros']

    for index, membro in enumerate(membros_criados):
        kwargs_anexo = {'membro': membro}

        for campo in campos_arquivo:
            chave = f'membro_{index}_{campo}'
            arquivo = request.FILES.get(chave)
            if arquivo:
                kwargs_anexo[campo] = arquivo

        # Cria um único AnexoMembroEquipe por membro se ao menos um arquivo foi enviado
        if len(kwargs_anexo) > 1:
            AnexoMembroEquipe.objects.create(**kwargs_anexo)

    return Response("Solicitação realizada com sucesso!", status=200)

# =========================
# ALTERAR DOCUMENTOS DOS MEMBROS DA PESQUISA
# =========================
@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def alt_doc_memb_pesq(request):

    id_pesq = request.data.get('id_pesq')
    id_membro = request.data.get('id_membro')

    if not id_pesq or not id_membro:
        return Response(
            {"error": "id_pesq e id_membro são obrigatórios."},
            status=400
        )

    try:
        membro = MembroEquipePesq.objects.get(
            id=id_membro,
            pesquisa__id=id_pesq,
            pesquisa__user_solic=request.user
        )
    except MembroEquipePesq.DoesNotExist:
        return Response(
            {"error": "Membro não encontrado."},
            status=404
        )

    campos_texto = [
        'nome',
        'rg',
        'cpf',
        'email',
        'instituicao',
        'ori_sexual'
    ]

    campos_anexo = [
        'doc_ident',
        'doc_cpf',
        'doc_seg_vida',
        'doc_cart_vacin',
        'licenca',
        'outros'
    ]

    # CONSULTA
    if request.method == 'POST':
        anexo = membro.anexos.first()

        dados = {
            'id': membro.id
        }

        for campo in campos_texto:
            dados[campo] = getattr(membro, campo)

        dados['anexo'] = {}

        if anexo:
            for campo in campos_anexo:
                arquivo = getattr(anexo, campo)
                dados['anexo'][campo] = arquivo.url if arquivo else None

        return Response(dados, status=200)

    # ATUALIZAÇÃO
    for campo in campos_texto:
        valor = request.data.get(campo)

        if valor:
            setattr(membro, campo, valor)

    membro.save()

    possui_arquivo = False

    for campo in campos_anexo:
        if request.FILES.get(campo):
            possui_arquivo = True
            break

    if possui_arquivo:
        anexo = membro.anexos.first()

        if not anexo:
            anexo = AnexoMembroEquipe.objects.create(
                membro=membro
            )

        for campo in campos_anexo:
            arquivo = request.FILES.get(campo)

            if arquivo:
                setattr(anexo, campo, arquivo)

        anexo.save()

    return Response(
        {"message": "Dados atualizados com sucesso."},
        status=200
    )

# =========================
# ALTERAR DOCUMENTOS DO SOLICITANTE DA PESQUISA
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def alterar_files_solic(request):

    ano = timezone.now().year
    mes_num = timezone.now().month

    meses = [
        None, 'janeiro', 'fevereiro', 'março', 'abril',
        'maio', 'junho', 'julho', 'agosto',
        'setembro', 'outubro', 'novembro', 'dezembro'
    ]

    mes = meses[mes_num]

    id_pesq = request.data.get('pesquisa_id')

    if not id_pesq:
        return Response(
            {"error": "ID da pesquisa não informado."},
            status=status.HTTP_400_BAD_REQUEST
        )

    pesquisa = DadosSolicPesquisa.objects.filter(id=id_pesq).first()

    if not pesquisa:
        return Response(
            {"error": "Pesquisa não encontrada."},
            status=status.HTTP_404_NOT_FOUND
        )

    docs = request.FILES.dict()

    if not docs:
        return Response(
            {"error": "Nenhum arquivo foi enviado."},
            status=status.HTTP_400_BAD_REQUEST
        )

    alterados = []

    try:

        for campo, arquivo_obj in docs.items():

            if campo == "doc_ident":

                if (
                    pesquisa.doc_ident and
                    default_storage.exists(pesquisa.doc_ident.name)
                ):
                    default_storage.delete(pesquisa.doc_ident.name)

                path = default_storage.save(
                    f'docs_pesquisa/{ano}/{mes}/doc_ident/{arquivo_obj.name}',
                    ContentFile(arquivo_obj.read())
                )

                pesquisa.doc_ident = path
                alterados.append("Documento de Identidade")

            elif campo == "doc_cpf":

                if (
                    pesquisa.doc_cpf and
                    default_storage.exists(pesquisa.doc_cpf.name)
                ):
                    default_storage.delete(pesquisa.doc_cpf.name)

                path = default_storage.save(
                    f'docs_pesquisa/{ano}/{mes}/doc_cpf/{arquivo_obj.name}',
                    ContentFile(arquivo_obj.read())
                )

                pesquisa.doc_cpf = path
                alterados.append("CPF")

            elif campo == "doc_seg_vida":

                if (
                    pesquisa.doc_seg_vida and
                    default_storage.exists(pesquisa.doc_seg_vida.name)
                ):
                    default_storage.delete(pesquisa.doc_seg_vida.name)

                path = default_storage.save(
                    f'docs_pesquisa/{ano}/{mes}/doc_seg_vida/{arquivo_obj.name}',
                    ContentFile(arquivo_obj.read())
                )

                pesquisa.doc_seg_vida = path
                alterados.append("Seguro de Vida")

        if not alterados:
            return Response(
                {"error": "Nenhum documento válido foi enviado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        pesquisa.save()

        return Response(
            {
                "success": True,
                "message": f"Documento(s) atualizado(s) com sucesso: {', '.join(alterados)}.",
                "documentos_alterados": alterados
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": "Ocorreu um erro ao atualizar os documentos.",
                "detail": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
#----------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------#