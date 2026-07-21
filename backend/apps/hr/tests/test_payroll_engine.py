from django.test import TestCase
from decimal import Decimal
from apps.tenants.domain.models import Tenant
from apps.users.domain.models import User
from apps.users.domain.models import TenantMembership
from apps.hr.domain.models import Employee, EmployeeContract, PayrollPeriod, SalaryComponent, PaySlip, PaySlipLine
from apps.accounting.domain.models import GeneralLedger, Account
from apps.accounting.application.services import GeneralLedgerService
from rest_framework.test import APIRequestFactory, force_authenticate
from apps.hr.api.views import PayrollPeriodViewSet

class PayrollEngineTests(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name="Test Corp", domain="test.example.com")
        self.user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password="password"
        )
        TenantMembership.objects.create(user=self.user, tenant=self.tenant)
        self.employee_user = User.objects.create_user(
            username="employee1",
            email="emp1@example.com",
            password="password"
        )
        TenantMembership.objects.create(user=self.employee_user, tenant=self.tenant)
        self.employee = Employee.objects.create(
            tenant=self.tenant,
            user=self.employee_user,
            employee_id="EMP-001",
            job_title="Software Engineer",
            hire_date="2026-01-01"
        )
        self.contract = EmployeeContract.objects.create(
            tenant=self.tenant,
            employee=self.employee,
            start_date="2026-01-01",
            wage=Decimal('5000.00'),
            contract_type="full_time",
            status="open"
        )
        self.period = PayrollPeriod.objects.create(
            tenant=self.tenant,
            name="June 2026",
            start_date="2026-06-01",
            end_date="2026-06-30"
        )
        
        # Salary Components
        self.bonus_comp = SalaryComponent.objects.create(
            tenant=self.tenant, name="Performance Bonus", type="earning", amount=Decimal('500.00')
        )
        self.tax_comp = SalaryComponent.objects.create(
            tenant=self.tenant, name="Income Tax", type="deduction", amount=Decimal('10.00') # 10%
        )

        # GL Accounts
        self.payroll_expense = Account.objects.create(
            tenant=self.tenant, name="Payroll Expense", code="5000", account_type="expense"
        )
        self.cash_account = Account.objects.create(
            tenant=self.tenant, name="Cash", code="1000", account_type="asset"
        )
        
        self.factory = APIRequestFactory()

    def test_payroll_processing(self):
        """Test the automated calculation of payslips and GL posting."""
        view = PayrollPeriodViewSet.as_view({'post': 'process'})
        request = self.factory.post(f'/api/hrm/payroll-periods/{self.period.id}/process/')
        request.user = self.user
        request.tenant = self.tenant
        force_authenticate(request, user=self.user)

        # Execute
        response = view(request, pk=self.period.id)
        
        self.assertEqual(response.status_code, 200)
        
        # Verify Period
        self.period.refresh_from_db()
        self.assertTrue(self.period.is_closed)

        # Verify Payslip
        payslip = PaySlip.objects.get(period=self.period, employee=self.employee)
        self.assertEqual(payslip.status, 'paid')
        self.assertEqual(payslip.basic_salary, Decimal('5000.00'))
        self.assertEqual(payslip.total_earnings, Decimal('500.00'))
        
        # Tax should be 10% of 5000 = 500
        self.assertEqual(payslip.total_deductions, Decimal('500.00'))
        
        # Net Pay = 5000 + 500 - 500 = 5000
        self.assertEqual(payslip.net_pay, Decimal('5000.00'))

        # Verify GL Entries
        entries = GeneralLedger.objects.filter(reference_type='payroll', reference_id=self.period.id)
        self.assertEqual(entries.count(), 2)
        debit = entries.get(entry_type='debit')
        credit = entries.get(entry_type='credit')
        self.assertEqual(debit.account.name, "Payroll Expense")
        self.assertEqual(credit.account.name, "Cash")
        self.assertEqual(debit.amount, Decimal('5000.00')) # Only 1 employee, net pay is 5000
        self.assertEqual(credit.amount, Decimal('5000.00'))
