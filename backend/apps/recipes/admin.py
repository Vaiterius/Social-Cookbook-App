from django.contrib import admin

from .models import Recipe, Instruction, Ingredient, Tag, Cookbook

admin.site.register(Recipe)
admin.site.register(Instruction)
admin.site.register(Ingredient)
admin.site.register(Tag)
admin.site.register(Cookbook)
