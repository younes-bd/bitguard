from django.utils import timezone
from ..domain.models import Employee, LeaveRequest, TimeEntry
from apps.core.services import AuditService

class HRMService:
    @staticmethod
    def hire_applicant(app):
        from django.contrib.auth import get_user_model
        from apps.hr.domain.models import Employee
        from datetime import date

        User = get_user_model()
        username = app.email.split('@')[0] if app.email else app.applicant_name.lower().replace(' ', '')
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
            
        user = User.objects.create_user(
            username=username,
            email=app.email,
            password=User.objects.make_random_password(),
            first_name=app.applicant_name.split()[0] if ' ' in app.applicant_name else app.applicant_name,
            last_name=app.applicant_name.split()[-1] if ' ' in app.applicant_name else '',
        )
        if hasattr(user, 'tenant') and hasattr(app, 'tenant'):
            user.tenant = app.tenant
            user.save()
            
        Employee.objects.create(
            tenant=app.tenant,
            user=user,
            job_application=app,
            job_title=app.job_position.name if app.job_position else 'New Hire',
            status='active',
            hire_date=date.today(),
            employee_id=f"EMP-{user.id}"
        )
        app.status = 'hired'
        app.save()

    @staticmethod
    def request_leave(request, employee, data):
        """Applies organizational governance regarding concurrency rules and accruals prior to creating a LeaveRequest."""
        leave = LeaveRequest.objects.create(
            employee=employee,
            leave_type=data.get('leave_type'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            reason=data.get('reason', ''),
            status='pending'
        )
        AuditService.log_action(
            request=request,
            action='REQUEST_LEAVE',
            resource='LeaveRequest',
            payload={'employee_id': str(employee.pk), 'leave_type': data.get('leave_type')}
        )
        return leave

    @staticmethod
    def approve_leave(request, leave_obj, reviewer):
        """Executes a chain-of-command state update elevating an ongoing leave request."""
        leave_obj.status = 'approved'
        leave_obj.approved_by = reviewer
        leave_obj.action_date = timezone.now()
        leave_obj.save()
        
        AuditService.log_action(
            request=request,
            action='APPROVE_LEAVE',
            resource='LeaveRequest',
            payload={'leave_id': str(leave_obj.pk), 'reviewer': str(reviewer.pk) if reviewer else None}
        )
        
        # In a real workflow you would deduct days asynchronously or broadcast events
        return leave_obj

from ..domain.models import PayrollRun, PaySlip, EmployeeContract, TimeEntry, PaySlipLine
from django.db import transaction

class TimesheetService:
    @staticmethod
    def approve_time_entry(time_entry: TimeEntry):
        time_entry.approved = True
        time_entry.save()
        return time_entry

class PayrollService:
    @staticmethod
    def generate_payslips_from_batch(batch, tenant):
        from decimal import Decimal
        from apps.hr_payroll.models import Payslip, PayslipLine
        from apps.hr.domain.models import EmployeeContract

        contracts = EmployeeContract.objects.filter(status='open')
        if tenant:
            contracts = contracts.filter(tenant=tenant)
            
        Payslip.objects.filter(batch=batch, state='draft').delete()
        
        for contract in contracts:
            if not contract.payroll_structure:
                continue
                
            payslip = Payslip.objects.create(
                tenant=tenant,
                employee=contract.employee,
                batch=batch,
                structure=contract.payroll_structure,
                date_from=batch.date_start,
                date_to=batch.date_end,
                basic_salary=contract.wage,
                state='draft'
            )
            
            rules = contract.payroll_structure.rules.all().order_by('sequence')
            gross = contract.wage
            deductions = Decimal('0.00')
            
            for rule in rules:
                amt = Decimal('0.00')
                if rule.amount_type == 'fixed':
                    amt = rule.amount
                elif rule.amount_type == 'percent':
                    amt = contract.wage * (rule.amount / Decimal('100.00'))
                    
                if rule.category == 'deduction':
                    deductions += amt
                elif rule.category == 'allowance':
                    gross += amt
                    
                if amt > 0:
                    PayslipLine.objects.create(tenant=tenant, payslip=payslip, rule=rule, amount=amt)
                    
            payslip.gross_salary = gross
            payslip.total_deductions = deductions
            payslip.net_salary = gross - deductions
            payslip.save()
            
        batch.state = 'verify'
        batch.save()

    @staticmethod
    @transaction.atomic
    def generate_payroll_run(request, payroll_run: PayrollRun):
        """Generates draft payslips for all active employees with a contract."""
        contracts = EmployeeContract.objects.filter(
            status='open', 
            tenant=payroll_run.tenant
        ).select_related('employee', 'payroll_structure')

        total_amount = 0
        for contract in contracts:
            payslip = PaySlip.objects.create(
                tenant=payroll_run.tenant,
                employee=contract.employee,
                period=payroll_run.period,
                basic_salary=contract.wage,
                status='draft'
            )
            total_earnings = contract.wage
            total_deductions = 0

            if contract.payroll_structure:
                for comp in contract.payroll_structure.components.all():
                    PaySlipLine.objects.create(
                        tenant=payroll_run.tenant,
                        payslip=payslip,
                        salary_component=comp,
                        amount=comp.amount
                    )
                    if comp.type == 'earning':
                        total_earnings += comp.amount
                    else:
                        total_deductions += comp.amount
            
            payslip.total_earnings = total_earnings
            payslip.total_deductions = total_deductions
            payslip.net_pay = total_earnings - total_deductions
            payslip.save()

            total_amount += payslip.net_pay

        payroll_run.total_amount = total_amount
        payroll_run.save()
        
        AuditService.log_action(
            request=request,
            action='GENERATE_PAYROLL',
            resource='PayrollRun',
            payload={'payroll_run_id': str(payroll_run.pk), 'total_amount': total_amount}
        )
        return payroll_run
