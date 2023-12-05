from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from apps.recipes.models import Recipe


class Like(models.Model):
    """Store a like on an item"""

    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)


class RecipeLike(Like):
    """Store a like on a recipe"""

    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="likes")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="recipe_likes",
        null=True
    )


class CommentLike(Like):
    """Store a like on a comment"""

    comment = models.ForeignKey(
        "Comment", on_delete=models.CASCADE, related_name="likes")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="comment_likes",
        null=True
    )


class Comment(models.Model):
    """Store a comment by a user on a recipe"""

    text = models.TextField(_("Comment text"), max_length=500)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    last_updated = models.DateTimeField(_("Last updated"), auto_now=True)

    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="comments",
        null=True
    )

    def __str__(self) -> str:
        return f"User {self.author.username} says... {self.text}"

