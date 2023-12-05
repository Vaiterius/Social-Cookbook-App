from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField

from .managers import UserManager


class User(AbstractUser):
    """
    Define the basic user authentication model along with profile data.
    
    Has relations to an uploaded profile picture and their uploaded recipes.
    There is also a system for users to follow/unfollow each other as well as
    block/unblock each other.
    """

    email = models.EmailField(_("Email address"), unique=True)
    bio = models.TextField(_("Profile bio"), max_length=150, blank=True)
    country = CountryField(
        _("Country"), blank_label="(select country)", blank=True)
    
    following = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="followers"
    )
    blocking = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="blocked_by"
    )

    USERNAME_FIELD = "email"  # Define unique identifier.
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self) -> str:
        return self.username

