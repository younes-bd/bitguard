from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExportRevenueCSV,
    RevenueReportView,
    StoreCustomizationViewSet, LicenseKeyViewSet,
    CustomerProfileViewSet, OrderViewSet, ShippingSettingViewSet,
    TrackingConfigViewSet, AddOnViewSet, SubscriptionPlanViewSet, SubscriptionViewSet,
    StoreSettingViewSet, PartnerRequestViewSet, CartViewSet, CouponViewSet
)

router = DefaultRouter()
router.register(r'customization', StoreCustomizationViewSet, basename='storecustomization')
router.register(r'licenses', LicenseKeyViewSet, basename='licensekey')
router.register(r'customers', CustomerProfileViewSet, basename='customerprofile')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'shipping-settings', ShippingSettingViewSet, basename='shippingsetting')
router.register(r'tracking-configs', TrackingConfigViewSet, basename='trackingconfig')
router.register(r'addons', AddOnViewSet, basename='addon')
router.register(r'subscription-plans', SubscriptionPlanViewSet, basename='subscriptionplan')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'settings', StoreSettingViewSet, basename='storesetting')
router.register(r'partner-requests', PartnerRequestViewSet, basename='partnerrequest')
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'coupons', CouponViewSet, basename='coupon')

from ..webhook import stripe_webhook




urlpatterns = [
    path('report/export/', ExportRevenueCSV.as_view(), name='ecommerce-export-csv'),
    path('report/revenue/', RevenueReportView.as_view(), name='ecommerce-revenue-report'),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
    path('', include(router.urls)),
]
