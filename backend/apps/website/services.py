from rest_framework.exceptions import ValidationError
from apps.core.services.base_service import BaseService
from apps.core.services.audit_service import AuditService
from apps.website.models import Page

class PageService(BaseService):
    def get_queryset(self, request=None, **kwargs):
        qs = Page.objects.all()
        # Non-staff users should ideally only see published pages, but since this
        # is an admin CMS, the frontend will use this.
        if request and not request.user.is_staff:
            qs = qs.filter(is_published=True)
        return qs

    def create(self, request, data):
        if not request.user.is_staff:
            raise ValidationError("You do not have permission to create pages.")
        
        page = Page.objects.create(**data)
        
        AuditService.log_action(
            request=request,
            action="CREATE_PAGE",
            resource=f"Page:{page.id}",
            payload={"slug": page.slug, "title": page.title}
        )
        return page

    def update(self, request, pk, data):
        if not request.user.is_staff:
            raise ValidationError("You do not have permission to update pages.")
            
        page = self.get_object_or_404(pk, request)
        
        for key, value in data.items():
            setattr(page, key, value)
        page.save()
        
        AuditService.log_action(
            request=request,
            action="UPDATE_PAGE",
            resource=f"Page:{page.id}",
            payload={"slug": page.slug, "title": page.title}
        )
        return page

    def delete(self, request, pk):
        if not request.user.is_staff:
            raise ValidationError("You do not have permission to delete pages.")
            
        page = self.get_object_or_404(pk, request)
        
        log_payload = {"slug": page.slug, "title": page.title}
        page.delete()
        
        AuditService.log_action(
            request=request,
            action="DELETE_PAGE",
            resource=f"Page:{pk}",
            payload=log_payload
        )
