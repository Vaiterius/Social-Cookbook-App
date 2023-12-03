from __future__ import annotations

from typing import TYPE_CHECKING

from django.db import models
from django.db.models.query import QuerySet

if TYPE_CHECKING:
    from apps.recipes.models import Tag


class RecipeManager(models.Manager):
    
    def get_queryset(self) -> QuerySet:
        """Sort recipes by latest first"""
        return super().get_queryset().order_by("-created_at")


class InstructionManager(models.Manager):
    
    def get_queryset(self) -> QuerySet:
        """Sort instruction steps in the order they were given"""
        return super().get_queryset().order_by("step")


class IngredientManager(models.Manager):
    
    def get_queryset(self) -> QuerySet:
        """Sort ingredients in the order they were given"""
        return super().get_queryset().order_by("position")


class TagManager(models.Manager):
    
    def by_type(self, tag_type: Tag.Type) -> QuerySet:
        """Return tags sorted by type"""
        return self.filter(tag_type=tag_type)

