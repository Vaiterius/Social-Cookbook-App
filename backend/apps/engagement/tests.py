from __future__ import annotations

from typing import TYPE_CHECKING

from django.test import TestCase
from django.contrib.auth import get_user_model

from apps.recipes.tests import RecipeTests
from apps.users.tests import UserTests
from .models import Comment, CommentLike

if TYPE_CHECKING:
    from apps.recipes.models import Recipe
    from apps.users.models import User


class TestEngagement(TestCase):

    @classmethod
    def get_random_comment(self, recipe: Recipe, author: User) -> Comment:
        return Comment.objects.create(
            text="Test comment test comment",
            recipe=recipe,
            author=author
        )

    def setUp(self):
        self.recipe = RecipeTests.get_generated_test_recipe(
            UserTests.get_random_user())

    def test_comment_likes(self):
        # Test adding likes to a comment.
        liker_1 = UserTests.get_random_user()
        liker_2 = UserTests.get_random_user()
        liker_3 = UserTests.get_random_user()

        commenter = UserTests.get_random_user()
        comment = self.get_random_comment(self.recipe, commenter)

        like_1, created = CommentLike.objects.get_or_create(
            comment=comment, author=liker_1)
        # print(f"Comment created: {created}")

        comment.likes.add(like_1)

        # print(comment.likes.all())
        self.assertEqual(comment.likes.count(), 1)

        like_2, created = CommentLike.objects.get_or_create(comment=comment, author=liker_2)
        like_3, created = CommentLike.objects.get_or_create(comment=comment, author=liker_3)

        comment.likes.add(like_2, like_3)

        self.assertEqual(comment.likes.count(), 3)

        comment.likes.add(like_1, like_2, like_3)
        # print(comment.likes.all())
        self.assertEqual(comment.likes.count(), 3)

        # Test removing likes.
        

        # Test if liker's accounts become deleted.

        # Test if comment gets deleted.
        pass

    def test_recipe_likes(self):
        # Test adding likes to a recipe.

        # Test removing likes.

        # Test if liker's accounts become deleted.

        # Test if recipe gets deleted.
        pass

    def test_recipe_comments(self):
        # Test adding comments to a recipe.

        # Test removing comments.

        # Test if commenter's accounts become deleted.

        # Test if recipe gets deleted.
        pass

