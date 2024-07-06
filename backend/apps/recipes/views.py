from __future__ import annotations

from typing import TYPE_CHECKING

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Recipe
from .serializers import RecipeSerializer

if TYPE_CHECKING:
    from rest_framework.request import Request


class RecipesListView(APIView):
    
    def get(self, request: Request) -> Response:
        """List all the recipes in the database with additional meta"""
        recipes = Recipe.objects.all()
        total_count: int = Recipe.objects.count()
        serializer = RecipeSerializer(recipes, many=True)

        return Response(data={
            "total_count": total_count, "recipes": serializer.data
        }, status=status.HTTP_200_OK)


class RecipeDetailView(APIView):

    def get(self, request: Request, pk: int, *args, **kwargs) -> Response:
        """Get a detailed view of a recipe's info"""
        try:
            recipe = Recipe.objects.get(pk=pk)
            serializer = RecipeSerializer(recipe)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Recipe.DoesNotExist:
            return Response(data={"message": "Recipe does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request: Request) -> Response:
        """Store a new user into the database"""
        serializer = RecipeSerializer(request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(data={"message": "Recipe created successfully", "recipe": serializer.data}, status=status.HTTP_201_CREATED)

        return Response(data={"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


