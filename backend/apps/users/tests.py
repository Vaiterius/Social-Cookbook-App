import random
import string

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.recipes.models import Recipe


class UserTests(TestCase):

    def _get_random_user(self):
        random_username: str = "".join(
            random.choice(string.ascii_letters + string.digits)
            for _ in range(8)
        )
        return get_user_model().objects.create_user(
            username=random_username,
            email=f"{random_username}@gmail.com",
            password="1234"
        )

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="taylor_swift",
            email="tswift@gmail.com",
            password="1234"
        )

    def test_following_system(self):
        follower_1 = self._get_random_user()
        follower_2 = self._get_random_user()
        follower_3 = self._get_random_user()

        # Test following.
        follower_1.follow(self.user)
        follower_2.follow(self.user)
        follower_3.follow(self.user)

        self.assertEqual(len(self.user.followers.all()), 3)
        self.assertTrue(follower_1.is_following(self.user))

        # Do it again, nothing should change.
        follower_1.follow(self.user)
        follower_2.follow(self.user)
        follower_3.follow(self.user)

        self.assertEqual(len(self.user.followers.all()), 3)
        self.assertTrue(follower_2.is_following(self.user))

        # Test unfollowing.
        follower_1.unfollow(self.user)
        follower_2.unfollow(self.user)
        follower_3.unfollow(self.user)

        self.assertEqual(len(self.user.followers.all()), 0)
        self.assertEqual(len(follower_2.following.all()), 0)
        self.assertFalse(follower_3.is_following(self.user))

        # Do it again, nothing should change.
        follower_1.unfollow(self.user)
        follower_2.unfollow(self.user)
        follower_3.unfollow(self.user)

        self.assertEqual(len(self.user.followers.all()), 0)
        self.assertEqual(len(follower_2.following.all()), 0)
        self.assertFalse(follower_3.is_following(self.user))


    def test_blocking_system(self):
        hater_1 = self._get_random_user()
        hater_2 = self._get_random_user()
        hater_3 = self._get_random_user()

        self.assertTrue(not hater_1.has_blocked(self.user))
        self.assertTrue(not self.user.has_blocked(hater_1))
        self.assertEqual(self.user.blocking.count(), 0)
        self.assertEqual(hater_2.blocking.count(), 0)

        # Test blocking.
        self.user.block(hater_1)
        self.user.block(hater_2)

        self.assertEqual(self.user.blocking.count(), 2)
        self.assertTrue(self.user.has_blocked(hater_1))
        self.assertTrue(self.user.has_blocked(hater_2))
        self.assertFalse(self.user.has_blocked(hater_3))

        # Attempts to follow shouldn't work.
        hater_1.follow(self.user)
        hater_2.follow(self.user)

        self.assertFalse(hater_1.is_following(self.user))
        self.assertFalse(hater_2.is_following(self.user))

        # Do it again, nothing should change.
        self.user.block(hater_1)
        self.user.block(hater_2)

        self.assertEqual(self.user.blocking.count(), 2)
        self.assertTrue(self.user.has_blocked(hater_1))
        self.assertTrue(self.user.has_blocked(hater_2))
        self.assertFalse(self.user.has_blocked(hater_3))

        # Test unblocking.
        self.user.unblock(hater_1)
        self.user.unblock(hater_2)

        self.assertEqual(self.user.blocking.count(), 0)
        self.assertFalse(self.user.has_blocked(hater_1))
        self.assertFalse(self.user.has_blocked(hater_2))
        self.assertFalse(self.user.has_blocked(hater_3))

        # Do it again, nothing should change.
        self.user.unblock(hater_1)
        self.user.unblock(hater_2)

        self.assertEqual(self.user.blocking.count(), 0)
        self.assertFalse(self.user.has_blocked(hater_1))
        self.assertFalse(self.user.has_blocked(hater_2))
        self.assertFalse(self.user.has_blocked(hater_3))


class UserManagerTests(TestCase):

    def test_create_user(self):
        user = get_user_model().objects.create_user(
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
        self.assertEqual(admin_user.username, "super_user123")
        self.assertEqual(admin_user.email, "super_user123@gmail.com")
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                username="super_user123",
                email="super_user@gmail.com",
                password="test123", 
                is_superuser=False
            )

