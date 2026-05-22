from rest_framework import serializers
from .models import DadosSolicPesquisa, MembroEquipe, SolicitacaoUgais

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
        model = MembroEquipe
        exclude = [
            'pesquisa',
        ]

class SerializerMembrosPesq(serializers.ModelSerializer):
    """
    Serializa membros da equipe para listagem.
    """
    class Meta:
        model = MembroEquipe
        fields = '__all__'


# =========================
# SERIALIZERS DE UGAI
# =========================

class SerializerGetDataUgai(serializers.ModelSerializer):
    """
    Serializa SolicitacaoUgais para listagem/detalhe.
    """
    class Meta:
        model = SolicitacaoUgais
        fields = "__all__"

class SeializerRegUGAI(serializers.ModelSerializer):
    """
    Serializa e valida criação de SolicitacaoUgais.
    """
    class Meta:
        model = SolicitacaoUgais
        exclude = [
            'user_solic',
            'quantidade_pessoas',
            'recusa_motivo',
            'status',
        ]
