from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

# =====================
# Rotas de Autenticação
# =====================
urlpatterns = [
    # =====================
    # JWT AUTH
    # =====================
    path('api/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/refresh/', TokenRefreshView.as_view(), name='refresh'),

    # =====================
    # REGISTRAR USUÁRIO PADRÃO
    # =====================
    path('api/reg_user/', reg_usuario),

    # =====================
    # RECUPERAR CREDENCIAIS
    # =====================
    path('api/recup_credenc/', recup_credenc),
    path('api/validar_codigo_recup/', validar_codigo_recup),
    path('api/red_senha/', redefinir_senha),

    # =====================
    # ALTERAR DADOS DO USUARIO
    # =====================
    path('api/alt_dados_user/', alterar_dados_user),

    # =====================
    # PEGAR DADOS DO USUARIO
    # =====================
    path('api/dados_user/', get_user_data),

    # =====================
    # PEGAR CHOICES GLOBAIS
    # =====================
    path('api/get_choices/', get_choices),

    # =====================
    # SOLICITAÇÕES DE PESQUISA
    # =====================
    path('api/solic_pesq_user/', solic_pesq_user),
    path('api/minhas_solic_ugai/', minhas_solic_ugai),

    # =====================
    # CRIAR SOLIC_PESQ
    # =====================
    path('api/solic_pesquisa/', solic_pesquisa),

    # =====================
    # ROTAS DE UGAI
    # =====================
    # Criar solicitação de UGAI
    path('api/solic_ugai/', solic_ugai),

    # =========================
    # INFORMAÇÕES DE PESQUISA
    # =========================
    path('api/info_pesq/', info_pesquisa),
    path('api/membros_equip/', membros_pesq),
    #Infomações dos membros inclusos na pesquisa
    path('api/info_memb_pesq/', info_membro_pesq),
    # Adicionar membros à solicitação de pesquisa
    path('api/membros_solic_pesq/', membros_solic_pesq),
    # Upload de arquivos finais de pesquisa
    path('api/file_upload/', file_upload),
    # Altera dados e arquivos do membro incluso
    path('api/change_file_solic/', alterar_files_solic),
    path('api/alt_dados_memb/', alt_doc_memb_pesq),
    # Documentos relacionados à pesquisa
    path('api/get_doc/', get_url_doc),
    # Excluir arquivo/documento
    path('api/excluir_arq/', excluir_arq),
]
