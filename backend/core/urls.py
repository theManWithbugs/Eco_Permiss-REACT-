from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    minhas_solic_pesq,
    minhas_solic_ugai,
    solic_pesquisa,
    membros_solic_pesq,
    get_backend_choices,
    only_to_see,
    solic_ugai
)

urlpatterns = [
    # 🔐 AUTH
    path('api/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/refresh/', TokenRefreshView.as_view(), name='refresh'),

    # 📄 DADOS
    # Solicitação de Pesquisa
    path('api/minhas_solic_pesq/', minhas_solic_pesq),

    # Solicitação de UGAI
    path('api/minhas_solic_ugai/', minhas_solic_ugai),

    # Get backend choices
    path('api/get_choices/', get_backend_choices),

    # 🔥 PRINCIPAL
    # Solicitação de pesquisa
    path('api/solic_pesquisa/', solic_pesquisa),
    path('api/membros_solic_pesq/', membros_solic_pesq),

    # path('api/solic_ugai/', )
    path('api/see_ugai/', only_to_see),
    path('api/solic_ugai/', solic_ugai)
]