from django.contrib import admin

#Local imports
from . models import *

admin.site.register(User)
admin.site.register(Ugai)
admin.site.register(DadosSolicUgai)
admin.site.register(DadosSolicPesquisa)
admin.site.register(AreaAtuacao)
admin.site.register(UnidadesConservacao)
