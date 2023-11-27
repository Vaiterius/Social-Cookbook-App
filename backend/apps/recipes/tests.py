from __future__ import annotations

from typing import TYPE_CHECKING

from django.test import TestCase
from django.contrib.auth import get_user_model

from apps.recipes.models import Recipe, Instruction, Ingredient

if TYPE_CHECKING:
    from apps.users.models import User


class RecipeTests(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="test_user", email="test@gmail.com", password="123"
        )
    
    def _get_generated_test_recipe(self, user: User) -> Recipe:
        return Recipe.objects.create(
            name="Test recipe",
            description="Test description",
            prep_time=10,
            cook_time=20,
            notes="Test notes",
            servings=4,
            difficulty=Recipe.DifficultyLevels.MEDIUM,
            author=user
        )

    def _get_generated_test_instruction(
            self, recipe: Recipe, step: int) -> Instruction:
        return Instruction.objects.create(
            step=step,
            description="Test description",
            recipe=recipe
        )
    
    def _get_generated_test_ingredient(
            self, recipe: Recipe, position: int) -> Ingredient:
        return Ingredient.objects.create(
            position=position,
            name="test ingredient",
            quantity=0.5,
            measurement="CUP",
            recipe=recipe
        )
    
    def test_generated_recipe(self):
        with self.assertRaises(TypeError):
            self._get_generated_test_recipe()
        self._get_generated_test_recipe(self.user)
    
    def test_user_recipes(self):
        self.assertEqual(len(self.user.recipes.all()), 0)

        self._get_generated_test_recipe(self.user)
        self._get_generated_test_recipe(self.user)
        self._get_generated_test_recipe(self.user)

        self.assertEqual(len(self.user.recipes.all()), 3)

        print(self.user.recipes.all())

    def test_recipe_instructions(self):
        recipe = self._get_generated_test_recipe(self.user)

        self.assertEqual(len(recipe.instructions.all()), 0)

        self._get_generated_test_instruction(recipe, 1)
        self._get_generated_test_instruction(recipe, 2)
        self._get_generated_test_instruction(recipe, 3)

        self.assertEqual(len(recipe.instructions.all()), 3)

        print(recipe.instructions.all())

        # TODO more comprehensive tests
    
    def test_recipe_ingredients(self):
        recipe = self._get_generated_test_recipe(self.user)

        self.assertEqual(len(recipe.ingredients.all()), 0)

        self._get_generated_test_ingredient(recipe, 1)
        self._get_generated_test_ingredient(recipe, 2)
        self._get_generated_test_ingredient(recipe, 3)
        self._get_generated_test_ingredient(recipe, 4)
        self._get_generated_test_ingredient(recipe, 5)

        self.assertEqual(len(recipe.ingredients.all()), 5)

        print(recipe.ingredients.all())

        # TODO more comprehensive tests

