from __future__ import annotations

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from core.storage_backends import PublicMediaStorage, PrivateMediaStorage

from .managers import UserManager


def upload_path(instance: User, filename: str) -> str:
    username: str = instance.username
    return f"{settings.PROFILE_PICTURES_LOCATION}/user<{username}>-{filename}"


class User(AbstractUser):
    email = models.EmailField(_("Email address"), unique=True)
    bio = models.TextField(_("Profile bio"), max_length=150, blank=True)
    profile_picture = models.ImageField(upload_to=upload_path, blank=True)
    country_code = models.CharField(max_length=2, blank=True)
    # TODO change to s3 storage later.
    # profile_picture = models.FileField(
    #     _("Profile picture"), storage=PublicMediaStorage(), blank=True)

    USERNAME_FIELD = "email"  # Define unique identifier.
    REQUIRED_FIELDS = ['username']

    objects = UserManager()  # All objects come from here.

    def __str__(self):
        return self.username

