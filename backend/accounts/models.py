from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    USER_ROLES = (
        ('base', 'Base'),
        ('premium', 'Premium'),
        ('player', 'Player'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    is_email_verified = models.BooleanField(default=False) 
    role = models.CharField(max_length=10, choices=USER_ROLES, default='base')

    def __str__(self):
        return f"{self.user.username} - {self.role}"