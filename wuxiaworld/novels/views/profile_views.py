from wuxiaworld.novels.permissions import ReadOnly, IsOwner
from wuxiaworld.novels.models import Profile
from wuxiaworld.novels.serializers import ProfileSerializer
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework.status import status
from rest_framework.response import Response


class ProfileSerializerView(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsOwner, ReadOnly]
    pagination_class = None

    def get_queryset(self):
        if self.action == 'list':
            return self.queryset.filter(user=self.request.user)
        return Profile.objects.none()

    def me(self, request):
        object = self.queryset.filter(user=self.request.user
                         ).first()
        if not object:
            return Response({'message':'Not found'},
                            status = status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(object)
        return Response(serializer.data)