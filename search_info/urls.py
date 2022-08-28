from django.urls import path
from . import views

urlpatterns = [
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("", views.index, name="index"),

    # API Routes
    path("search_info/new_tag", views.new_tag, name="new_tag"),
    path("search_info/new_info", views.new_info, name="new_info"),
    path("search_info/search_info", views.search_info, name="search_info"),
    path("search_info/edit_info", views.edit_info, name="edit_info"),
    path("search_info/delete_info", views.delete_info, name="delete_info"),
    path("search_info/edit_tag", views.edit_tag, name="edit_tag"),
    path("search_info/delete_tag", views.delete_tag, name="delete_tag")
]