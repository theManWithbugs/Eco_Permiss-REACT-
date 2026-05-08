from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    resp_home,
    minhas_solic,
    cadastrar_dados_teste,
    solic_pesquisa,
    receber_dados,
    get_backend_choices
)

urlpatterns = [
    # 🔐 AUTH
    path('api/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/refresh/', TokenRefreshView.as_view(), name='refresh'),

    # 📡 TESTE
    path('api/', resp_home),

    # 📄 DADOS
    path('api/minhas_solic/', minhas_solic),
    path('api/cadastrar_dados/', cadastrar_dados_teste),
    path('api/get_choices/', get_backend_choices),

    # 🔥 PRINCIPAL
    path('api/solic_pesquisa/', solic_pesquisa),

    path('api/receber_dados/', receber_dados)
]