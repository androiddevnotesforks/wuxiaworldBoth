from wuxiaworld.novels.permissions import ReadOnly
from wuxiaworld.novels.models import Settings
from wuxiaworld.novels.serializers import SettingsSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action

class SettingsSerializerView(viewsets.ModelViewSet):
    serializer_class = SettingsSerializer
    queryset = Settings.objects.all()

    def get_queryset(self):
        if self.action in ['partial_update', 'update']:
            return self.queryset.filter(profile__user=self.request.user
                         )
        return Settings.objects.none()

    def create(self, request):
        return Response({'message':'Not allowed'},
             status = status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        object = self.queryset.filter(profile__user=self.request.user
                         ).first()
        serializer = SettingsSerializer(object)
        return Response(serializer.data)

    @me.mapping.patch
    def patch_me(self, request):
        m_user = request.user
        object = self.queryset.filter(profile__user=m_user).first()
        serializer = self.get_serializer(object, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
