import json
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import AnexoMembroEquipe, DadosSolicPesquisa, MembroEquipePesq

User = get_user_model()


class MembrosEquipeUploadTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='teste',
            password='123456',
            email='teste@email.com'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.pesquisa = DadosSolicPesquisa.objects.create(
            user_solic=self.user,
            acao_realizada='Pesquisa Teste',
            foto='SIM',
            licenca_inst='Licença teste',
            inicio_atividade='2026-01-01',
            final_atividade='2026-01-10',
            retorno_comuni='Retorno teste',
            status='PENDENTE'
        )

    @override_settings(MEDIA_ROOT=tempfile.mkdtemp())
    def test_deve_salvar_anexo_para_membro_da_equipe(self):
        arquivo = SimpleUploadedFile(
            'documento.pdf',
            b'conteudo-teste',
            content_type='application/pdf'
        )
        payload = {
            'id_pesquisa': self.pesquisa.id,
            'formsets': json.dumps([
                {
                    'nome': 'Maria Silva',
                    'rg': '1234567',
                    'cpf': '12345678901',
                    'ori_sexual': 'mulher_cis',
                    'instituicao': 'UFABC',
                    'email': 'maria@email.com'
                }
            ])
        }

        response = self.client.post(
            '/api/membros_solic_pesq/',
            data={**payload, 'membro_0': arquivo},
            format='multipart'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(MembroEquipePesq.objects.count(), 1)
        self.assertEqual(AnexoMembroEquipe.objects.count(), 1)
        self.assertTrue(AnexoMembroEquipe.objects.first().documento)
