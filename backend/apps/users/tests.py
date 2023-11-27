from django.contrib.auth import get_user_model
from django.test import TestCase


class UserManagerTests(TestCase):

    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            username="user123",
            email="user123@gmail.com",
            password="test123"
        )
        self.assertEqual(user.username, "user123")
        self.assertEqual(user.email, "user123@gmail.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        # Required and valid fields must be passed in.
        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(TypeError):
            User.objects.create_user(username="")
        with self.assertRaises(TypeError):
            User.objects.create_user(username="", email="")
        with self.assertRaises(ValueError):
            User.objects.create_user(username="", email="", password="test123")
    
    def test_create_superuser(self):
        User = get_user_model()
        admin_user = User.objects.create_superuser(
            username="super_user123",
            email="super_user123@gmail.com",
            password="test123"
        )
        self.assertEqual(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                username="super_user123",
                email="super_user@gmail.com",
                password="test123", 
                is_superuser=False
            )
