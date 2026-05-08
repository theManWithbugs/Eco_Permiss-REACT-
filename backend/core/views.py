from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import *
from .models import TabelaTeste, User, DadosSolicPesquisa
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .choices import *

@api_view(['GET'])
def resp_home(request):
    return Response({"message": "API funcionando 🚀"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def minhas_solic(request):
    # objs = TabelaTeste.objects.all()
    # serializer = TesteSerializer(objs, many=True)

    objs = DadosSolicPesquisa.objects.filter(user_solic=request.user)
    serializer = SerializerGetDataPesq(objs, many=True)

    return Response(serializer.data, status=200)


@api_view(['POST'])
def cadastrar_dados_teste(request):
    serializer = TesteSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


# 🔥 PRINCIPAL
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def solic_pesquisa(request):
    print("\n==== REQUEST.DATA ====")
    print(request.data)

    print("\n==== REQUEST USER ====")
    print(request.user)

    serializer = SerializerSolicPesq(data=request.data)

    if serializer.is_valid():

        obj = serializer.save(
            user_solic=request.user,
            status="PENDENTE"
        )

        print("\n==== SALVO ====")
        print(obj)

        return Response(obj.id)

    print("\n==== ERROS ====")
    print(serializer.errors)

    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def receber_dados(request):

    #Dessa forma estou dizendo para o django
    # que isso é uma lista de objetos
    dados = request.data.get('formsets', [])
    id_pesq = request.data.get('id_pesquisa')

    obj_pai = get_object_or_404(DadosSolicPesquisa, id=id_pesq)

    serializer = SerializerMembroEquipe(data=dados, many=True)

    if serializer.is_valid():
        serializer.save(pesquisa=obj_pai)
        return Response("Solicitação realizada com sucesso!", status=200)

    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_backend_choices(request):

    ucs = UCS_CHOICES

    return Response(data=ucs, status=200)
