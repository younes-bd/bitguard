from django.urls import path
from . import views

urlpatterns = [
    path('', views.crm_dashboard, name='crm_dashboard'),
    path('clients/', views.clients, name='crm_clients'),
    path('clients/<int:pk>/', views.client_detail, name='crm_client_detail'),
    path('tickets/', views.tickets, name='crm_tickets'),
    path('tickets/<int:pk>/', views.ticket_detail, name='crm_ticket_detail'),
    
    # Store / Orders / Invoices
    path('orders/', views.orders, name='crm_orders'),
    path('orders/<int:pk>/', views.order_detail, name='crm_order_detail'),
    path('invoices/', views.invoices, name='crm_invoices'),
    path('invoices/<int:pk>/', views.invoice_detail, name='crm_invoice_detail'),
    
    path('clients/<int:client_id>/contracts/add/', views.contract_create, name='crm_contract_create'),
    
    path('api/', views.get_clients, name='crm_api'),
]