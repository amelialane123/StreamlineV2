# Example Django models and views for the backend

# models.py
from django.db import models
from django.contrib.auth.models import User

class Content(models.Model):
    CONTENT_TYPES = [
        ('movie', 'Movie'),
        ('show', 'TV Show'),
        ('documentary', 'Documentary'),
        ('anime', 'Anime'),
    ]
    
    title = models.CharField(max_length=200)
    image = models.URLField()
    rating = models.FloatField()
    year = models.IntegerField()
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    genres = models.JSONField(default=list)  # Store as list of strings
    platforms = models.JSONField(default=list)  # Store as list of strings
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class UserList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class UserListItem(models.Model):
    user_list = models.ForeignKey(UserList, on_delete=models.CASCADE)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

class WatchedContent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now_add=True)
    ranking_score = models.FloatField(default=0)  # For comparison-based ranking

class ContentComparison(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_a = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='comparisons_a')
    content_b = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='comparisons_b')
    preferred = models.CharField(max_length=10)  # 'a' or 'b'
    created_at = models.DateTimeField(auto_now_add=True)

# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Content, UserList, WatchedContent, ContentComparison
from .serializers import ContentSerializer, UserListSerializer

class ContentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        # Return trending content based on some algorithm
        trending_content = Content.objects.order_by('-rating')[:20]
        serializer = self.get_serializer(trending_content, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def discover(self, request):
        queryset = self.get_queryset()
        
        # Apply filters
        search = request.query_params.get('search', '')
        content_type = request.query_params.get('content_type', '')
        platform = request.query_params.get('platform', '')
        genres = request.query_params.get('genres', '').split(',') if request.query_params.get('genres') else []
        min_rating = float(request.query_params.get('min_rating', 0))
        year_range_start = int(request.query_params.get('year_range_start', 1990))
        year_range_end = int(request.query_params.get('year_range_end', 2024))
        
        if search:
            queryset = queryset.filter(title__icontains=search)
        if content_type and content_type != 'all':
            queryset = queryset.filter(content_type=content_type)
        if platform and platform != 'all':
            queryset = queryset.filter(platforms__contains=[platform])
        if genres:
            for genre in genres:
                queryset = queryset.filter(genres__contains=[genre])
        if min_rating > 0:
            queryset = queryset.filter(rating__gte=min_rating)
        if year_range_start <= year_range_end:
            queryset = queryset.filter(year__range=(year_range_start, year_range_end))
        
        serializer = self.get_serializer(queryset[:50], many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        # Return recommended content based on some algorithm
        recommended_content = Content.objects.order_by('-rating')[20:]
        serializer = self.get_serializer(recommended_content, many=True)
        return Response(serializer.data)

class UserContentViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def watchlist(self, request):
        # Get user's watchlist content
        user_lists = UserList.objects.filter(user=request.user)
        # Implementation to get content from lists
        return Response([])
    
    @action(detail=False, methods=['get'])
    def watched(self, request):
        watched = WatchedContent.objects.filter(user=request.user).order_by('-watched_at')
        content_ids = [w.content.id for w in watched]
        content = Content.objects.filter(id__in=content_ids)
        serializer = ContentSerializer(content, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_watched(self, request):
        content_id = request.data.get('content_id')
        content = Content.objects.get(id=content_id)
        WatchedContent.objects.get_or_create(user=request.user, content=content)
        return Response({'status': 'success'})
    
    @action(detail=True, methods=['get'])
    def comparisons(self, request, pk=None):
        # Get content to compare with for ranking
        watched_content = WatchedContent.objects.filter(user=request.user).exclude(content_id=pk)
        content_ids = [w.content.id for w in watched_content[:3]]  # Get up to 3 for comparison
        content = Content.objects.filter(id__in=content_ids)
        serializer = ContentSerializer(content, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def submit_comparison(self, request):
        new_content_id = request.data.get('new_content_id')
        existing_content_id = request.data.get('existing_content_id')
        preferred = request.data.get('preferred')  # 'new' or 'existing'
        
        ContentComparison.objects.create(
            user=request.user,
            content_a_id=new_content_id,
            content_b_id=existing_content_id,
            preferred='a' if preferred == 'new' else 'b'
        )
        
        # Update ranking scores based on comparison
        self.update_ranking_scores(request.user, new_content_id, existing_content_id, preferred)
        
        return Response({'status': 'success'})
    
    def update_ranking_scores(self, user, new_content_id, existing_content_id, preferred):
        # Implement ELO-like ranking system based on comparisons
        # This is a simplified version - you'd want a more sophisticated algorithm
        new_watched = WatchedContent.objects.get(user=user, content_id=new_content_id)
        existing_watched = WatchedContent.objects.get(user=user, content_id=existing_content_id)
        
        if preferred == 'new':
            new_watched.ranking_score += 10
            existing_watched.ranking_score -= 5
        else:
            new_watched.ranking_score -= 5
            existing_watched.ranking_score += 10
        
        new_watched.save()
        existing_watched.save()

# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'content', views.ContentViewSet)
router.register(r'user', views.UserContentViewSet, basename='user')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
]

# serializers.py
from rest_framework import serializers
from .models import Content, UserList

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ['id', 'title', 'image', 'rating', 'year', 'platforms', 'content_type', 'genres', 'description']

class UserListSerializer(serializers.ModelSerializer):
    content_count = serializers.SerializerMethodField()
    
    class Meta:
        model = UserList
        fields = ['id', 'name', 'content_count', 'created_at']
    
    def get_content_count(self, obj):
        return obj.userlistitem_set.count()

import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

# Mock database for demonstration purposes
db = {
    "content": [
        {"id": 1, "title": "Dune: Part Two", "image": "/placeholder.svg?height=450&width=300&text=Dune+Part+Two", "rating": 4.8, "year": 2024, "platforms": ["HBO Max", "Prime Video"], "type": "Movie", "watched": False},
        {"id": 2, "title": "The Bear", "image": "/placeholder.svg?height=450&width=300&text=The+Bear", "rating": 4.9, "year": 2023, "platforms": ["Hulu", "Disney+"], "type": "TV Series", "watched": False},
        {"id": 3, "title": "Slow Horses", "image": "/placeholder.svg?height=450&width=300&text=Slow+Horses", "rating": 4.7, "year": 2023, "platforms": ["Apple TV+"], "type": "TV Series", "watched": False},
        {"id": 4, "title": "Oppenheimer", "image": "/placeholder.svg?height=450&width=300&text=Oppenheimer", "rating": 4.7, "year": 2023, "platforms": ["Prime Video"], "type": "Movie", "watched": False},
        {"id": 5, "title": "Poor Things", "image": "/placeholder.svg?height=450&width=300&text=Poor+Things", "rating": 4.5, "year": 2023, "platforms": ["Hulu"], "type": "Movie", "watched": False},
        {"id": 6, "title": "Shogun", "image": "/placeholder.svg?height=450&width=300&text=Shogun", "rating": 4.6, "year": 2024, "platforms": ["Hulu", "Disney+"], "type": "TV Series", "watched": False},
        {"id": 7, "title": "The Gentlemen", "image": "/placeholder.svg?height=450&width=300&text=The+Gentlemen", "rating": 4.3, "year": 2024, "platforms": ["Netflix"], "type": "TV Series", "watched": False},
        {"id": 8, "title": "Severance", "image": "/placeholder.svg?height=450&width=300&text=Severance", "rating": 4.8, "year": 2022, "platforms": ["Apple TV+"], "type": "TV Series", "watched": False},
        {"id": 9, "title": "Past Lives", "image": "/placeholder.svg?height=450&width=300&text=Past+Lives", "rating": 4.6, "year": 2023, "platforms": ["Showtime"], "type": "Movie", "watched": False},
        {"id": 10, "title": "Anatomy of a Fall", "image": "/placeholder.svg?height=450&width=300&text=Anatomy+of+a+Fall", "rating": 4.4, "year": 2023, "platforms": ["Hulu"], "type": "Movie", "watched": False},
    ],
    "users": [
        {"id": 1, "username": "johndoe", "display_name": "John Doe", "avatar": "/placeholder.svg?height=100&width=100&text=JD", "followers_count": 156, "following_count": 89, "is_following": False, "bio": "Movie enthusiast and TV show binge-watcher. Always looking for the next great story to dive into!", "favorite_genres": ["Sci-Fi", "Thriller", "Drama", "Comedy"], "streaming_platforms": ["Netflix", "HBO Max", "Prime Video", "Disney+"], "watched_content_ids": [4, 5, 2], "watchlist_content_ids": [1, 7]},
        {"id": 2, "username": "moviefanatic", "display_name": "Movie Fanatic", "avatar": "/placeholder.svg?height=50&width=50&text=MF", "followers_count": 230, "following_count": 120, "is_following": True, "bio": "Just a simple movie lover.", "favorite_genres": ["Action"], "streaming_platforms": ["Netflix"], "watched_content_ids": [1, 3], "watchlist_content_ids": [6]},
        {"id": 3, "username": "tvjunkie", "display_name": "TV Junkie", "avatar": "/placeholder.svg?height=50&width=50&text=TJ", "followers_count": 80, "following_count": 45, "is_following": False, "bio": "TV shows are my life.", "favorite_genres": ["Comedy"], "streaming_platforms": ["Hulu"], "watched_content_ids": [7, 8], "watchlist_content_ids": [9]},
        {"id": 4, "username": "filmlover", "display_name": "Film Lover", "avatar": "/placeholder.svg?height=50&width=50&text=FL", "followers_count": 300, "following_count": 200, "is_following": True, "bio": "Cinema is my passion.", "favorite_genres": ["Drama"], "streaming_platforms": ["Apple TV+"], "watched_content_ids": [9, 10], "watchlist_content_ids": [4]},
    ],
    "relationships": {
        1: [2, 4], # User 1 follows users 2 and 4
        2: [1],
        4: [1]
    }
}

class RequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*') # Allow CORS for development
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)

        if path == '/api/content/trending':
            self._set_headers()
            response = db["content"][:5]
            self.wfile.write(json.dumps(response).encode('utf-8'))
        elif path == '/api/user/watchlist':
            self._set_headers()
            user_id = 1 # Mock current user ID
            user_data = next((u for u in db["users"] if u["id"] == user_id), None)
            watchlist_content = [c for c in db["content"] if c["id"] in user_data["watchlist_content_ids"]] if user_data else []
            self.wfile.write(json.dumps(watchlist_content).encode('utf-8'))
        elif path == '/api/user/watched':
            self._set_headers()
            user_id = 1 # Mock current user ID
            user_data = next((u for u in db["users"] if u["id"] == user_id), None)
            watched_content = [c for c in db["content"] if c["id"] in user_data["watched_content_ids"]] if user_data else []
            self.wfile.write(json.dumps(watched_content).encode('utf-8'))
        elif path == '/api/content/recommended':
            self._set_headers()
            response = db["content"][5:]
            self.wfile.write(json.dumps(response).encode('utf-8'))
        elif path == '/api/content/discover':
            self._set_headers()
            # Basic filtering logic for discover page
            filtered_content = db["content"]
            search_query = query_params.get('search', [''])[0].lower()
            content_type = query_params.get('contentType', ['all'])[0].lower()
            min_rating = float(query_params.get('minRating', [0])[0])
            year_range_start = int(query_params.get('yearRange[0]', [1990])[0])
            year_range_end = int(query_params.get('yearRange[1]', [2024])[0])

            if search_query:
                filtered_content = [c for c in filtered_content if search_query in c['title'].lower()]
            if content_type != 'all':
                filtered_content = [c for c in filtered_content if c.get('type', '').lower() == content_type]
            if min_rating > 0:
                filtered_content = [c for c in filtered_content if c['rating'] >= min_rating]
            filtered_content = [c for c in filtered_content if year_range_start <= c['year'] <= year_range_end]

            self.wfile.write(json.dumps(filtered_content).encode('utf-8'))
        elif path.startswith('/api/content/'):
            try:
                content_id = int(path.split('/')[-1])
                content = next((c for c in db["content"] if c["id"] == content_id), None)
                if content:
                    self._set_headers()
                    self.wfile.write(json.dumps(content).encode('utf-8'))
                else:
                    self._set_headers(404)
                    self.wfile.write(json.dumps({"error": "Content not found"}).encode('utf-8'))
            except ValueError:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Invalid content ID"}).encode('utf-8'))
        elif path == '/api/users/search':
            search_query = query_params.get('query', [''])[0].lower()
            results = [u for u in db["users"] if search_query in u['username'].lower() or search_query in u['display_name'].lower()]
            self._set_headers()
            self.wfile.write(json.dumps(results).encode('utf-8'))
        elif path == '/api/user/followers':
            user_id = 1 # Mock current user ID
            followers_ids = [u_id for u_id, following_list in db["relationships"].items() if user_id in following_list]
            followers = [u for u in db["users"] if u["id"] in followers_ids]
            self._set_headers()
            self.wfile.write(json.dumps(followers).encode('utf-8'))
        elif path == '/api/user/following':
            user_id = 1 # Mock current user ID
            following_ids = db["relationships"].get(user_id, [])
            following = [u for u in db["users"] if u["id"] in following_ids]
            self._set_headers()
            self.wfile.write(json.dumps(following).encode('utf-8'))
        elif path.startswith('/api/user/profile/'):
            try:
                user_id = int(path.split('/')[-1])
                user_data = next((u for u in db["users"] if u["id"] == user_id), None)
                if user_data:
                    profile = {
                        "id": user_data["id"],
                        "username": user_data["username"],
                        "display_name": user_data["display_name"],
                        "avatar": user_data["avatar"],
                        "bio": user_data["bio"],
                        "followers_count": user_data["followers_count"],
                        "following_count": user_data["following_count"],
                        "is_following": user_id in db["relationships"].get(1, []), # Mock if current user (ID 1) follows this user
                        "favorite_genres": user_data["favorite_genres"],
                        "streaming_platforms": user_data["streaming_platforms"],
                        "watched_content": [c for c in db["content"] if c["id"] in user_data["watched_content_ids"]],
                        "watchlist_content": [c for c in db["content"] if c["id"] in user_data["watchlist_content_ids"]],
                    }
                    self._set_headers()
                    self.wfile.write(json.dumps(profile).encode('utf-8'))
                else:
                    self._set_headers(404)
                    self.wfile.write(json.dumps({"error": "User not found"}).encode('utf-8'))
            except ValueError:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Invalid user ID"}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode('utf-8'))

    def do_POST(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        content_length = int(self.headers['Content-Length'])
        post_data = json.loads(self.rfile.read(content_length))

        if path == '/api/content/mark-watched':
            content_id = post_data.get('contentId')
            # In a real app, update database
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": f"Content {content_id} marked as watched"}).encode('utf-8'))
        elif path == '/api/content/update-watched':
            content_id = post_data.get('contentId')
            rating = post_data.get('rating')
            # In a real app, update database
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": f"Content {content_id} updated with rating {rating}"}).encode('utf-8'))
        elif path == '/api/list/add-content':
            content_id = post_data.get('contentId')
            list_name = post_data.get('listName')
            # In a real app, update database
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": f"Content {content_id} added to list {list_name}"}).encode('utf-8'))
        elif path == '/api/list/create-and-add':
            list_name = post_data.get('listName')
            content_id = post_data.get('contentId')
            # In a real app, create list and add content
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": f"List {list_name} created and content {content_id} added"}).encode('utf-8'))
        elif path == '/api/user/follow':
            user_to_follow_id = post_data.get('userId')
            current_user_id = 1 # Mock current user
            if current_user_id not in db["relationships"]:
                db["relationships"][current_user_id] = []
            if user_to_follow_id not in db["relationships"][current_user_id]:
                db["relationships"][current_user_id].append(user_to_follow_id)
                # Update followers count for the followed user (mock)
                for user in db["users"]:
                    if user["id"] == user_to_follow_id:
                        user["followers_count"] += 1
                        break
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": f"User {user_to_follow_id} followed"}).encode('utf-8'))
        elif path == '/api/user/unfollow':
            user_to_unfollow_id = post_data.get('userId')
            current_user_id = 1 # Mock current user
            if current_user_id in db["relationships"] and user_to_unfollow_id in db["relationships"][current_user_id]:
                db["relationships"][current_user_id].remove(user_to_unfollow_id)
                # Update followers count for the unfollowed user (mock)
                for user in db["users"]:
                    if user["id"] == user_to_unfollow_id:
                        user["followers_count"] -= 1
                        break
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": f"User {user_to_unfollow_id} unfollowed"}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode('utf-8'))

def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting httpd server on port {port}...')
    httpd.serve_forever()

if __name__ == "__main__":
    run()
