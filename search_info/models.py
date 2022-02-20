from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.fields import related
from django.utils import timezone


class User(AbstractUser):
    pass

class Tag(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tag_owner")
    text = models.CharField(max_length=128)

    def __str__(self):
        return f"{self.owner} - {self.text}"

class Info(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="info_owner")
    start_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=512)
    text = models.CharField(max_length=16384)
    tags = models.ManyToManyField(Tag)    

    def __str__(self):
        return f"{self.owner} - {self.title}"