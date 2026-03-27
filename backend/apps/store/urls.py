from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StoreCustomizationViewSet, CategoryViewSet, ProductViewSet, LicenseKeyViewSet,
    CustomerProfileViewSet, OrderViewSet, ShippingSettingViewSet, LandingPageViewSet,
    TrackingConfigViewSet, AddOnViewSet, SubscriptionPlanViewSet, SubscriptionViewSet, StoreSettingViewSet
)

router = DefaultRouter()
router.register(r'customization', StoreCustomizationViewSet, basename='storecustomization')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'licenses', LicenseKeyViewSet, basename='licensekey')
router.register(r'customers', CustomerProfileViewSet, basename='customerprofile')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'shipping-settings', ShippingSettingViewSet, basename='shippingsetting')
router.register(r'landing-pages', LandingPageViewSet, basename='landingpage')
router.register(r'tracking-configs', TrackingConfigViewSet, basename='trackingconfig')
router.register(r'addons', AddOnViewSet, basename='addon')
router.register(r'subscription-plans', SubscriptionPlanViewSet, basename='subscriptionplan')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'settings', StoreSettingViewSet, basename='storesetting')

urlpatterns = [
    path('', include(router.urls)),
]
