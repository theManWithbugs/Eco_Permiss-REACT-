from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
import uuid

from .choices import YES_OR_NOT, CHOICES_STATUS, IDENTIDADE_GENERO_CHOICES


class User(AbstractUser):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )


class TabelaTeste(models.Model):
    nome = models.CharField(max_length=80)
    cpf = models.CharField(max_length=11)
    telefone = models.CharField(max_length=13)

    def __str__(self):
        return self.nome


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