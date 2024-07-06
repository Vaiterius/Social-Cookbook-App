"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from apps.users import views as user_views
from apps.recipes import views as recipe_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Accounts.
    path('api/users/', user_views.UsersListView.as_view()),
    path('api/users/<int:pk>/', user_views.UserDetailView.as_view()),

    # Recipes.
    path('api/recipes/', recipe_views.RecipesListView.as_view()),
    path('api/recipes/<int:pk>/', recipe_views.RecipeDetailView.as_view())
]
