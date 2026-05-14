from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import *
from .models import DadosSolicPesquisa, Ugai, SolicitacaoUgais
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .choices import *

#GET
#This needs atention!
#-----------------------------------------------------------------#
#-----------------------------------------------------------------#
#Recebe todos os dados das solicitações de pesquisa do usuario
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def minhas_solic_pesq(request):
    try:
        objs = DadosSolicPesquisa.objects.filter(user_solic=request.user)

        if not objs.exists():
            return Response("Nenhuma solicitação realizada", status=404)

        serializer = SerializerGetDataPesq(objs, many=True)
        return Response(serializer.data, status=200)
    except Exception as e:
        return Response(f"ocorreu um erro: {e}", status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def minhas_solic_ugai(request):
    try:
        objs = SolicitacaoUgais.objects.filter(user_solic=request.user)
        if not objs.exists():
            return Response("Nenhuma solicitação realizada", status=404)

        serializer = SerializerGetDataUgai(objs, many=True)
        return Response(serializer.data, status=200)
    except Exception as e:
        return Response(f"Ocorreu um erro: {e}", status=500)

@api_view(['GET'])
def get_backend_choices(request):

    ucs = UCS_CHOICES

    return Response(data=ucs, status=200)

#POST
#-----------------------------------------------------------------#
#-----------------------------------------------------------------#

# 🔥 PRINCIPAL
#Salva o obj pai da solicitação de pesquisa
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def solic_pesquisa(request):

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

#Salva membros da equipe de pesquisa
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def membros_solic_pesq(request):

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

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def solic_ugai(request):

#-----------------------------------------------------------------#
#-----------------------------------------------------------------#
# Código teste em andamento aqui, vou fazer usando api rest

# Ver Ugais cadastradas
from rest_framework import serializers
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def only_to_see(request):

    #Ao buscar dados já cadastrados não se usa data=
    #Pois data= espera um json vindo do frontend

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

    class SeializerRegUGAI(serializers.ModelSerializer):
        class Meta:
            model = SolicitacaoUgais
            exclude = [
                'user_solic',
                'quantidade_pessoas',
                'recusa_motivo',
                'status',
            ]

    serializer = SeializerRegUGAI(data=request.data)

    if serializer.is_valid():
        serializer.save(
            user_solic=request.user,
            quantidade_pessoas=2
        )
        return Response(serializer.data, status=200)

    return Response(serializer.errors, status=400)
