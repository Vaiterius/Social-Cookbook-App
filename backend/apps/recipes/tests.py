from __future__ import annotations

from typing import TYPE_CHECKING

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

from apps.recipes.models import Recipe, Instruction, Ingredient, Tag

if TYPE_CHECKING:
    from apps.users.models import User


class BaseRecipeTests(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="test_user", email="test@gmail.com", password="123"
        )


class RecipeTests(BaseRecipeTests):

    @classmethod
    def get_generated_test_recipe(self, user: User) -> Recipe:
        return Recipe.objects.create(
            name="Test recipe",
            description="Test description",
            prep_time=10,
            cook_time=20,
            notes="Test notes",
            servings=4,
            author=user
        )

    def test_generated_recipe(self):
        with self.assertRaises(TypeError):
            self.get_generated_test_recipe()
        self.get_generated_test_recipe(self.user)

    def test_user_recipes(self):
        self.assertEqual(len(self.user.recipes.all()), 0)

        self.get_generated_test_recipe(self.user)
        self.get_generated_test_recipe(self.user)
        self.get_generated_test_recipe(self.user)

        self.assertEqual(len(self.user.recipes.all()), 3)


class InstructionTests(BaseRecipeTests):

    @classmethod
    def get_generated_test_instruction(
            self, recipe: Recipe, step: int) -> Instruction:
        return Instruction.objects.create(
            step=step,
            description="Test description",
            recipe=recipe
        )
    
    def test_generated_instruction(self):
        with self.assertRaises(IntegrityError):
            Instruction.objects.create(
                description="Test description",
                recipe=RecipeTests.get_generated_test_recipe(self.user)
            )
    
    def test_recipe_instructions(self):
        recipe = RecipeTests.get_generated_test_recipe(self.user)

        self.assertEqual(len(recipe.instructions.all()), 0)

        self.get_generated_test_instruction(recipe, 3)
        self.get_generated_test_instruction(recipe, 1)
        self.get_generated_test_instruction(recipe, 2)

        self.assertEqual(len(recipe.instructions.all()), 3)

        self.get_generated_test_instruction(recipe, 5)
        self.get_generated_test_instruction(recipe, 4)

        # Check order.
        current_step: int = 0
        for instruction in recipe.instructions.all():
            self.assertGreater(instruction.step, current_step)
            current_step = instruction.step
        
        # Ensure instructions belong to owner recipe.
        recipe_2 = RecipeTests.get_generated_test_recipe(self.user)
        self.get_generated_test_instruction(recipe_2, 1)
        self.get_generated_test_instruction(recipe_2, 2)
        self.get_generated_test_instruction(recipe_2, 3)

        for instruction in recipe_2.instructions.all():
            self.assertEqual(instruction.recipe, recipe_2)


class IngredientTests(BaseRecipeTests):

    @classmethod
    def get_generated_test_ingredient(
            self, recipe: Recipe, position: int) -> Ingredient:
        return Ingredient.objects.create(
            position=position,
            name="test ingredient",
            quantity=0.5,
            measurement="CUP",
            recipe=recipe
        )
    
    def test_generated_ingredient(self):
        with self.assertRaises(IntegrityError):
            Ingredient.objects.create(
                name="test ingredient",
                quantity=0.5,
                measurement="CUP",
                recipe=RecipeTests.get_generated_test_recipe(self.user)
        )

    def test_recipe_ingredients(self):
        recipe = RecipeTests.get_generated_test_recipe(self.user)

        self.assertEqual(len(recipe.ingredients.all()), 0)

        self.get_generated_test_ingredient(recipe, 2)
        self.get_generated_test_ingredient(recipe, 3)
        self.get_generated_test_ingredient(recipe, 5)
        self.get_generated_test_ingredient(recipe, 1)
        self.get_generated_test_ingredient(recipe, 4)

        self.assertEqual(len(recipe.ingredients.all()), 5)

        # Check order.
        current_step: int = 0
        for ingredient in recipe.ingredients.all():
            self.assertGreater(ingredient.position, current_step)
            current_step = ingredient.position
        
        # Ensure ingredients belong to owner recipe.
        recipe_2 = RecipeTests.get_generated_test_recipe(self.user)
        self.get_generated_test_ingredient(recipe_2, 1)
        self.get_generated_test_ingredient(recipe_2, 2)
        self.get_generated_test_ingredient(recipe_2, 3)

        for ingredient in recipe_2.instructions.all():
            self.assertEqual(ingredient.recipe, recipe_2)
        
        recipe_3 = RecipeTests.get_generated_test_recipe(self.user)

        # Check formatted quantity and measurement.
        ingredient_1 = Ingredient.objects.create(
            position=1,
            name="Carrots",
            quantity=0.25,
            measurement="OUNCE",
            recipe=recipe_3
        )
        self.assertTrue(
            ingredient_1.quantity
            == 0.25
            == float(Ingredient.QuantityOptions.ONE_FOURTH))
        self.assertTrue(
            ingredient_1.measurement
            == "OUNCE"
            == Ingredient.MeasurementOptions.OUNCE)
        self.assertEqual(ingredient_1.f_quantity, "1/4")
        self.assertEqual(ingredient_1.f_measurement, "oz")

        # Check omitted quantity and measurement.
        ingredient_2 = Ingredient.objects.create(
            position=2,
            name="Dash of salt",
            recipe=recipe_3
        )
        self.assertIsNone(ingredient_2.quantity)
        self.assertEqual(ingredient_2.measurement, "")

        # Check custom quantity and measurement.
        ingredient_3 = Ingredient.objects.create(
            position=3,
            name="Flour",
            quantity=0.15,
            measurement="kilograms",
            recipe=recipe_3
        )
        self.assertEqual(ingredient_3.quantity, 0.15)
        self.assertEqual(ingredient_3.f_quantity, "0.15")
        self.assertEqual(ingredient_3.measurement, "kilograms")
        self.assertEqual(ingredient_3.f_measurement, "kilograms")


class TagTests(BaseRecipeTests):

    @classmethod
    def get_generated_test_tag(self) -> Tag:
        return Tag.objects.create(name="test", tag_type=Tag.Type.CUSTOM)

    def test_generated_tag(self):
        tag = Tag.objects.create()
        self.assertEqual(tag.name, "")
        self.assertEqual(tag.tag_type, Tag.Type.CUSTOM)

    def test_recipe_tags(self):
        recipe = RecipeTests.get_generated_test_recipe(self.user)

        self.assertEqual(len(recipe.tags.all()), 0)

        tag_1 = Tag.objects.create(
            name="VEGETARIAN", tag_type=Tag.Type.DIETARY_PREFERENCE)
        tag_2 = Tag.objects.create(
            name="LUNCH", tag_type=Tag.Type.COURSE)
        tag_3 = Tag.objects.create(
            name="EASY", tag_type=Tag.Type.DIFFICULTY)
        recipe.tags.add(tag_1, tag_2, tag_3)
        self.assertEqual(len(recipe.tags.all()), 3)

        # Check for duplicate and if so use the same one.
        Tag.objects.get_or_create(name="noodles")
        Tag.objects.get_or_create(name="noodles")
        Tag.objects.get_or_create(name="noodles")

        # Should be only one tag of the same name.
        search_duplicates = Tag.objects.filter(name="noodles")
        self.assertEqual(len(search_duplicates), 1)

        Tag.objects.get_or_create(name__iexact="NOODLES")
        Tag.objects.get_or_create(name__iexact="nOoDlEs")
        search_duplicates = Tag.objects.filter(name="noodles")
        self.assertEqual(len(search_duplicates), 1)

        # Check for custom-defined tag.
        tag_4 = Tag.objects.create(name="salad")
        tag_5 = Tag.objects.create(name="tomato")
        recipe.tags.add(tag_4, tag_5)
        self.assertEqual(len(recipe.tags.all()), 5)
        self.assertEqual(tag_4.tag_type, Tag.Type.CUSTOM)
        self.assertEqual(tag_5.tag_type, Tag.Type.CUSTOM)

        # Ensure tag type sorting works.

        # Custom tags.
        custom_tags = Tag.objects.by_type(Tag.Type.CUSTOM)
        for tag in custom_tags:
            self.assertEqual(tag.tag_type, Tag.Type.CUSTOM)

        # Dietary preference tags.
        keto_tag = Tag.objects.create(
            name="KETO", tag_type=Tag.Type.DIETARY_PREFERENCE)
        vegan_tag = Tag.objects.create(
            name="VEGAN", tag_type=Tag.Type.DIETARY_PREFERENCE)
        dietary_pref_tags = Tag.objects.by_type(Tag.Type.DIETARY_PREFERENCE)
        for tag in dietary_pref_tags:
            self.assertEqual(tag.tag_type, Tag.Type.DIETARY_PREFERENCE)
        
        # Course tags.
        snack_tag = Tag.objects.create(name="SNACK", tag_type=Tag.Type.COURSE)
        dinner_tag = Tag.objects.create(
            name="DINNER", tag_type=Tag.Type.COURSE)
        course_tags = Tag.objects.by_type(Tag.Type.COURSE)
        for tag in course_tags:
            self.assertEqual(tag.tag_type, Tag.Type.COURSE)
        
        # Difficulty tags.
        medium_tag = Tag.objects.create(
            name="MEDIUM", tag_type=Tag.Type.DIFFICULTY)
        hard_tag = Tag.objects.create(
            name="HARD", tag_type=Tag.Type.DIFFICULTY)
        difficulty_tags = Tag.objects.by_type(Tag.Type.DIFFICULTY)
        for tag in difficulty_tags:
            self.assertEqual(tag.tag_type, Tag.Type.DIFFICULTY)

