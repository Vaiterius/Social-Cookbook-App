from __future__ import annotations

from typing import TYPE_CHECKING

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField

from core.storage_backends import PublicMediaStorage, PrivateMediaStorage
from .managers import UserManager
from apps.recipes.models import Recipe

if TYPE_CHECKING:
    from django.db.models import QuerySet


# def upload_path(instance: User, filename: str) -> str:
#     """Image file location for development environment"""
#     username: str = instance.username
#     return f"{settings.PROFILE_PICTURES_LOCATION}/user-{username}-{filename}"


# def external_storage():
#     """Image file location for production environment"""
#     return PublicMediaStorage()


class User(AbstractUser):
    email = models.EmailField(_("Email address"), unique=True)
    bio = models.TextField(_("Profile bio"), max_length=150, blank=True)
    # profile_picture = models.ImageField(
    #     _("Profile picture"), upload_to=upload_path, blank=True)
    country = CountryField(
        _("Country"), blank_label="(select country)", blank=True)
    # TODO create uploads app for user profile pictures.
    # TODO change to s3 storage later.
    # profile_picture = models.FileField(
    #     _("Profile picture"), storage=external_storage, blank=True)

    USERNAME_FIELD = "email"  # Define unique identifier.
    REQUIRED_FIELDS = ['username']

    objects = UserManager()  # All objects come from here.

    def __str__(self) -> str:
        return self.username

