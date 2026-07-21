import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time notification delivery.
    Each authenticated user joins their personal group: user_{id}
    When a notification is saved (via Django signal), it's pushed here.
    """

    async def connect(self):
        user = self.scope.get('user')
        if not user or not user.is_authenticated:
            await self.close()
            return

        self.user_group = f'user_{user.id}'
        await self.channel_layer.group_add(self.user_group, self.channel_name)
        await self.accept()
        # Send unread count on connect
        await self.send(json.dumps({'type': 'connected', 'user_id': user.id}))

    async def disconnect(self, close_code):
        if hasattr(self, 'user_group'):
            await self.channel_layer.group_discard(self.user_group, self.channel_name)

    async def receive(self, text_data):
        """Client can send 'ping' to keep connection alive."""
        try:
            data = json.loads(text_data)
            if data.get('type') == 'ping':
                await self.send(json.dumps({'type': 'pong'}))
        except Exception:
            pass

    async def notification_message(self, event):
        """Called by group_send from notification signal."""
        await self.send(json.dumps({
            'type': 'notification',
            'id': event.get('id'),
            'message': event.get('message'),
            'notification_type': event.get('notification_type', 'system'),
            'created_at': event.get('created_at'),
        }))
