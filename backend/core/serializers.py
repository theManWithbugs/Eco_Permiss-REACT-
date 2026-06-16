from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *

User = get_user_model()

# =========================
# SERIALIZERS DE PESQUISA
# =========================

class SerializerGetDataPesq(serializers.ModelSerializer):
    """
    Serializa DadosSolicPesquisa para listagem/detalhe.
    ATENÇÃO: Altera unidade_cons e area_atuacao para lista.
    """
    class Meta:
        model = DadosSolicPesquisa
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get('unidade_cons'):
            data['unidade_cons'] = data['unidade_cons'].upper().split(",")
        if data.get('area_atuacao'):
            data['area_atuacao'] = data['area_atuacao'].split(",")
        return data


class SerializerSolicPesq(serializers.ModelSerializer):
    """
    Serializa e valida criação de DadosSolicPesquisa.
    """
    class Meta:
        model = DadosSolicPesquisa
        exclude = [
            'user_solic',
            'data_solicitacao',
            'unidades',
            'area_atuacao',
            'gestor_resp',
            'recusa_motivo',
            'status'
        ]

    def validate(self, data):
        # Validação de datas
        if data['inicio_atividade'] > data['final_atividade']:
            raise serializers.ValidationError({
                "data": "Data final não pode ser menor que a inicial"
            })
        return data

    def create(self, validated_data):
        # Pode customizar criação se necessário
        return super().create(validated_data)


# =========================
# SERIALIZERS DE MEMBROS
# =========================

class SerializerMembroEquipe(serializers.ModelSerializer):
    """
    Serializa membros da equipe para criação.
    """
    class Meta:
        model = MembroEquipePesq
        exclude = [
            'pesquisa',
        ]

class SerializerMembrosPesq(serializers.ModelSerializer):
    """
    Serializa membros da equipe para listagem.
    """
    class Meta:
        model = MembroEquipePesq
        fields = '__all__'


# =========================
# SERIALIZERS DE UGAI
# =========================

class SerializerGetDataUgai(serializers.ModelSerializer):
    """
    Serializa DadosSolicUgai para listagem/detalhe.
    """
    class Meta:
        model = DadosSolicUgai
        fields = "__all__"

class SeializerRegUGAI(serializers.ModelSerializer):
    """
    Serializa e valida criação de DadosSolicUgai.
    """
    class Meta:
        model = DadosSolicUgai
        exclude = [
            'user_solic',
            'quantidade_pessoas',
            'recusa_motivo',
            'status',
        ]

# =========================
# SERIALIZERS DE USER
# =========================

class SerializerGetUser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username']


# =========================
# SERIALIZERS DE DOCUMENTOS
# =========================

class SerializerDoc(serializers.ModelSerializer):
    class Meta:

        model = ArquivosRelFinal
        fields = "__all__"
