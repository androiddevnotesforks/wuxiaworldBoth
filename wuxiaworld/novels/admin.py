from django.contrib import admin
from .models import (Announcement, Novel,Author,Category,Chapter,NovelViews, 
                    Tag, Profile, Bookmark, Settings, BlacklistPattern, Review, Report)
from django.utils.html import format_html
from django.utils.timezone import now
from django.db.models import Count, F, Value
from django.db.models import OuterRef, Subquery

def repeat_scrape_on(modeladmin, request, queryset):
    queryset.update(repeatScrape=True)

def repeat_scrape_off(modeladmin, request, queryset):
    queryset.update(repeatScrape=False)

def novel_turn_eighteen(modeladmin, request, queryset):
    for query in queryset:
        chapters = Chapter.objects.filter(novelParent=query)
        previous_eighteen = chapters.first().is_eighteen
        chapters.update(is_eighteen= not previous_eighteen)

# Register your models here.
@admin.register(Novel)
class NovelAdmin(admin.ModelAdmin):
    list_display = ["name", "repeatScrape", "created_at", "updated_at", "is_eighteen"]
    actions = [repeat_scrape_on,repeat_scrape_off, novel_turn_eighteen]
    list_filter = ("source_novel__base_url", "repeatScrape","category", "chapter__is_eighteen")
    search_fields = ['name']

    def get_queryset(self, request):
        qs = super(NovelAdmin, self).get_queryset(request)
        chapters = Chapter.objects.filter(novelParent = OuterRef('slug'))
        new_qs = qs.annotate(is_eighteen = Subquery(chapters.values('is_eighteen')[:1]))
        return new_qs

    def is_eighteen(self, obj):
        return obj.is_eighteen

def chapter_turn_eighteen_on(modeladmin, request, queryset):
    queryset.update(is_eighteen= True)

def chapter_turn_eighteen_off(modeladmin, request, queryset):
    queryset.update(is_eighteen= False)

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ["index", "novelParent", "is_eighteen", "created_at", "updated_at"]
    search_fields = ['novelParent__name', 'title' ]
    list_select_related = ["novelParent"]
    actions = [chapter_turn_eighteen_on,chapter_turn_eighteen_off]


@admin.register(NovelViews)
class NovelViewsAdmin(admin.ModelAdmin):
    def views_name(self,obj):
        queriedNovel = Novel.objects.filter(views = obj)
        if queriedNovel.count():
            return (queriedNovel.first().name)
        else:
            return obj.views
    list_display = ['views_name', "views", "created_at", "updated_at", "weeklyViews",
                    "monthlyViews", "yearlyViews"]
    search_fields = ['viewsNovelName']


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    autocomplete_fields = ['reading_lists']
    search_fields = ['user__name']
    list_display = ["user","created_at", "updated_at"]
    list_select_related = ["user"]


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    autocomplete_fields = ['novel', "chapter"]
    search_fields = ['novel__name']
    list_display = ['novel', "chapter", "profile_name", "created_at","updated_at"]
    list_select_related = ["novel", "chapter"]

    def profile_name(self,obj):
        return Profile.objects.get(reading_lists = obj).user.first_name

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    autocomplete_fields = ['novel', 'owner_user', "last_read_chapter"]
    list_display = ['get_user', "title", "total_score", "last_read_chapter", 
                "novel"]
    search_fields = ['novel__name']
    def get_user(self,obj):
        return obj.owner_user.user

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    search_fields = ['name']
    list_display = ['name', "novels_count", "created_at", "updated_at"]
    list_per_page = 1000

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    search_fields = ['name']
    list_display = ['name', "novels_count","created_at", "updated_at"]
    list_per_page = 1000

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    search_fields = ['name']
    list_display = ['name', "novels_count", "created_at", "updated_at"]

@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    search_fields = ['profile__profile_owner']
    list_display = ['profile_name', "fontSize", "autoBookMark", "lowData",
                    "darkMode", "created_at", "updated_at"]
    def profile_name(self,obj):
        return obj.profile.user.first_name
        
@admin.register(BlacklistPattern)
class BlacklistPatternAdmin(admin.ModelAdmin):
    list_display = ['pattern', "enabled", "replacement"]

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', "description", "authored_by"]


def change_approved(modeladmin, request, queryset):
    queryset.update(status=Report.ReportStatus.APPROVED_CLOSED, updated_at = now() )

def novel_rejected(modeladmin, request, queryset):
    queryset.update(status=Report.ReportStatus.REJECTED, reason= "No source found", updated_at = now() )

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    def go_to_chapter_edit(self, obj):
        if obj.chapter:
            return format_html('<a class="btn btn-outline-success float-right" href="/admin/novels/chapter/{}/change/">Change</a>', obj.chapter.id)
        else:
            return ""
    list_display = ["novel","chapter", "status", "type","reason", "reported_by", "go_to_chapter_edit"]
    list_filter = ('status',"type")
    search_fields = ['chapter__novSlugChapSlug', "novel__name"]
    list_select_related = ["chapter", "novel"]
    autocomplete_fields = ["chapter", "novel"]
    actions = [change_approved,novel_rejected]
