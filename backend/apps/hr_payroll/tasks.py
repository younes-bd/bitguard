from celery import shared_task
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from apps.hr_payroll.domain.models import PayslipBatch, Payslip, PayslipLine
from apps.hr.domain.models import EmployeeContract

@shared_task
def auto_generate_monthly_payslips():
    """
    Runs at the end of the month.
    Generates a PayslipBatch and draft Payslips for all active EmployeeContracts.
    """
    today = timezone.now().date()
    
    # Calculate the start and end of the current month
    start_of_month = today.replace(day=1)
    
    # Next month's first day minus 1 day = end of current month
    next_month = start_of_month + relativedelta(months=1)
    end_of_month = next_month - relativedelta(days=1)
    
    batch_name = f"Payroll - {today.strftime('%B %Y')}"
    
    # Get all active contracts
    active_contracts = EmployeeContract.objects.filter(state='open').select_related('employee', 'tenant')
    
    # Group contracts by tenant so we create one batch per tenant
    contracts_by_tenant = {}
    for contract in active_contracts:
        tenant_id = contract.tenant_id
        if tenant_id not in contracts_by_tenant:
            contracts_by_tenant[tenant_id] = []
        contracts_by_tenant[tenant_id].append(contract)
        
    for tenant_id, contracts in contracts_by_tenant.items():
        # Create or get the batch
        batch, created = PayslipBatch.objects.get_or_create(
            tenant_id=tenant_id,
            name=batch_name,
            date_start=start_of_month,
            date_end=end_of_month,
            defaults={'state': 'draft'}
        )
        
        for contract in contracts:
            # Check if payslip already exists for this employee for this period
            if Payslip.objects.filter(employee=contract.employee, date_from=start_of_month, date_to=end_of_month).exists():
                continue
                
            # Create a draft payslip
            payslip = Payslip.objects.create(
                tenant_id=tenant_id,
                employee=contract.employee,
                contract=contract,
                batch=batch,
                date_from=start_of_month,
                date_to=end_of_month,
                state='draft',
                basic_salary=contract.wage,
                gross_salary=contract.wage,  # Should be calculated by rules
                net_salary=contract.wage     # Should be calculated by rules
            )
            
            # (In a real ERP, here we would trigger the calculation of PayslipLines based on SalaryRules)
