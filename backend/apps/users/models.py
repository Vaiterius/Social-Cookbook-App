from __future__ import annotations

from typing import TYPE_CHECKING

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField

from .managers import UserManager

if TYPE_CHECKING:
    from apps.users.models import User


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

    def follow(self, user: User) -> bool:
        """Follow a user if not already following and not blocked by them"""
        if self.is_following(user) or user.has_blocked(self):
            return False
        self.following.add(user)
        return True

    def unfollow(self, user: User) -> bool:
        """Unfollow a user if already following and not blocked by them"""
        if not self.is_following(user) or user.has_blocked(self):
            return False
        self.following.remove(user)
        return True

    def block(self, user: User) -> bool:
        """Block a user if not already blocked"""
        if self.has_blocked(user):
            return False
        self.blocking.add(user)
        return True

    def unblock(self, user: User) -> bool:
        """Unblock a user if already blocked"""
        if not self.has_blocked(user):
            return False
        self.blocking.remove(user)
        return True
    
    def is_following(self, user: User) -> bool:
        followed_user: User = self.following.filter(username=user.username)
        return followed_user.first() is not None

    def has_blocked(self, user: User) -> bool:
        """See whether this user has blocked that user"""
        blocked_user: User = self.blocking.filter(username=user.username)
        return blocked_user.first() is not None

    def __str__(self) -> str:
        return self.username

