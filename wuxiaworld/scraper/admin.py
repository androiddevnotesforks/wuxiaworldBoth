from django.contrib import admin
from wuxiaworld.scraper.models import Source
from wuxiaworld.scraper.tasks import continous_scrape
# Register your models here.

def run_continous_scrape(modeladmin, request, queryset):
    for query in queryset:
        continous_scrape.delay(query.source_novel.slug)

@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ["source_novel", "created_at", "updated_at" ,"priority", "base_url"]
    list_filter = ("priority", "base_url")
    search_fields = ['source_novel__name']
    actions = [run_continous_scrape]
    list_select_related = ["source_novel"]