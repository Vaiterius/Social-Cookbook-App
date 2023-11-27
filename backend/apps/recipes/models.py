from __future__ import annotations

from typing import TYPE_CHECKING

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import RecipeManager, InstructionManager, IngredientManager

if TYPE_CHECKING:
    from django.db.models import QuerySet


# def upload_path(instance: Recipe, filename: str) -> str:
#     id: int = instance.id
#     return f"{settings.RECIPE_PICTURES_LOCATION}/recipe-{id}-{filename}"


class Recipe(models.Model):

    class DifficultyLevels(models.TextChoices):
        EASY = "EASY", _("Easy")
        MEDIUM = "MEDIUM", _("Medium")
        HARD = "HARD", _("Hard")

    name = models.CharField(_("Name of recipe"), max_length=75)
    description = models.CharField(_("Description of recipe"), max_length=250)
    prep_time = models.PositiveSmallIntegerField(_("Preparation time"))
    cook_time = models.PositiveSmallIntegerField(_("Cook time"))
    notes = models.CharField(_("Author's notes"), max_length=250)
    servings = models.PositiveSmallIntegerField(_("Servings"))
    difficulty = models.CharField(
        _("Difficulty"), choices=DifficultyLevels.choices, max_length=6)
    # TODO create an uploads app for recipe pictures.
    # TODO create new relationship model to allow up to 5 recipe images.
    # TODO change to s3 storage later.
    # picture = models.ImageField(
    #     _("Picture of prepared food"), upload_to=upload_path)
    # alt_text = models.CharField(_("Alt text"), max_length=180)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    last_updated = models.DateTimeField(_("Last updated"), auto_now=True)

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recipes"
    )

    objects = RecipeManager()

    def __str__(self) -> str:
        return self.name


class Instruction(models.Model):
    step = models.PositiveSmallIntegerField(_("Instruction step number"))
    description = models.CharField(
        _("Instruction description"), max_length=250)

    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="instructions")

    objects = InstructionManager()

    def __str__(self) -> str:
        return f"({self.step}) {self.description}"


class Ingredient(models.Model):

    class QuantityOptions(models.TextChoices):
        ONE_EIGHTH =   "0.125", "1/8"
        ONE_FOURTH =   "0.25", "1/4"
        ONE_THIRD =    "0.33", "1/3"
        ONE_HALF =     "0.5", "1/2"
        TWO_THIRD =    "0.67", "2/3"
        THREE_FOURTH = "0.75", "3/4"
        ONE =          "1.0", "1"
    
    class MeasurementOptions(models.TextChoices):
        PINCH =       "PINCH", "pinch"
        TEASPOON =    "TEASPOON", "tsp"
        TABLESPOON =  "TABLESPOON", "tbsp"
        OUNCE =       "OUNCE", "oz"
        FLUID_OUNCE = "FLUID_OUNCE", "fl. oz"
        CUP =         "CUP", "cup"
        PINT =        "PINT", "pt"
        QUART =       "QUART", "qt"
        GALLON =      "GALLON", "gal"
        POUND =       "POUND", "lb"
        GRAM =        "GRAM", "g"
        MILILITER =   "MILILITER", "mL"

    position = models.PositiveSmallIntegerField(_("Ingredient order number"))
    name = models.CharField(_("Ingredient name"), max_length=50)
    quantity = models.FloatField(
        _("Ingredient quantity"), blank=True, null=True)
    measurement = models.CharField(
        _("Ingredient measurement"), max_length=50, blank=True)

    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="ingredients")

    objects = IngredientManager()

    @property
    def f_quantity(self) -> str:
        """
        Format the quantity as a string with the appropriate label, if exists
        """
        mapping = {
            0.125: self.QuantityOptions.ONE_EIGHTH.label,
            0.25: self.QuantityOptions.ONE_FOURTH.label,
            0.33: self.QuantityOptions.ONE_THIRD.label,
            0.5: self.QuantityOptions.ONE_HALF.label,
            0.67: self.QuantityOptions.TWO_THIRD.label,
            0.75: self.QuantityOptions.THREE_FOURTH.label,
            1.0: self.QuantityOptions.ONE.label,
        }
        return mapping.get(self.quantity, str(self.quantity))

    @property
    def f_measurement(self) -> str:
        """Give the abbreviated format of a measurement, if exists"""
        mapping = {
            "PINCH": self.MeasurementOptions.PINCH.label,
            "TEASPOON": self.MeasurementOptions.TEASPOON.label,
            "TABLESPOON": self.MeasurementOptions.TABLESPOON.label,
            "OUNCE": self.MeasurementOptions.OUNCE.label,
            "FLUID_OUNCE": self.MeasurementOptions.FLUID_OUNCE.label,
            "CUP": self.MeasurementOptions.CUP.label,
            "PINT": self.MeasurementOptions.PINT.label,
            "QUART": self.MeasurementOptions.QUART.label,
            "GALLON": self.MeasurementOptions.GALLON.label,
            "POUND": self.MeasurementOptions.POUND.label,
            "GRAM": self.MeasurementOptions.GRAM.label,
            "MILILITER": self.MeasurementOptions.MILILITER.label,
        }
        return mapping.get(self.measurement, self.measurement)
    
    def __str__(self) -> str:
        return f"{self.f_quantity} {self.f_measurement} {self.name}"

