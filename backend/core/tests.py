from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from core.models import DadosPessoais, User, get_path_doc, get_path_rel, get_path_membro_doc


class RecuperacaoCredenciaisTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='teste',
            email='teste@example.com',
            password='123456'
        )
        self.dados = DadosPessoais.objects.create(
            usuario=self.user,
            ori_sexual='MULHER',
            estado='AC',
            municipio='Rio Branco',
            logradouro='Rua A',
            numero=123,
            bairro='Centro',
            telefone='68999999999',
            rg='1234567',
            org_emiss='SSP',
            cpf='529.982.247-25',
            profissao='Analista',
            codigo_recup=0,
        )

    @patch('core.views.enviar_codigo_recuperacao')
    def test_recup_credenc_envia_codigo_por_email(self, mock_enviar_codigo):
        response = self.client.post(
            '/api/recup_credenc/',
            {'email': self.user.email},
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.dados.refresh_from_db()
        self.assertTrue(1000 <= self.dados.codigo_recup <= 9999)

        mock_enviar_codigo.assert_called_once()
        args, kwargs = mock_enviar_codigo.call_args
        self.assertEqual(args[0], self.user.email)
        self.assertEqual(args[1], self.user.username)
        self.assertEqual(args[2], self.dados.codigo_recup)


class AlterarDadosUserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='alterar',
            email='alterar@example.com',
            password='123456',
            first_name='Antigo',
            last_name='Nome'
        )
        self.dados = DadosPessoais.objects.create(
            usuario=self.user,
            ori_sexual='MULHER',
            estado='AC',
            municipio='Rio Branco',
            logradouro='Rua A',
            numero=123,
            bairro='Centro',
            telefone='68999999999',
            rg='1234567',
            org_emiss='SSP',
            cpf='529.982.247-25',
            profissao='Analista',
            codigo_recup=0,
        )

    def test_alt_dados_user_atualiza_campos_do_usuario_e_dados_pessoais(self):
        self.client.force_authenticate(user=self.user)

        payload = {
            'first_name': 'Novo',
            'last_name': 'Sobrenome',
            'email': 'novo@example.com',
            'ori_sexual': 'HOMOSEXUAL',
            'estado': 'AM',
            'municipio': 'Manaus',
            'bairro': 'Flores',
            'numero': 456,
            'telefone': '68988888888',
            'rg': '7654321',
            'org_emiss': 'SRF',
            'cpf': '123.456.789-09',
            'profissao': 'Professor',
            'cep': '69900-000',
            'logradouro': 'Rua B',
            'telefone_fixo': '6833334444',
        }

        response = self.client.post('/api/alt_dados_user/', payload, format='json')

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.dados.refresh_from_db()

        self.assertEqual(self.user.first_name, 'Novo')
        self.assertEqual(self.user.last_name, 'Sobrenome')
        self.assertEqual(self.user.email, 'novo@example.com')
        self.assertEqual(self.dados.ori_sexual, 'HOMOSEXUAL')
        self.assertEqual(self.dados.estado, 'AM')
        self.assertEqual(self.dados.municipio, 'Manaus')
        self.assertEqual(self.dados.bairro, 'Flores')
        self.assertEqual(self.dados.numero, 456)
        self.assertEqual(self.dados.telefone, '68988888888')
        self.assertEqual(self.dados.rg, '7654321')
        self.assertEqual(self.dados.org_emiss, 'SRF')
        self.assertEqual(self.dados.cpf, '123.456.789-09')
        self.assertEqual(self.dados.profissao, 'Professor')
        self.assertEqual(self.dados.cep, '69900-000')
        self.assertEqual(self.dados.logradouro, 'Rua B')
        self.assertEqual(self.dados.telefone_fixo, '6833334444')


class UploadPathTests(TestCase):
    def test_gerar_path_de_upload_sem_caracteres_nao_ascii(self):
        path_doc = get_path_doc(None, 'Documento º 2026.pdf')
        path_rel = get_path_rel(None, 'Relatório 1º.pdf')
        path_membro = get_path_membro_doc(None, 'Foto_ç_ç.pdf')

        self.assertNotIn('º', path_doc)
        self.assertNotIn('º', path_rel)
        self.assertNotIn('ç', path_membro)
        self.assertTrue(path_doc.endswith('Documento_2026.pdf'))
        self.assertTrue(path_rel.endswith('Relatorio_1.pdf'))
        self.assertTrue(path_membro.endswith('Foto_c_c.pdf'))
