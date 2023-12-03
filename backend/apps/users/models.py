from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField

from .managers import UserManager


class User(AbstractUser):
    """
    Define the basic user authentication model along with profile data.
    
    Has a relations to a profile picture and their uploaded recipes.
    """

    email = models.EmailField(_("Email address"), unique=True)
    bio = models.TextField(_("Profile bio"), max_length=150, blank=True)
    country = CountryField(
        _("Country"), blank_label="(select country)", blank=True)

    USERNAME_FIELD = "email"  # Define unique identifier.
    REQUIRED_FIELDS = ['username']

    objects = UserManager()  # All objects come from here.

    def __str__(self) -> str:
        return self.username

