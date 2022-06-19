from wuxiaworld.novels.permissions import ReadOnly, IsOwner
from wuxiaworld.novels.models import Profile
from wuxiaworld.novels.serializers import ProfileSerializer
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework import status

from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_extensions.cache.decorators import (
    cache_response
)
from wuxiaworld.novels.views.cache_utils import ProfileKeyConstructor
class ProfileSerializerView(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsOwner, ReadOnly]
    pagination_class = None

    def get_queryset(self):
        if self.action == 'list':
            return self.queryset.filter(user=self.request.user)
        return Profile.objects.none()

    @cache_response(key_func = ProfileKeyConstructor(), timeout = 60*60*2)
    @action(detail=False, methods=['get'])
    def me(self, request):
        object = self.queryset.filter(user=self.request.user
                         ).first()
        if not object:
            return Response({'message':'Not found'},
                            status = status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(object)
        return Response(serializer.data)