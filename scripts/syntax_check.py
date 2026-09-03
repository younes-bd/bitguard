import ast
import sys

def check_syntax(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        source = f.read()
    try:
        ast.parse(source)
        print(f"Syntax OK: {file_path}")
    except SyntaxError as e:
        print(f"Syntax Error in {file_path}: {e}")

check_syntax(r'c:\Users\youne\Desktop\2-InfoTech\website\website13\backend\apps\accounting\api\views.py')
check_syntax(r'c:\Users\youne\Desktop\2-InfoTech\website\website13\backend\apps\accounting\application\services.py')
check_syntax(r'c:\Users\youne\Desktop\2-InfoTech\website\website13\backend\apps\auth\api\serializers.py')
check_syntax(r'c:\Users\youne\Desktop\2-InfoTech\website\website13\backend\apps\core\api\views.py')
