"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from os import getenv

api_patterns = [
    path('', include('track.urls')),
    path('', include('user.urls')),
]

urlpatterns = [
    path(getenv('ADMIN_URL'), admin.site.urls),
    # path(getenv('ADMIN_URL'), admin.site.site.urls),
    path('api/', include(api_patterns)),
]

# print(settings.STATIC_URL, settings.STATIC_ROOT, sep=" ")

# if AWS s3 is not used, add static files to urlpatterns
if getenv('STORAGE') != 'AWS_S3':
    from django.conf import settings
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

