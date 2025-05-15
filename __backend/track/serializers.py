from rest_framework import serializers
from .models import (
    Playlist, Track, Genre
)
from user.models import Profile, Artist

class ArtistSummarySerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    class Meta:
        model = Artist
        fields = ['id', 'first_name', 'last_name']
        
class ProfileSummarySerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    username = serializers.CharField(source='user.username')
    class Meta:
        model = Profile
        fields = ['id', 'first_name', 'last_name', 'username', 'image']

class PlayListSerializer(serializers.ModelSerializer):
    author = ProfileSummarySerializer()
    class Meta:
        model = Playlist
        fields = '__all__'
        
class TrackSerializer(serializers.ModelSerializer):
    artists = ArtistSummarySerializer(many=True)
    genres = serializers.StringRelatedField(many=True)
    liked = serializers.SerializerMethodField()
    
    def get_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return user.profile.liked_tracks.contains(obj)
        return False
    
    class Meta:
        model = Track
        exclude = ['lyrics']
        
class TrackDetailSerializer(serializers.ModelSerializer):
    artists = ArtistSummarySerializer(many=True)
    genres = serializers.StringRelatedField(many=True)
    liked = serializers.SerializerMethodField()
    
    def get_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return user.profile.liked_tracks.contains(obj)
        return False
    
    class Meta:
        model = Track
        fields = '__all__'

class GenreSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'title', 'color']

class GenreSerializer(serializers.ModelSerializer):
    tracks = TrackSerializer(many=True)
    class Meta:
        model = Genre
        fields = '__all__'
     
class TrackSerializerForPlaylistDetail(serializers.ModelSerializer):
    artists = ArtistSummarySerializer(many=True)
    genres = serializers.StringRelatedField(many=True)
    liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Track
        exclude = ['playlists', 'lyrics']
        
    def get_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return user.profile.liked_tracks.contains(obj)
        return False
        
class PlayListDetailSerializer(serializers.ModelSerializer):
    author = ProfileSummarySerializer()
    tracks = TrackSerializerForPlaylistDetail(many=True)
    liked = serializers.SerializerMethodField()
    
    def get_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return user.profile.liked_playlists.contains(obj)
    
    class Meta:
        model = Playlist
        fields = '__all__'
        
class CreatePlaylistFromSavedSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = self.context['request'].user
        if user.is_authenticated:
            profile: Profile = user.profile
            validated_data.update(author=profile)
        playlist: Playlist = super().create(validated_data=validated_data)
        if user.is_authenticated:
            playlist.tracks.add(*profile.liked_tracks.all())
        return playlist
    
    class Meta:
        model = Playlist
        fields = ["title", "image"]
    