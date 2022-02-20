import json
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.urls import reverse
from django.template.defaulttags import register
from .models import User, Info, Tag
from django.db import IntegrityError
#from django.core import serializers
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer

from django.views.decorators.csrf import csrf_exempt

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "search_info/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "search_info/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "search_info/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "search_info/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "search_info/register.html")

def index(request):
    # Authenticated users view search box
    if request.user.is_authenticated:
        tags = Tag.objects.filter(owner=request.user)

        return render(request, "search_info/index.html", {
            "tags": tags
        })

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))

# API
# API - NEW TAG
@login_required
def new_tag(request):
    
    # Composing a new tag must be via POST
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)    

    #input_new_tag = request.POST["tag_text"]

    data = json.loads(request.body)
    input_new_tag = data.get("tag_text", "")

    # Check post text
    if input_new_tag == "":
        return JsonResponse({
            "error": "Tag cannot be empty."
        }, status=400)        

    # Save new tag
    new_tag = Tag(
        owner = request.user,
        text = input_new_tag
    )
    new_tag.save()

    return JsonResponse({
        "message": "New tag created successfully."
        }, status=201)

# API - NEW INFO
@login_required
def new_info(request):
    
    # Composing a new info must be via POST
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)    

    data = json.loads(request.body)
    info_title = data.get("info_title", "")
    info_text = data.get("info_text", "")
    checked_tags = data.get("checked_tags", "")


    # Check post text
    if info_text == "":
        return JsonResponse({
            "error": "Info cannot be empty."
        }, status=400)

    # Save new info
    new_info = Info(
        owner = request.user,
        title = info_title,
        text = info_text
    )
    new_info.save()

    last_info = Info.objects.filter(owner=request.user).last()

    # Add tags to info
    for tag in checked_tags:
        tag_object = Tag.objects.get(pk=tag)
        last_info.tags.add(tag_object)

    return JsonResponse({
        "message": "New info added successfully."
        }, status=201)

# API - SEARCH INFO
@login_required
def search_info(request):

    keyword = request.GET.get("keyword")
    tag = request.GET.get("tag")

    if tag == "all":
        # Check keyword
        if keyword == "":
            return JsonResponse({
                "error": "Keyword cannot be empty."
            }, status=400)        

        # Return info content
        try:
            info_result = Info.objects.filter(text__icontains=keyword, owner=request.user) | Info.objects.filter(title__icontains=keyword, owner=request.user)
        except Info.DoesNotExist:
            return JsonResponse({"error": "Info not found."}, status=404)

        # Return info contents
        if request.method == "GET":
            serializer = InfoSerializer(info_result, many=True)
            json = JSONRenderer().render(serializer.data)
            return HttpResponse(json)
    else:
        # Return info content
        try:
            info_result = Info.objects.filter(text__icontains=keyword, tags=tag, owner=request.user) | Info.objects.filter(title__icontains=keyword, tags=tag, owner=request.user)
        except Info.DoesNotExist:
            return JsonResponse({"error": "Info not found."}, status=404)

        # Return info contents
        if request.method == "GET":
            serializer = InfoSerializer(info_result, many=True)
            json = JSONRenderer().render(serializer.data)
            return HttpResponse(json)

# API - EDIT INFO
@login_required
def edit_info(request):
    # Editing info must be via POST
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)    

    data = json.loads(request.body)
    info_title = data.get("info_title", "")
    info_text = data.get("info_text", "")
    checked_tags = data.get("checked_tags", "")
    info_id = data.get("info_id", "")


    # Check post text
    if info_text == "":
        return JsonResponse({
            "error": "Info cannot be empty."
        }, status=400)

    # Save new info
    info = Info.objects.get(pk=info_id)
    info.title = info_title
    info.text = info_text
    info.tags.clear()
    info.save()

    # Add tags to info
    for tag in checked_tags:
        tag_object = Tag.objects.get(pk=tag)
        info.tags.add(tag_object)

    return JsonResponse({
        "message": "Info updated successfully."
        }, status=201)

@login_required
def delete_info(request):
# Deleting info must be via POST
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)    

    data = json.loads(request.body)
    info_id = data.get("info_id", "")

    # Save new info
    info = Info.objects.get(pk=info_id)
    info.delete()

    return JsonResponse({
        "message": "Info deleted successfully."
        }, status=201)

# API - EDIT TAG
@login_required
def edit_tag(request):
    # Editing info must be via POST
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)    

    data = json.loads(request.body)
    tag_text = data.get("tag_text", "")
    tag_id = data.get("tag_id", "")


    # Check post text
    if tag_text == "":
        return JsonResponse({
            "error": "Tag cannot be empty."
        }, status=400)

    # Save edited tag
    tag = Tag.objects.get(pk=tag_id)
    tag.text = tag_text
    tag.save()

    return JsonResponse({
        "message": "Tag updated successfully."
        }, status=201)

@login_required
def delete_tag(request):
# Deleting info must be via POST
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)    

    data = json.loads(request.body)
    tag_id = data.get("tag_id", "")

    # Delete tag
    tag = Tag.objects.get(pk=tag_id)
    tag.delete()

    return JsonResponse({
        "message": "Tag deleted successfully."
        }, status=201)

class InfoSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    tags_id = serializers.SerializerMethodField()

    class Meta:
        model = Info
        fields = '__all__'

    def get_tags(self,instance):
        texts = []
        for tag in instance.tags.all():
            texts.append(tag.text)
        return texts

    def get_tags_id(self,instance):
        ids = []
        for tag in instance.tags.all():
            ids.append(tag.id)
        return ids