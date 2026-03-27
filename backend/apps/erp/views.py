"""
ERP Views — Charter §8, §9 Compliant
Views orchestrate; services decide. All business logic delegated to ERP service layer.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Invoice, Payment, Expense, InternalProject
from .serializers import (
    InvoiceSerializer, PaymentSerializer, ExpenseSerializer, InternalProjectSerializer
)
from .services import InvoiceService, PaymentService, ExpenseService, InternalProjectService


class InvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        return InvoiceService.get_queryset(self.request)

    def perform_create(self, serializer):
        InvoiceService.create_invoice(self.request, serializer.validated_data)

    def perform_update(self, serializer):
        InvoiceService.update_invoice(self.request, self.get_object(), serializer.validated_data)


class PaymentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return PaymentService.get_queryset(self.request)


class ExpenseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return ExpenseService.get_queryset(self.request)

    def perform_create(self, serializer):
        ExpenseService.create_expense(self.request, serializer.validated_data)


class InternalProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InternalProjectSerializer

    def get_queryset(self):
        return InternalProjectService.get_queryset(self.request)

    def perform_update(self, serializer):
        InternalProjectService.update_project(
            self.request, self.get_object(), serializer.validated_data
        )
