from django.db import models
from colorfield.fields import ColorField

# Create your models here.

class Genre(models.Model):
    title = models.CharField(max_length=20)
    color = ColorField()
    updated = models.DateField(auto_now=True)
    created = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Playlist(models.Model):
    title = models.TextField()
    author = models.ForeignKey('user.Profile', on_delete=models.CASCADE, related_name='playlists')
    image = models.ImageField(upload_to='playlist/image/')
    color = ColorField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    updated = models.DateField(auto_now=True)
    created = models.DateField(auto_now_add=True)
    hide = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title

class Track(models.Model):
    title = models.TextField()
    image = models.ImageField(upload_to='track/image/')
    audio = models.FileField(upload_to='track/audio/')
    video = models.FileField(upload_to='track/video/', null=True, blank=True)
    artists = models.ManyToManyField('user.Artist', related_name='tracks')
    duration = models.IntegerField()
    lyrics = models.TextField(null=True, blank=True)
    genres = models.ManyToManyField('track.Genre', related_name='tracks')
    playlists = models.ManyToManyField('track.Playlist', blank=True, related_name='tracks')
    listen_count = models.BigIntegerField(default=0)
    updated = models.DateField(auto_now=True)
    created = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.title