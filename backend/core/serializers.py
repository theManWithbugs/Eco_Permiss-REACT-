from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
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

class SerializerAnexosMembrPesq(serializers.ModelSerializer):
    class Meta:
        model = AnexoMembroEquipe
        fields = [
            'id',
            'nome_original',
            'upado_em',
            'doc_ident',
            'doc_cpf',
            'doc_seg_vida',
            'doc_cart_vacin',
            'licenca',
            'outros'
        ]

class SerializerMembrosPesq(serializers.ModelSerializer):
    """
    Serializa membros da equipe para listagem.
    """
    anexos = SerializerAnexosMembrPesq(many=True, read_only=True)

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

class SerializerRegUGAI(serializers.ModelSerializer):
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

class SerializerDadosPss(serializers.ModelSerializer):
    class Meta:
        model = DadosPessoais
        fields = ['rg', 'cpf', 'ori_sexual', 'estado', 'municipio', 'cep', 'org_emiss',
                  'bairro', 'logradouro', 'numero', 'telefone', 'telefone_fixo', 'profissao']

# =========================
# SERIALIZERS DE DOCUMENTOS
# =========================

class SerializerDoc(serializers.ModelSerializer):
    class Meta:
        model = ArquivosRelFinal
        fields = "__all__"


class SerializerDocMembro(serializers.ModelSerializer):
    """
    Serializa anexos de membros da equipe de pesquisa.
    """
    class Meta:
        model = AnexoMembroEquipe
        fields = [
            'id',
            'membro',
            'nome_original',
            'upado_em',
            'doc_ident',
            'doc_cpf',
            'doc_seg_vida',
            'doc_cart_vacin',
            'licenca',
            'outros',
        ]

class UserRegistrationSerializer(serializers.Serializer):
    # Campos do User (username omitido pois geramos abaixo)
    password = serializers.CharField(
        write_only=True,
        error_messages={"required": "O campo senha é obrigatório."}
    )
    email = serializers.EmailField(
        error_messages={
            "required": "O campo e-mail é obrigatório.",
            "invalid": "Insira um formato de e-mail válido."
        }
    )
    first_name = serializers.CharField(error_messages={"required": "O campo nome é obrigatório."})
    last_name = serializers.CharField(error_messages={"required": "O campo sobrenome é obrigatório."})

    # Campos do DadosPessoais (Batendo com as regras do seu Model)
    ori_sexual = serializers.CharField(error_messages={"required": "O campo orientação sexual é obrigatório."})
    estado = serializers.CharField(error_messages={"required": "O campo estado é obrigatório."})
    municipio = serializers.CharField(error_messages={"required": "O campo município é obrigatório."})
    bairro = serializers.CharField(error_messages={"required": "O campo bairro é obrigatório."})

    # Alterado para IntegerField para validar se o frontend enviou um número válido
    numero = serializers.IntegerField(error_messages={
        "required": "O campo número é obrigatório.",
        "invalid": "O número da residência deve conter apenas dígitos numéricos."
    })

    telefone = serializers.CharField(error_messages={"required": "O campo telefone é obrigatório."})
    rg = serializers.CharField(error_messages={"required": "O campo RG é obrigatório."})
    org_emiss = serializers.CharField(error_messages={"required": "O campo órgão emissor é obrigatório."})
    cpf = serializers.CharField(error_messages={"required": "O campo CPF é obrigatório."})
    profissao = serializers.CharField(error_messages={"required": "O campo profissão é obrigatório."})

    # Opcionais (Com allow_blank para aceitar strings vazias do formulário)
    cep = serializers.CharField(required=False, allow_blank=True, default='')
    logradouro = serializers.CharField(required=False, allow_blank=True, default='')
    telefone_fixo = serializers.CharField(required=False, allow_blank=True, default='')

    # Validação de Duplicidade no Banco
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value

    def validate_rg(self, value):
        if DadosPessoais.objects.filter(rg=value).exists():
            raise serializers.ValidationError("Este RG já está cadastrado.")
        return value

    def validate_cpf(self, value):
        if DadosPessoais.objects.filter(cpf=value).exists():
            raise serializers.ValidationError("Este CPF já está cadastrado.")
        return value

    def create(self, validated_data):
        # 1. Geração automatizada do username baseado em nome + sobrenome
        first_name = validated_data['first_name'].strip().lower()
        last_name = validated_data['last_name'].strip().lower()

        first_name = re.sub(r'\s+', '', first_name)
        last_name = re.sub(r'\s+', '', last_name)

        username_base = f"{first_name}.{last_name}"
        username = username_base

        contador = 1
        while User.objects.filter(username=username).exists():
            username = f"{username_base}{contador}"
            contador += 1

        # 2. Criação do Usuário
        user = User.objects.create_user(
            username=username,
            password=validated_data['password'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        # 3. Criação dos Dados Pessoais vinculados
        DadosPessoais.objects.create(
            usuario=user,
            ori_sexual=validated_data['ori_sexual'], # Mapeia para o seu campo do model
            estado=validated_data['estado'],
            municipio=validated_data['municipio'],
            bairro=validated_data['bairro'],
            numero=validated_data['numero'],
            telefone=validated_data['telefone'],
            rg=validated_data['rg'],
            org_emiss=validated_data['org_emiss'], # Traduz o nome enviado pelo frontend
            cpf=validated_data['cpf'],
            profissao=validated_data['profissao'],
            cep=validated_data.get('cep', ''),
            logradouro=validated_data.get('logradouro', ''),
            telefone_fixo=validated_data.get('telefone_fixo', '')
        )

        return user

class AlterarDadosPss(serializers.Serializer):
    email = serializers.EmailField(
        error_messages={
            "required": "O campo e-mail é obrigatório.",
            "invalid": "Insira um formato de e-mail válido."
        }
    )
    first_name = serializers.CharField(error_messages={"required": "O campo nome é obrigatório."})
    last_name = serializers.CharField(error_messages={"required": "O campo sobrenome é obrigatório."})

    ori_sexual = serializers.CharField(error_messages={"required": "O campo orientação sexual é obrigatório."})
    estado = serializers.CharField(error_messages={"required": "O campo estado é obrigatório."})
    municipio = serializers.CharField(error_messages={"required": "O campo município é obrigatório."})
    bairro = serializers.CharField(error_messages={"required": "O campo bairro é obrigatório."})

    numero = serializers.IntegerField(error_messages={
        "required": "O campo número é obrigatório.",
        "invalid": "O número da residência deve conter apenas dígitos numéricos."
    })

    telefone = serializers.CharField(error_messages={"required": "O campo telefone é obrigatório."})
    rg = serializers.CharField(error_messages={"required": "O campo RG é obrigatório."})
    org_emiss = serializers.CharField(error_messages={"required": "O campo órgão emissor é obrigatório."})
    cpf = serializers.CharField(error_messages={"required": "O campo CPF é obrigatório."})
    profissao = serializers.CharField(error_messages={"required": "O campo profissão é obrigatório."})

    cep = serializers.CharField(required=False, allow_blank=True, default='')
    logradouro = serializers.CharField(required=False, allow_blank=True, default='')
    telefone_fixo = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_email(self, value):
        if User.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value

    def validate_rg(self, value):
        if DadosPessoais.objects.filter(rg=value).exclude(usuario=self.instance).exists():
            raise serializers.ValidationError("Este RG já está cadastrado.")
        return value

    def validate_cpf(self, value):
        if DadosPessoais.objects.filter(cpf=value).exclude(usuario=self.instance).exists():
            raise serializers.ValidationError("Este CPF já está cadastrado.")
        return value

    def update(self, instance, validated_data):
        user = instance
        user.email = validated_data.get('email', user.email)
        user.first_name = validated_data.get('first_name', user.first_name)
        user.last_name = validated_data.get('last_name', user.last_name)
        user.save()

        dados_pessoais = self.context.get('dados_pessoais')
        if dados_pessoais is None:
            dados_pessoais = get_object_or_404(DadosPessoais, usuario=user)

        dados_pessoais.ori_sexual = validated_data.get('ori_sexual', dados_pessoais.ori_sexual)
        dados_pessoais.estado = validated_data.get('estado', dados_pessoais.estado)
        dados_pessoais.municipio = validated_data.get('municipio', dados_pessoais.municipio)
        dados_pessoais.bairro = validated_data.get('bairro', dados_pessoais.bairro)
        dados_pessoais.numero = validated_data.get('numero', dados_pessoais.numero)
        dados_pessoais.telefone = validated_data.get('telefone', dados_pessoais.telefone)
        dados_pessoais.rg = validated_data.get('rg', dados_pessoais.rg)
        dados_pessoais.org_emiss = validated_data.get('org_emiss', dados_pessoais.org_emiss)
        dados_pessoais.cpf = validated_data.get('cpf', dados_pessoais.cpf)
        dados_pessoais.profissao = validated_data.get('profissao', dados_pessoais.profissao)
        dados_pessoais.cep = validated_data.get('cep', dados_pessoais.cep)
        dados_pessoais.logradouro = validated_data.get('logradouro', dados_pessoais.logradouro)
        dados_pessoais.telefone_fixo = validated_data.get('telefone_fixo', dados_pessoais.telefone_fixo)
        dados_pessoais.save()

        return user