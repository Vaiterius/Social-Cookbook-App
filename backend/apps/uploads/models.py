from __future__ import annotations

from typing import TYPE_CHECKING

from django.conf import settings
from django.db import models

from core.storage_backends import PublicMediaStorage, PrivateMediaStorage

if TYPE_CHECKING:
    from storages.backends.s3boto3 import S3Boto3Storage

    from apps.recipes.models import Recipe
    from apps.users.models import User


class PictureUpload(models.Model):
    """Store an image uploader by a user"""
    
    def _upload_path_recipes(self, instance: Recipe, filename: str) -> str:
        """Local upload path for recipe pictures"""
        id: int = instance.id
        return f"{settings.RECIPE_PICTURES_LOCATION}/recipe-{id}-{filename}"

    def _upload_path_profiles(self, instance: User, filename: str) -> str:
        """Local upload path for profile pictures"""
        username: str = instance.username
        return (
            f"{settings.PROFILE_PICTURES_LOCATION}/user-{username}-{filename}")
    
    @property
    def external_storage(self) -> S3Boto3Storage:
        """Image file location for production environment"""
        return PublicMediaStorage()


class RecipePictureUpload(PictureUpload):
    """Store the recipe picture (or pictures) by a user"""
    pass


class UserProfilePictureUpload(PictureUpload):
    """Store the profile picture of a user"""
    pass

