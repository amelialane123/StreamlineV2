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
        
        serializer = self.get_serializer(queryset[:50], many=True)
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
