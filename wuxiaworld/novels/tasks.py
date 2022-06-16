from email.policy import default
from celery import shared_task
from django.apps import apps
import requests 
import pandas as pd
from django.utils.text import slugify
import json
from os import listdir
from urllib.parse import urlparse
from os.path import join
import os
import logging
from wuxiaworld.novels.utils import delete_dupes, delete_unordered_chapters
from django.conf import settings
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from urllib.request import urlretrieve
from PIL import Image
from django.core.files import File 
from django.core.cache import cache
import re
# logger = logging.getLogger("sentry_sdk")

chapters_folder = "chapters"


@shared_task
def new_novel(x):
    Novel = apps.get_model('novels', 'Novel')
    Tag = apps.get_model('novels', 'Tag')
    Category = apps.get_model('novels', 'Category')
    Author = apps.get_model('novels', 'Author')

    novelInDb = Novel.objects.filter(slug = slugify(x['Book Name'])).count()
    if novelInDb > 0:
        return True
    try:
        tags = x['Book Tags'].split(",")
        tagsToPut = []
        for tag in tags:
            gotTag, _ = Tag.objects.get_or_create(name = tag)
            tagsToPut.append(gotTag)

        categories = x['Book Genre'].split(":")
        categoriesToPut = []  
        for category in categories:
            gotCategory, _ = Category.objects.get_or_create(name = category)
            categoriesToPut.append(gotCategory)
        try:
            author, _ = Author.objects.get_or_create(slug = slugify(x['Book Author']),
                                                    defaults = {'name' : x['Book Author']})
        except Exception as e:
            logger.error(f"Book {x['Book Name']} , author {x['Book Author']} already exists")
        
        
        
        novel, _ = Novel.objects.get_or_create(slug = slugify(x['Book Name']), author = author,
                defaults = {'slug': slugify(x['Book Name']), 'name' : x['Book Name'], 'image' : x['Book Image'], 'imageThumb' : x['thumbnail'],
                'linkNU' : x['Book URL'], 'description' : x['Description'], 'numOfChaps' : int(x['Book Chapters'].strip().split(" ")[0]),
                'novelStatus' : False , 'repeatScrape' : True,
                })
        
        novel.category.set(categoriesToPut)
        novel.tag.set(tagsToPut)
        novel.save()
    except Exception as e:
        print(e)
@shared_task
def add_novels():
    df = pd.read_csv(f'both.csv', keep_default_na=False).astype(str)
    df.applymap(lambda x: "" if len(x)>199 else x)
    for _ , x in df.iterrows():
        new_novel.delay(x.to_dict())

@shared_task
def add_sources():
    Source = apps.get_model("scraper", "Source")
    Novel = apps.get_model("novels", "Novel")

    with open("data.json", 'r', encoding= 'utf-8') as json_file:
        data = json.load(json_file)

    for novel in data:
        # print(novel)
        try:
            queriedNovel = Novel.objects.get(name = novel)
        except:
            continue
        for num, source in enumerate(data[novel][::-1]):
            try:
                base_url = urlparse(source[1]).netloc
            except:
                base_url = ""
            if num == len(data[novel]):
                disabled = True
            else:
                disabled = False
            new_source, _ = Source.objects.get_or_create(url = source[1],
            source_novel = queriedNovel ,defaults = {'disabled' : disabled,
            'base_url':base_url})

@shared_task
def add_views():
    NovelViews = apps.get_model('novels', 'NovelViews')
    views = cache.get('views')
    if not views:
        return
    for name, viewNum in views.items():
        novel = NovelViews.objects.get(viewsNovelName = name)
        novel.updateViews(increment_num = viewNum)
    cache.delete_pattern("views")
  
#Reset Views
@shared_task
def reset_weekly_views():
    NovelViews = apps.get_model('novels', 'NovelViews')
    novels = NovelViews.objects.all()
    novels.update(weeklyViews = 0)

@shared_task
def reset_monthly_views():
    NovelViews = apps.get_model('novels', 'NovelViews')
    novels = NovelViews.objects.all()
    novels.update(monthlyViews = 0)

@shared_task
def reset_yearly_views():
    NovelViews = apps.get_model('novels', 'NovelViews')
    novels = NovelViews.objects.all()
    novels.update(yearlyViews = 0)

def get_image_from_url(url, novel):
    media_url = settings.MEDIA_ROOT
    original = f"{media_url}/original/"
    full_folder = f"{media_url}/full/"
    thumbnail_folder = f"{media_url}/thumbnail/"
    if not (os.path.exists(original) and os.path.exists(full_folder) and \
        os.path.exists(thumbnail_folder)):
        os.makedirs(original)
        os.makedirs(full_folder)
        os.makedirs(thumbnail_folder)

    result = urlretrieve(url, f"{original}/{novel.slug}.jpg")

    img = Image.open(f"{original}/{novel.slug}.jpg")    
    im = img.resize((300, 375), Image.ANTIALIAS)
    im_small = img.resize((150, 210), Image.ANTIALIAS)
    im.save(f"{novel.slug}-full.jpg")
    im_small.save(f"{novel.slug}-thumb.jpg")

    novel.new_image.save(f"{novel.slug}-full.jpg", im)
    novel.new_image_thumb.save(f"{novel.slug}-thumb.jpg", im_small)
    novel.original_image.save(f"{novel.slug}.jpg", img)
    novel.save()

@shared_task()
def download_images():
    Novel = apps.get_model('novels', "Novel")
    novels = Novel.objects.all()
    for novel in novels[:10]:
        if novel.image:
            try:
                get_image_from_url(novel.image, novel)
            except Exception as e:
                print(e)
                continue

test_json_1 = {
    "name": "Martial Peak",
    "url": "https://www.novelupdates.com/series/martial-peak/",
    "novel_info": {
        "nu_id": "2866",
        "description": "The journey to the martial peak is a lonely, solitary and long one.  In the face of adversity, you must survive and remain unyielding. Only then can you break through and continue on your journey to become the strongest. High Heaven Pavilion tests its disciples in the harshest ways to prepare them for this journey. One day the lowly sweeper Yang Kai managed to obtain a black book, setting him on the road to the peak of the martials world.\n",
        "novel_type": "Web Novel",
        "genres": [
            {
                "name": "Action",
                "title": "A work typically depicting fighting, violence, chaos, and fast paced motion.",
                "url": "https://www.novelupdates.com/genre/action/"
            },
        ],
        "tags": [
            {
                "name": "Weak to Strong",
                "title": "This TAG is used to indicate the stories in which the protagonist starts at a weak power level and becomes gradually strong as the story progresses.",
                "url": "https://www.novelupdates.com/stag/weak-to-strong/"
            }
        ],
        "rating_uncleaned": "(3.7 / 5.0, 665 votes)",
        "language": {
            "name": "Chinese",
            "url": "https://www.novelupdates.com/language/chinese/",
            "title": "View All Series in Chinese"
        },
        "authors": {
            "Momo": {
                "name": "Momo",
                "url": "https://www.novelupdates.com/nauthor/momo/"
            },
            "\u83ab\u9ed8": {
                "name": "\u83ab\u9ed8",
                "url": "https://www.novelupdates.com/nauthor/%e8%8e%ab%e9%bb%98/"
            }
        },
        "year_released": "2013",
        "status_in_coo_uncleaned": "6009 Chapters (Completed)",
        "licensed": "No",
        "completely_translated": "No",
        "original_publishers": {
            "Qidian": {
                "name": "Qidian",
                "url": "https://www.novelupdates.com/opublisher/qidian/"
            }
        },
        "english_publishers": {},
        "rankings": {
            "weekly_rank": "#2",
            "monthly_rank": "#1",
            "all_time_rank": "#2",
            "monthly_reading_rank": "#344"
        },
        "reading_list_num": "8762",
        "reviews": [
            {
                "profile": {
                    "link": "https://www.novelupdates.com/user/25657/fact12345/",
                    "name": "fact12345",
                    "avatar": "https://forum.novelupdates.com/styles/default/xenforo/avatars/avatar_m.png"
                },
                "likes_received": "27",
                "review_date": ": c711",
                "last_read": "c711",
                "rating": 2
            }
        ]
    }
}

@shared_task()
def load_novel_from_json():
    Novel = apps.get_model("novels", "Novel")
    Category = apps.get_model("novels", "Category")
    Tag = apps.get_model("novels", "Tag")
    Author = apps.get_model("novels", "Author")
    categories_cache = {}
    tags_cache = {}

    with open("new_novel_data.json", "r") as f:
        novels = json.load(f)
    
    for page in novels.keys():
        for test_json in novels[page]:
            novel_info = test_json.get("novel_info")
            if not novel_info:
                continue
            novel_chapters =  re.findall(r'\d+', test_json["novel_info"]["status_in_coo_uncleaned"])
            novel_rating =  re.findall(r'\d\.\d', test_json["novel_info"]["rating_uncleaned"])
            if len(novel_rating) > 0:
                novel_rating = novel_rating[0]
            else:
                novel_rating = "5.0"
            
            if len(novel_chapters) > 0:
                novel_chapters = novel_chapters[0]
            else:
                novel_chapters = 0
            try:
                novel, _ = Novel.objects.get_or_create(
                    linkNU = test_json["url"],
                    defaults = {
                        "name": test_json["name"],
                        "linkNU": test_json["url"],
                        "description": test_json["novel_info"]["description"],
                        "rating": novel_rating,
                        "numOfChaps": novel_chapters,
                        "repeatScrape":True,
                        })
            except Exception as e:
                continue
            author_test = test_json["novel_info"]["authors"]
            if len(author_test) > 0:
                for author in author_test.keys():
                    author_obj, _ = Author.objects.get_or_create(slug = 
                        slugify(author_test[author]['name']), 
                        defaults = {
                            "name":author_test[author]['name'],
                            "slug" : slugify(author_test[author]['name'])})
                    novel.author = author_obj
                    break

            for category in test_json["novel_info"]["genres"]:
                if category["name"] not in categories_cache:
                    categories_cache[category["name"]], _ = Category.objects.get_or_create(slug=slugify(category["name"]),
                        defaults = {"name": category["name"],
                            "slug":slugify(category["name"])
                            })
                novel.category.add(categories_cache[category["name"]])


            for tag in test_json["novel_info"]["tags"]:
                if tag["name"] not in tags_cache:
                    tags_cache[tag["name"]], _ = Tag.objects.get_or_create(slug=slugify(tag["name"]),
                        defaults = {"name": tag["name"],
                            "slug":slugify(tag["name"])
                            })
                novel.tag.add(tags_cache[tag["name"]])
            novel.save()