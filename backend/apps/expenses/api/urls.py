from rest_framework.routers import DefaultRouter
from apps.expenses.api.views import ExpenseReportViewSet

router = DefaultRouter()
router.register(r'expense-reports', ExpenseReportViewSet)

urlpatterns = router.urls
