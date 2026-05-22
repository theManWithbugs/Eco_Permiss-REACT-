from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

# =====================
# Rotas de Autenticação
# =====================
urlpatterns = [
    # JWT Auth
    path('api/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/refresh/', TokenRefreshView.as_view(), name='refresh'),

    # =====================
    # Rotas de Dados Gerais
    # =====================

    # Solicitações de pesquisa do usuário logado
    path('api/solic_pesq_user/', solic_pesq_user),

    # Membros da equipe de pesquisa
    path('api/membros_equip/', membros_pesq),

    # Solicitações de UGAI do usuário
    path('api/minhas_solic_ugai/', minhas_solic_ugai),

    # Choices para selects do frontend
    path('api/get_choices/', get_choices),

    # Documentos relacionados à pesquisa
    path('api/get_doc/', get_url_doc),

    # Excluir arquivo/documento
    path('api/excluir_arq/', excluir_arq),

    # =====================
    # Rotas Principais de Pesquisa
    # =====================

    # Criar solicitação de pesquisa
    path('api/solic_pesquisa/', solic_pesquisa),
    # Adicionar membros à solicitação de pesquisa
    path('api/membros_solic_pesq/', membros_solic_pesq),

    # =====================
    # Rotas de UGAI
    # =====================

    # Ver todas as UGAIs cadastradas
    path('api/see_ugai/', only_to_see),
    # Criar solicitação de UGAI
    path('api/solic_ugai/', solic_ugai),

    # =====================
    # Upload de Arquivos
    # =====================

    # Upload de arquivos finais de pesquisa
    path('api/file_upload/', FileUploadView.as_view()),
]

# ATENÇÃO: Sempre que adicionar novas rotas, mantenha a organização por blocos temáticos.
# Certifique-se de que as views estejam protegidas por autenticação quando necessário.