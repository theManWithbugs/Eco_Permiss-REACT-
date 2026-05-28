from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import *
from .models import DadosSolicPesquisa, Ugai, SolicitacaoUgais, ArquivosRelFinal
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .choices import UCS_CHOICES, CHOICES_AREA_ATUACAO

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.paginator import Paginator
from django.forms import model_to_dict
from django.http import JsonResponse


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
def solic_pesq_user(request):
    """
    Retorna as solicitações de pesquisa do usuário autenticado, paginadas.
    Atenção: Se o formato dos campos unidade_cons ou area_atuacao mudar no model, ajuste o split!
    """
    objs = DadosSolicPesquisa.objects.filter(user_solic=request.user).order_by('-data_solicitacao')
    page_number = request.GET.get('page', 1)
    paginator = Paginator(objs, 10)
    page_obj = paginator.get_page(page_number)

    itens_json = []
    for item in page_obj:
        d = model_to_dict(item)
        d['id'] = str(item.id)
        # ATENÇÃO: Os campos abaixo assumem string separada por vírgula
        d['unidade_cons'] = item.unidade_cons.split(',')
        d['area_atuacao'] = item.area_atuacao.split(',')
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
def minhas_solic_ugai(request):
    """
    Retorna as solicitações de UGAI do usuário autenticado.
    """

    objs = SolicitacaoUgais.objects.filter(
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
    ucs = UCS_CHOICES
    areas_atuacao = CHOICES_AREA_ATUACAO
    dados = {
        "choices_ucs": ucs,
        "choices_area": areas_atuacao
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
    id = request.data.get('id')
    try:
        membros = MembroEquipe.objects.filter(pesquisa=id)
        serializer = SerializerMembrosPesq(membros, many=True)
        return Response(serializer.data, status=200)
    except Exception as e:
        # ATENÇÃO: Logar exceções em produção
        return Response(f"Ocorreu um erro: {e}", status=500)


# Salva o objeto principal da solicitação de pesquisa
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def solic_pesquisa(request):
    """
    Cria uma nova solicitação de pesquisa.
    """
    serializer = SerializerSolicPesq(data=request.data)

    if serializer.is_valid():
        obj = serializer.save(
            user_solic=request.user,
            status="PENDENTE"
        )
        serializer_get = SerializerGetDataPesq(instance=obj)
        return Response(serializer_get.data)
    return Response(serializer.errors, status=400)


# Salva membros da equipe de pesquisa
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def membros_solic_pesq(request):
    """
    Salva uma lista de membros para uma pesquisa específica.
    Atenção: espera um array de objetos em 'formsets'.
    """
    dados = request.data.get('formsets', [])
    id_pesq = request.data.get('id_pesquisa')
    obj_pai = get_object_or_404(DadosSolicPesquisa, id=id_pesq)
    serializer = SerializerMembroEquipe(data=dados, many=True)
    if serializer.is_valid():
        serializer.save(pesquisa=obj_pai)
        return Response("Solicitação realizada com sucesso!", status=200)
    return Response(serializer.errors, status=400)


# =========================
# TESTES E UTILITÁRIOS
# =========================
from rest_framework import serializers
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def only_to_see(request):
    """
    Retorna todas as UGAIs cadastradas.
    """
    class SerializerToSee(serializers.ModelSerializer):
        class Meta:
            model = Ugai
            fields = "__all__"
    objs = Ugai.objects.all()
    serializer = SerializerToSee(objs, many=True)
    return Response(serializer.data, status=200)



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
    class SerializerDoc(serializers.ModelSerializer):
        class Meta:
            model = ArquivosRelFinal
            fields = "__all__"
    id_pesquisa = request.data.get('id_pesq')
    pesquisa = get_object_or_404(DadosSolicPesquisa, id=id_pesquisa)
    if not id_pesquisa:
        return Response(status_404, status=404)
    try:
        objs = ArquivosRelFinal.objects.filter(pesquisa=pesquisa)
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
class FileUploadView(APIView):
    """
    View para upload de arquivos PDF finais de pesquisa.
    Atenção: só aceita PDF. Espera 'documento' e 'pesquisa_id' no body.
    """
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        arquivo_recebido = request.FILES.get('documento')
        pesquisa_id = request.data.get('pesquisa_id')
        pesquisa = get_object_or_404(DadosSolicPesquisa, id=pesquisa_id)
        if not arquivo_recebido:
            return Response("Nenhum arquivo enviado", status=400)
        if arquivo_recebido:
            arq_nome = arquivo_recebido.name
            doc_type = arq_nome.split('.')[-1]
            if doc_type != 'pdf':
                return Response(f"Apenas formato pdf aceito!", status=500)
            else:
                try:
                    ArquivosRelFinal.objects.create(
                        pesquisa=pesquisa,
                        documento=arquivo_recebido
                    )
                    return Response("Arquivo Salvo com sucesso!", status=201)
                except Exception as e:
                    # ATENÇÃO: Logar exceções em produção
                    return Response(f"Ocorreu um erro: {e}", status=500)
