from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count
from .models import *
from .serializers import *
from apps.store.models import Order, Subscription, LicenseKey

def crm_dashboard(request):
    total_clients = Client.objects.count()
    active_clients = Client.objects.filter(status='active').count()
    open_tickets = Ticket.objects.filter(status='open').count()
    critical_tickets = Ticket.objects.filter(status='open', priority='critical').count()
    
    recent_tickets = Ticket.objects.exclude(status='closed').order_by('-created_at')[:5]
    recent_orders = Order.objects.all().order_by('-created_at')[:5]
    
    context = {
        'total_clients': total_clients,
        'active_clients': active_clients,
        'open_tickets': open_tickets,
        'critical_tickets': critical_tickets,
        'recent_tickets': recent_tickets,
        'recent_orders': recent_orders,
    }
    return render(request, 'crm/dashboard.html', context)

def orders(request):
    orders_list = Order.objects.all().order_by('-created_at')
    return render(request, 'crm/orders.html', {'orders': orders_list})

def order_detail(request, pk):
    order = get_object_or_404(Order, pk=pk)
    return render(request, 'crm/order_detail.html', {'order': order})

from apps.erp.models import Invoice as ErpInvoice
from itertools import chain

def invoices(request):
    # 1. SaaS Invoices (from Store Orders)
    # We treat paid Orders as "Invoices"
    orders = list(Order.objects.filter(status='paid'))
    for o in orders:
        o.is_saas = True
        o.display_type = 'SaaS / Product'
        o.display_id = f"ORD-{o.id}"
        o.final_amount = o.amount
        
    # 2. Service Invoices (from ERP)
    erp_invoices = list(ErpInvoice.objects.all())
    for i in erp_invoices:
        i.is_saas = False
        i.display_type = 'Professional Services'
        i.display_id = i.invoice_number
        i.final_amount = i.total

    # Combine and Sort by Date (newest first)
    all_invoices = sorted(
        chain(orders, erp_invoices),
        key=lambda instance: instance.created_at,
        reverse=True
    )

    return render(request, 'crm/invoices.html', {'invoices': all_invoices})

def invoice_detail(request, pk):
    invoice = get_object_or_404(Order, pk=pk)
    return render(request, 'crm/invoice_detail.html', {'invoice': invoice})

def clients(request):
    clients_list = Client.objects.annotate(
        total_tickets=Count('tickets'), 
        active_projects_count=Count('projects')
    ).order_by('-created_at')
    
    return render(request, 'crm/clients.html', {
        'clients': clients_list
    })

from .forms import ContractForm

@api_view(['GET'])
def get_clients(request):
    data = {}
    data['clients'] = ClientSerializer(Client.objects.all(), many=True).data
    return Response(data)

def contract_create(request, client_id):
    client = get_object_or_404(Client, pk=client_id)
    if request.method == 'POST':
        form = ContractForm(request.POST, request.FILES)
        if form.is_valid():
            contract = form.save(commit=False)
            contract.client = client
            contract.save()
            return redirect('crm_client_detail', pk=client.pk)
    else:
        form = ContractForm()
    
    return render(request, 'crm/contract_form.html', {
        'form': form,
        'client': client
    })

def client_detail(request, pk):
    client = get_object_or_404(Client, pk=pk)
    # Fetch related data
    tickets = client.tickets.all().order_by('-created_at')
    projects = client.projects.all().order_by('-start_date')
    contacts = client.contacts.all()
    contracts = client.contracts.all().order_by('-start_date')
    
    # Store Integration
    linked_users = [c.user for c in contacts if c.user]
    orders = Order.objects.filter(user__in=linked_users).order_by('-created_at')
    subscriptions = Subscription.objects.filter(user__in=linked_users)
    licenses = LicenseKey.objects.filter(user__in=linked_users)
    
    return render(request, 'crm/client_detail.html', {
        'client': client,
        'tickets': tickets,
        'projects': projects,
        'contacts': contacts,
        'contracts': contracts,
        'orders': orders,
        'subscriptions': subscriptions,
        'licenses': licenses,
    })

def tickets(request):
    tickets_list = Ticket.objects.all().order_by('-created_at')
    return render(request, 'crm/tickets.html', {
        'tickets': tickets_list
    })

def ticket_detail(request, pk):
    ticket = get_object_or_404(Ticket, pk=pk)
    return render(request, 'crm/ticket_detail.html', {
        'ticket': ticket
    })

@api_view(['GET'])
def get_clients(request):
    data = {}
    data['clients'] = ClientSerializer(Client.objects.all(), many=True).data
    return Response(data)