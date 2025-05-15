from django.db import models

# Create your models here.

GENDER_CHOICES = [
    ('male', 'Male'),
    ('female', 'Female'),
    ('other', 'Other'),
]

class Artist(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='artist/image/', null=True, blank=True)
    cover = models.ImageField(upload_to='artist/cover/')
    updated = models.DateField(auto_now=True)
    created = models.DateField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    
    def __str__(self):
        return self.user.get_full_name() or self.user.username

class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile/image/', null=True, blank=True)
    liked_tracks = models.ManyToManyField('track.Track', blank=True, related_name='liked_profiles')
    liked_playlists = models.ManyToManyField('track.Playlist', blank=True, related_name='liked_profiles')
    followed_artists = models.ManyToManyField('user.Artist', blank=True, related_name='followers')
    birth_date = models.DateField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    updated = models.DateField(auto_now=True)
    created = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.user.username