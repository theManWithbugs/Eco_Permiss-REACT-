from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db.models import Sum
import uuid

#Local imports
from .choices import YES_OR_NOT, CHOICES_STATUS, IDENTIDADE_GENERO_CHOICES, RACA_CHOICES

class User(AbstractUser):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

class DadosSolicPesquisa(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user_solic = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="solicitacoes"
    )

    data_solicitacao = models.DateField(default=timezone.localdate)

    acao_realizada = models.CharField(max_length=80)

    unidade_cons = models.CharField(max_length=500)

    foto = models.CharField(
        choices=YES_OR_NOT,
        max_length=3
    )

    licenca_inst = models.CharField(max_length=120)

    inicio_atividade = models.DateField(default=timezone.localdate)
    final_atividade = models.DateField(default=timezone.localdate)

    retorno_comuni = models.CharField(max_length=150)

    area_atuacao = models.CharField(max_length=500)

    gestor_resp = models.CharField(max_length=80, blank=True, null=True)
    recusa_motivo = models.CharField(max_length=400, blank=True, null=True)

    status = models.CharField(
        choices=CHOICES_STATUS,
        max_length=10
    )

    def __str__(self):
        return f"{self.user_solic} - {self.data_solicitacao}"

    def save(self, *args, **kwargs):
        for field in self._meta.fields:
            if isinstance(field, models.CharField):
                value = getattr(self, field.name)
                if value:
                    setattr(self, field.name, value.upper())
        super().save(*args, **kwargs)

    class Meta:
        db_table = "solic_pesquisa"


class MembroEquipe(models.Model):
    pesquisa = models.ForeignKey(
        DadosSolicPesquisa, on_delete=models.CASCADE, related_name='pesquisa')
    nome = models.CharField(blank=False, null=False, max_length=80)
    rg = models.CharField(blank=False, null=False,
                          max_length=11, verbose_name='RG')
    cpf = models.CharField(blank=False, null=False, max_length=11, verbose_name='CPF')
    ori_sexual = models.CharField(blank=False, null=False, choices=IDENTIDADE_GENERO_CHOICES,
                                  max_length=12, verbose_name='Orientação sexual')
    instituicao = models.CharField(
        blank=False, null=False, verbose_name='Instituição', max_length=80)
    email = models.CharField(max_length=80, blank=False, null=False, verbose_name='Email')
    email_enviado = models.BooleanField(default=False)
    confirmado = models.BooleanField(default=False)
    token_confirmacao = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    data_confirmacao = models.DateTimeField(null=True, blank=True)

    def confirmar(self):
        self.confirmado = True
        self.data_confirmacao = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.nome}"

class Ugai(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=80)
    total_vagas = models.PositiveIntegerField()

    def __str__(self):
        return self.nome

    class Meta:
        db_table = "ugai"

    #"lte less than or equal", menor ou igual a data que foi solicitada
    #"gte greater than or equal": maior ou igual a data que foi solicitada
    def vagas_ocupadas(self, inicio, fim):
        resultado = self.solicitacoes.filter(
            status=True,
            data_inicio__lte=fim,
            data_final__gte=inicio
        ).aggregate(total=Sum("quantidade_pessoas"))

        return resultado['total'] or 0

    # 🔹 Calcula vagas disponíveis
    def vagas_disponiveis(self, inicio, fim):
        return self.total_vagas - self.vagas_ocupadas(inicio, fim)

class SolicitacaoUgais(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user_solic = models.ForeignKey(
        "User",
        on_delete=models.CASCADE
    )

    ugai = models.ForeignKey(
        Ugai,
        on_delete=models.PROTECT,
        related_name="solicitacoes"
    )

    quantidade_pessoas = models.PositiveIntegerField()

    instituicao = models.CharField(max_length=40, blank=True, null=True, verbose_name='Instituição')
    setor = models.CharField(max_length=40, blank=True, null=True)
    cargo = models.CharField(max_length=40, blank=True, null=True)

    ativ_desenv = models.CharField(max_length=200, blank=False, null=False, verbose_name='Atividades que irá desenvolver')
    publico_alvo = models.CharField(max_length=80, blank=False, null=False, verbose_name='Público alvo')

    recusa_motivo = models.CharField(max_length=400, blank=True, null=True)

    status = models.CharField(choices=CHOICES_STATUS, blank=False, null=False, max_length=10)

    data_solicitacao = models.DateField(default=timezone.localdate)
    data_inicio = models.DateField(default=timezone.localdate)
    data_final = models.DateField(default=timezone.localdate)

    def __str__(self):
        return f"{self.ugai.nome} - {self.user_solic}"

    class Meta:
        db_table = "solic_ugai"
        indexes = [
            models.Index(fields=["ugai", "data_inicio", "data_final"]),
        ]

    # Validação de período
    def clean(self):
        if self.data_inicio > self.data_final:
            raise ValidationError("Data final não pode ser menor que data inicial.")

        # Só valida vagas se estiver sendo aprovada
        if self.status:
            vagas = self.ugai.vagas_disponiveis(self.data_inicio, self.data_final)
            if vagas <= 0:
                raise ValidationError("Não há vagas disponíveis para esse período.")

    def save(self, *args, **kwargs):
        for field in self._meta.fields:
            value = getattr(self, field.name)
            if isinstance(field, models.CharField) and value is not None:
                setattr(self, field.name, value.upper())
        super().save(*args, **kwargs)

class MembroEquipeUGAI(models.Model):
    solicitacao_ref = models.ForeignKey(SolicitacaoUgais, on_delete=models.PROTECT, related_name='solicitacao')
    nome = models.CharField(max_length=80, blank=False, null=False)
    email = models.CharField(max_length=150, blank=True, null=True)
    telefone = models.CharField(max_length=11, blank=False, null=False)
    cor_raca = models.CharField(choices=RACA_CHOICES, blank=False, null=False, max_length=10)
    genero = models.CharField(choices=IDENTIDADE_GENERO_CHOICES, blank=False, null=False, max_length=12)
    idade = models.IntegerField(blank=False, null=False)

    def __str__(self):
        return f"{self.nome}"

    class Meta:
        db_table = "equipe_ugai"
        indexes = [
            models.Index(fields=["solicitacao_ref"]),
        ]
