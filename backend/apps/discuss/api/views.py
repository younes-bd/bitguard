from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from apps.discuss.domain.models import Channel, Message, LiveChatChannel
from .serializers import ChannelSerializer, MessageSerializer, LiveChatChannelSerializer

class StandardPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200

class ChannelViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']

    def get_queryset(self):
        return Channel.objects.filter(
            tenant=self.request.user.tenant,
            is_deleted=False
        ).prefetch_related('members')

    def perform_create(self, serializer):
        channel = serializer.save(
            tenant=self.request.user.tenant,
            created_by=self.request.user
        )
        channel.members.add(self.request.user)

class MessageViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['channel']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return Message.objects.filter(
            tenant=self.request.user.tenant,
            is_deleted=False
        ).select_related('author', 'channel').order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            author=self.request.user,
            created_by=self.request.user
        )

class LiveChatChannelViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = LiveChatChannelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['website']
    search_fields = ['name']

    def get_queryset(self):
        # Allow public read access for widget loading if needed, otherwise strict tenant
        if self.request.user.is_authenticated and hasattr(self.request.user, 'tenant'):
            return LiveChatChannel.objects.filter(
                tenant=self.request.user.tenant,
                is_deleted=False
            )
        return LiveChatChannel.objects.filter(is_deleted=False)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'tenant'):
            serializer.save(
                tenant=self.request.user.tenant,
                created_by=self.request.user
            )
        else:
            serializer.save()

