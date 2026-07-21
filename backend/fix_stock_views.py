import re

urls_path = "apps/stock/api/urls.py"
views_path = "apps/stock/api/views.py"

with open(urls_path, 'r', encoding='utf-8') as f:
    u = f.read()
    
u = u.replace('DeliveryNoteViewSet, ', '')
u = u.replace(', DeliveryNoteViewSet', '')
u = re.sub(r"router\.register\(r'delivery-notes', DeliveryNoteViewSet, basename='delivery-note'\)\n", "", u)

with open(urls_path, 'w', encoding='utf-8') as f:
    f.write(u)

with open(views_path, 'r', encoding='utf-8') as f:
    v = f.read()

v = v.replace('DeliveryNote, ', '')
v = v.replace(', DeliveryNote', '')
v = v.replace('DeliveryNoteSerializer, ', '')
v = v.replace(', DeliveryNoteSerializer', '')

# remove DeliveryNoteViewSet block
v = re.sub(r'class DeliveryNoteViewSet.*?class', 'class', v, flags=re.DOTALL)

with open(views_path, 'w', encoding='utf-8') as f:
    f.write(v)

print("Fixed stock views and urls")
