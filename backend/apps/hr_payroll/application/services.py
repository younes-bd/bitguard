from apps.core.services import BaseService, AuditService

class HrPayrollService(BaseService):
    """
    Service layer for hr_payroll module.
    All business logic, ORM queries, and mutations live here.
    Views only authenticate, call a method here, and return a response.
    """
    pass

from apps.hr_payroll.domain.models import PayslipLine
from decimal import Decimal

class PayslipComputationService:
    @staticmethod
    def compute(payslip):
        PayslipLine.objects.filter(payslip=payslip).delete()
        
        contract = payslip.contract
        if not contract: return
        
        structure = contract.structure
        if not structure: return
        
        rules = structure.rules.order_by('sequence')
        localdict = {
            'categories': {},
            'payslip': payslip,
            'contract': contract,
            'employee': contract.employee,
            'result': 0.0,
            'GROSS': 0.0,
            'NET': 0.0,
        }
        
        for rule in rules:
            if rule.amount_type == 'FIXED':
                amount = rule.fixed_amount
            elif rule.amount_type == 'PERCENTAGE':
                base = localdict.get(rule.category.code, contract.wage) if rule.category else contract.wage
                amount = (Decimal(base) * rule.percentage) / Decimal('100.0')
            elif rule.amount_type == 'CODE':
                try:
                    exec(rule.python_code, {}, localdict)
                    amount = Decimal(localdict.get('result', 0))
                except Exception as e:
                    amount = Decimal('0.0')
            else:
                amount = Decimal('0.0')
                
            localdict[rule.code] = amount
            if rule.category:
                localdict['categories'][rule.category.code] = localdict['categories'].get(rule.category.code, 0) + float(amount)
                
            PayslipLine.objects.create(
                tenant=payslip.tenant,
                payslip=payslip,
                salary_rule=rule,
                amount=amount,
                code=rule.code,
                name=rule.name
            )
            
        payslip.net_wage = Decimal(localdict['categories'].get('NET', localdict.get('NET', 0)))
        payslip.save()
