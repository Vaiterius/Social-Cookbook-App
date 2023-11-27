from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django_countries.widgets import CountrySelectWidget

from .models import User


class UserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("email", "country")
        widget = {"country": CountrySelectWidget()}


class UserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("email", "country")
        widget = {"country": CountrySelectWidget()}