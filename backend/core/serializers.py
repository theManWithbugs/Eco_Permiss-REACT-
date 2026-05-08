from rest_framework import serializers
from .models import TabelaTeste, DadosSolicPesquisa, MembroEquipe


class TesteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TabelaTeste
        fields = '__all__'

class SerializerGetDataPesq(serializers.ModelSerializer):
    class Meta:
        model = DadosSolicPesquisa
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if data.get('unidade_cons'):
            data['unidade_cons'] = data['unidade_cons'].upper().split(",")

        if data.get('area_atuacao'):
            data['area_atuacao'] = data['area_atuacao'].split(",")

        return data

class SerializerSolicPesq(serializers.ModelSerializer):

    class Meta:
        model = DadosSolicPesquisa
        exclude = [
            'user_solic',
            'data_solicitacao',
            'gestor_resp',
            'recusa_motivo',
            'status'
        ]

    # 🔥 VALIDAÇÕES
    def validate(self, data):
        print("\n==== VALIDANDO DADOS ====")
        print(data)

        if data['inicio_atividade'] > data['final_atividade']:
            raise serializers.ValidationError({
                "data": "Data final não pode ser menor que a inicial"
            })

        return data

    # 🔥 CREATE CUSTOM (DEBUG TOTAL)
    def create(self, validated_data):
        print("\n==== CREATE ====")
        print(validated_data)

        return super().create(validated_data)

class SerializerMembroEquipe(serializers.ModelSerializer):

    class Meta:
        model = MembroEquipe
        exclude = [
            'pesquisa',
        ]