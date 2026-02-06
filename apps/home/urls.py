from django.urls import path
from . import views
from .views import email_list_signup
from .views import (
    index,
    IndexView,
)

urlpatterns = [
    #path('', views.landing, name='landing'),
    path('', IndexView.as_view(), name='home'),
    path('email-signup/', email_list_signup, name='email-list-signup'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('support/', views.support, name='support'),
    path('support/session/', views.remote_session, name='remote_session'), # Remote support session
    path('support/session/generate/', views.generate_session, name='generate_session'), # Tech generator
    path('portal/', views.client_portal, name='client_portal'), # Dedicated Client Portal - Reload Trigger
    path('team/', views.team, name='team'),
    path('careers/', views.careers, name='careers'),
    path('managed-it/', views.managed_it, name='managed_it'),
    path('cybersecurity/', views.cybersecurity, name='cybersecurity'),
    path('cloud/', views.cloud, name='cloud'),
    path('vciso/', views.vciso, name='vciso'),
    
    # Dynamic Service Pages
    path('solutions/<slug:service_slug>/', views.service_detail, name='service_detail'),
    path('platform/<slug:service_slug>/', views.service_detail, name='platform_detail'), # Re-use same view

    

]