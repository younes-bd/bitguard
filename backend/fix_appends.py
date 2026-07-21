with open('apps/hrm/domain/models.py', 'r') as f:
    lines = f.readlines()
with open('apps/hrm/domain/models.py', 'w') as f:
    for line in lines:
        if line.startswith('class Contract(TenantAwareModel):'):
            break
        f.write(line)
        
with open('apps/hrm/api/serializers.py', 'r') as f:
    lines = f.readlines()
with open('apps/hrm/api/serializers.py', 'w') as f:
    for line in lines:
        if line.startswith('from ..domain.models import Contract, SalaryRule, Payslip'):
            break
        f.write(line)
