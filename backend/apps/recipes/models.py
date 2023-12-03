from __future__ import annotations

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import (
    RecipeManager, InstructionManager, IngredientManager, TagManager)


class Recipe(models.Model):
    """
    Stores a food recipe with basic info, authorship, and timestamps.
    
    Has relations to its list of instructions, ingredients, related tags,
    recipe pictures, likes, and comments.
    """

    name = models.CharField(_("Name of recipe"), max_length=75)
    description = models.TextField(_("Description of recipe"), max_length=500)
    prep_time = models.PositiveSmallIntegerField(_("Preparation time"))
    cook_time = models.PositiveSmallIntegerField(_("Cook time"))
    notes = models.TextField(_("Author's notes"), max_length=500)
    servings = models.PositiveSmallIntegerField(_("Servings"))
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    last_updated = models.DateTimeField(_("Last updated"), auto_now=True)

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recipes"
    )
    tags = models.ManyToManyField("Tag", related_name="recipes")

    objects = RecipeManager()

    def __str__(self) -> str:
        return self.name


class Instruction(models.Model):
    """
    Stores a single instruction of a recipe with a step number to track its
    position in the list.
    """

    step = models.PositiveSmallIntegerField(_("Instruction step number"))
    description = models.CharField(
        _("Instruction description"), max_length=250)

    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="instructions")

    objects = InstructionManager()

    def __str__(self) -> str:
        return f"({self.step}) {self.description}"


class Ingredient(models.Model):
    """
    Stores a single ingredient of a recipe comprised of the ingredient name,
    amount, and unit measurement.
    
    Includes pre-defined options for quantity
    amount and measurements, though the user may store their own custom value.
    """

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


class Tag(models.Model):
    """
    Stores a tag which attaches to a recipe in order to categorize them by
    cuisine, courses, dietary preference, difficulty, and any custom,
    user-defined ones.

    Has a type defined to provide sorting functionalities.

    Must use `get_or_create(name__iexact=<tag_name>)` when creating tags.
    """

    class Type(models.TextChoices):
        DIETARY_PREFERENCE = "DIETARY_PREFERENCE", _("dietary preference")
        COURSE = "COURSE", _("course")
        DIFFICULTY = "DIFFICULTY", _("difficulty")
        CUSTOM = "CUSTOM", _("custom")

    class DietaryPreferenceOptions(models.TextChoices):
        VEGETARIAN =  "VEGETARIAN", _("vegetarian")
        VEGAN =       "VEGAN", _("vegan")
        PALEO =       "PALEO", _("paleo")
        KETO =        "KETO", _("keto"),
        GLUTEN_FREE = "GLUTEN_FREE", _("gluten-free")
        DAIRY_FREE =  "DAIRY_FREE", _("dairy-free")
        NUT_FREE =    "NUT_FREE", _("nut-free")
        LOW_CARB =    "LOW_CARB", _("low-carb")
        LOW_FAT =     "LOW_FAT", _("low-fat")
        LOW_FODMAP =  "LOW_FODMAP", _("low-FODMAP")
        KOSHER =      "KOSHER", _("kosher")
        HALAL =       "HALAL", _("halal")
    
    class CoursesOptions(models.TextChoices):
        BREAKFAST = "BREAKFAST", _("breakfast")
        LUNCH = "LUNCH", _("lunch")
        DINNER = "DINNER", _("dinner")
        APPETIZER = "APPETIZER", _("appetizer")
        SNACK = "SNACK", _("snack")
        DRINK = "DRINK", _("drink")
    
    class DifficultyOptions(models.TextChoices):
        EASY = "EASY", _("easy")
        MEDIUM = "MEDIUM", _("medium")
        HARD = "HARD", _("hard")
    
    name = models.CharField(_("Tag name"), max_length=15)
    tag_type = models.CharField(
        _("Tag type"),
        choices=Type.choices,
        default=Type.CUSTOM,
        max_length=20
    )

    objects = TagManager()

    def __str__(self) -> str:
        return self.name.lower()

