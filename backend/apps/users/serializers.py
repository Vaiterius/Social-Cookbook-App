from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "last_login",
            "username",
            "first_name",
            "last_name",
            "date_joined",
            "email",
            "bio",
            "country"
        ]