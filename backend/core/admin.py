from django.contrib import admin

#Local imports
from . models import Ugai, DadosSolicPesquisa, SolicitacaoUgais

admin.site.register(Ugai)
admin.site.register(SolicitacaoUgais)
admin.site.register(DadosSolicPesquisa)
