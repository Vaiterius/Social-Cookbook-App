from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import UserCreationForm, UserChangeForm
from .models import User


class UserAdmin(UserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User

    # For displaying all users.
    list_display = ("username", "email", "is_staff", "is_active",)
    list_filter = ("username", "email", "is_staff", "is_active",)

    # For existing users.
    fieldsets = (
        (None, {
            "fields": (
                "username",
                "email",
                "password",
                "bio",
                "country",
                "profile_picture"
            )
        }),
        ("Permissions", {
            "fields": ("is_staff", "is_active", "groups", "user_permissions")
        }),
    )

    # When creating a new user.
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username",
                "email",
                "password1",
                "password2",
                "bio",
                "country",
                "profile_picture",
                "is_staff",
                "is_active",
                "groups",
                "user_permissions"
            )
        }),
    )

    search_fields = ("username",)
    ordering = ("username",)


admin.site.register(User, UserAdmin)
