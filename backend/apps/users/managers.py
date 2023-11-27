from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifier for
    authentication instead of usernames.
    """
    
    def create_user(
            self,
            username: str,
            email: str,
            password: str,
            **extra_fields
    ) -> AbstractBaseUser:
        """Create and save a user with the given email and password"""
        if not username:
            raise ValueError(_("Username field must be set"))
        if not email:
            raise ValueError(_("Email field must be set"))
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(
        self,
        username: str,
        email: str,
        password: str,
        **extra_fields
    ) -> AbstractBaseUser:
        """Create and save a superuser with the given email and password"""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True"))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True"))
        return self.create_user(username, email, password, **extra_fields)