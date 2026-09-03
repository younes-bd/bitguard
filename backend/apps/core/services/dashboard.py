from apps.core.domain.models import RecordMessage, RecordActivity, RecordFollower, FieldChangeLog
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response

class ChatterService:
    @classmethod
    def get_chatter_summary(cls, request, model_name, object_id):
        from apps.core.api.serializers import (
            RecordMessageSerializer, RecordActivitySerializer,
            RecordFollowerSerializer, FieldChangeLogSerializer
        )
        if not model_name or not object_id:
            return {'error': 'Both model and object_id query params are required.'}, 400

        try:
            app_label, model = model_name.lower().rsplit('.', 1)
            ct = ContentType.objects.get(app_label=app_label, model=model)
        except (ContentType.DoesNotExist, ValueError):
            return {'error': f'Model "{model_name}" not found.'}, 404

        tenant = getattr(request.user, 'tenant', None)
        tenant_filter = {'tenant': tenant} if tenant else {}

        messages = RecordMessage.objects.filter(
            content_type=ct, object_id=object_id, **tenant_filter
        ).select_related('author').order_by('-created_at')[:50]

        activities = RecordActivity.objects.filter(
            content_type=ct, object_id=object_id, is_done=False, **tenant_filter
        ).select_related('assigned_to').order_by('due_date')

        followers = RecordFollower.objects.filter(
            content_type=ct, object_id=object_id, **tenant_filter
        ).select_related('user')

        change_log = FieldChangeLog.objects.filter(
            content_type=ct, object_id=object_id, **tenant_filter
        ).select_related('changed_by').order_by('-created_at')[:30]

        return {
            'success': True,
            'model': model_name,
            'object_id': object_id,
            'messages': RecordMessageSerializer(messages, many=True).data,
            'activities': RecordActivitySerializer(activities, many=True).data,
            'followers': RecordFollowerSerializer(followers, many=True).data,
            'change_log': FieldChangeLogSerializer(change_log, many=True).data,
            'is_following': followers.filter(user=request.user).exists(),
        }, 200

class DashboardAnalyticsService:
    @classmethod
    def get_mrr(cls, tenant):
        from apps.accounting.domain.models import Invoice
        from django.utils import timezone
        from django.db.models import Sum
        import datetime
        
        today = timezone.now().date()
        prev_1 = today.replace(day=1) - datetime.timedelta(days=1)
        prev_2 = prev_1.replace(day=1) - datetime.timedelta(days=1)
        
        invoices = Invoice.objects.filter(type='standard', status__in=['paid', 'sent'])
        if tenant: invoices = invoices.filter(tenant=tenant)
            
        curr_invoices = invoices.filter(issue_date__month=today.month, issue_date__year=today.year)
        prev1_invoices = invoices.filter(issue_date__month=prev_1.month, issue_date__year=prev_1.year)
        prev2_invoices = invoices.filter(issue_date__month=prev_2.month, issue_date__year=prev_2.year)
        
        curr_rev = float(curr_invoices.aggregate(total=Sum('amount'))['total'] or 0)
        prev1_rev = float(prev1_invoices.aggregate(total=Sum('amount'))['total'] or 0)
        prev2_rev = float(prev2_invoices.aggregate(total=Sum('amount'))['total'] or 0)
        
        return {
            "current": curr_rev,
            "history": [
                { "month": prev_2.strftime('%b'), "mrr": prev2_rev }, 
                { "month": prev_1.strftime('%b'), "mrr": prev1_rev },
                { "month": today.strftime('%b'), "mrr": curr_rev },
            ]
        }
