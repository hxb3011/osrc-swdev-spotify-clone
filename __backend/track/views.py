import os
from django.conf import settings
from django.http import FileResponse, Http404
from django.shortcuts import render
from rest_framework.decorators import api_view, throttle_classes, permission_classes
from rest_framework.filters import SearchFilter
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView, 
    RetrieveUpdateDestroyAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, parsers, views

from user.models import Profile
from user.permissions import ProfilePermission
from .models import Playlist, Track, Genre
from .serializers import (
    CreatePlaylistFromSavedSerializer, PlayListSerializer, PlayListDetailSerializer, TrackSerializer, TrackDetailSerializer, GenreSummarySerializer, GenreSerializer
)

from user.serializers import (
    ProfileSerializer
)

from user.permissions import ProfilePermission

# Create your views here.

class PlaylistListAV(ListCreateAPIView):
    queryset = Playlist.objects.filter(hide=False)
    serializer_class = PlayListSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title']
    
class PlaylistDetailAV(RetrieveUpdateDestroyAPIView):
    queryset = Playlist.objects.filter(hide=False)
    serializer_class = PlayListDetailSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title']
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    
class TrackListAV(ListCreateAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title']
    
class TrackDetailAV(RetrieveUpdateDestroyAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackDetailSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title']
    
class TrackAudioAV(views.APIView):
    def get(self, request, pk, *args, **kwargs):
        track = Track.objects.get(pk=pk)
        audio = track.audio
        
        fullpath = (settings.MEDIA_ROOT / audio.name).as_posix()
        if not os.path.exists(fullpath):
            raise Http404(f'track does not exist')
        
        filename = track.title + os.path.splitext(track.audio.name)[1]
        response = FileResponse(track.audio.open('rb'), as_attachment=True, filename=filename)
        return response
    
class TrackVideoAV(views.APIView):
    def get(self, request, pk, *args, **kwargs):
        track = Track.objects.get(pk=pk)
        video = track.video
        
        fullpath = (settings.MEDIA_ROOT / video.name).as_posix()
        if not os.path.exists(fullpath):
            raise Http404(f'track does not exist')
        
        filename = track.title + os.path.splitext(track.video.name)[1]
        response = FileResponse(track.video.open('rb'), as_attachment=True, filename=filename)
        return response
    
# generate genre list and detail class view
class GenreListAV(ListCreateAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSummarySerializer
    
class GenreDetailAV(RetrieveUpdateDestroyAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class PlaylistCreateAV(CreateAPIView):
    serializer_class = CreatePlaylistFromSavedSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser] 

class PlaylistDestroyAV(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, pk, *args, **kwargs):
        profile = request.user.profile
        Playlist.objects.filter(author=profile).exclude(liked_profiles=profile).get(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)