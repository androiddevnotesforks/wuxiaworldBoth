from wuxiaworld.novels.serializers import LatestChapterSerializer, HomeSerializer
from wuxiaworld.novels.permissions import ReadOnly
from rest_framework import filters
from rest_framework_extensions.cache.decorators import (
    cache_response
)

from rest_framework.generics import ListAPIView
from wuxiaworld.novels.models import Category, Chapter
from django.db.models import Sum, Avg
from rest_framework.response import Response
from wuxiaworld.novels.views.cache_utils import DefaultKeyConstructor

class HomeSerializerView(ListAPIView):
    permission_classes = (ReadOnly,)
    queryset = Category.objects.all()
    serializer_class = HomeSerializer
    
    @cache_response(key_func = DefaultKeyConstructor(), timeout = 60*60*24)
    def list(self, request, *args, **kwargs):
        categories_by_views = self.queryset.annotate(
            avg_views = Avg('novel__views__views')).order_by('-avg_views')[:3]
        serialized = self.get_serializer(categories_by_views, many = True
                    , context={'request': request})
        return Response(serialized.data)

class LatestChaptersSerializerView(ListAPIView):
    permission_classes = (ReadOnly,)
    queryset = Chapter.objects.all()
    serializer_class = LatestChapterSerializer
    pagination_class = None

    def get_queryset(self):
        tag = self.request.params.get('tag')
        category = self.request.params.get('category')
        queryset = self.queryset
        if tag:
            queryset = self.queryset.filter(novel__tag__slug = tag)
        if category:
            queryset = self.queryset.filter(novel__category__slug = category)
        return queryset.order_by("-created_at")[:10].prefetch_related(
        "novelParent").only(
        "novelParent__name", "novelParent__new_image_thumb","created_at",
        "index","novelParent__new_image_thumb", "title", "novSlugChapSlug")
    
    @cache_response(key_func = DefaultKeyConstructor(), timeout = 60)
    def list(self, request, *args, **kwargs):
       return super().list(self, request, *args, **kwargs)