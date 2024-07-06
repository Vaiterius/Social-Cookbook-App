from __future__ import annotations

from typing import TYPE_CHECKING

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer

if TYPE_CHECKING:
    from rest_framework.request import Request


class UsersListView(APIView):
    
    def get(self, request: Request) -> Response:
        """List all the users in the database with additional meta"""
        users = User.objects.all()
        total_count: int = User.objects.count()
        serializer = UserSerializer(users, many=True)

        return Response(data={
            "total_count": total_count, "users": serializer.data
        }, status=status.HTTP_200_OK)


class UserDetailView(APIView):

    def get(self, request: Request, pk: int, *args, **kwargs) -> Response:
        """Get a detailed view of a user's info"""
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(data={"message": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request: Request) -> Response:
        """Store a new user into the database"""
        serializer = UserSerializer(request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(data={"message": "User created successfully", "user": serializer.data}, status=status.HTTP_201_CREATED)

        return Response(data={"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

