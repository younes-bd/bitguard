from django.utils import timezone
from ..domain.models import Employee, LeaveRequest, TimeEntry

class HRMService:
    @staticmethod
    def request_leave(employee, data):
        """Applies organizational governance regarding concurrency rules and accruals prior to creating a LeaveRequest."""
        return LeaveRequest.objects.create(
            employee=employee,
            leave_type=data.get('leave_type'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            reason=data.get('reason', ''),
            status='pending'
        )

    @staticmethod
    def approve_leave(leave_obj, reviewer):
        """Executes a chain-of-command state update elevating an ongoing leave request."""
        leave_obj.status = 'approved'
        leave_obj.approved_by = reviewer
        leave_obj.action_date = timezone.now()
        leave_obj.save()
        
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
    @transaction.atomic
    def generate_payroll_run(payroll_run: PayrollRun):
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
        return payroll_run
