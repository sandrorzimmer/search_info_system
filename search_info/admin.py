from django.contrib import admin
from .models import User, Info, Tag

# Register your models here.
admin.site.register(User)
admin.site.register(Info)
admin.site.register(Tag)