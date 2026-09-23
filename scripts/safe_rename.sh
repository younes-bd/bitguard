#!/bin/bash

# Move backend apps
mv backend/apps/purchase backend/apps/procurement
mv backend/apps/board backend/apps/analytics
mv backend/apps/reporting backend/apps/reports
mv backend/apps/delivery backend/apps/shipping
mv backend/apps/todo backend/apps/tasks
mv backend/apps/livechat backend/apps/messaging
mv backend/apps/elearning backend/apps/learning

# Move frontend apps
mv frontend/src/apps/purchase frontend/src/apps/procurement
mv frontend/src/apps/board frontend/src/apps/analytics
mv frontend/src/apps/reporting frontend/src/apps/reports
mv frontend/src/apps/delivery frontend/src/apps/shipping
mv frontend/src/apps/todo frontend/src/apps/tasks
mv frontend/src/apps/livechat frontend/src/apps/messaging
mv frontend/src/apps/elearning frontend/src/apps/learning

# Update Backend manifests and apps.py
for app_info in "purchase:procurement" "board:analytics" "reporting:reports" "delivery:shipping" "todo:tasks" "livechat:messaging" "elearning:learning"; do
    old="${app_info%%:*}"
    new="${app_info##*:}"
    
    # 1. apps.py
    if [ -f "backend/apps/$new/apps.py" ]; then
        sed -i "s/name = 'apps.$old'/name = 'apps.$new'/g" backend/apps/$new/apps.py
    fi
    
    # 2. __manifest__.py
    if [ -f "backend/apps/$new/__manifest__.py" ]; then
        # Replace technical_name
        sed -i "s/'technical_name': '$old'/'technical_name': '$new'/g" backend/apps/$new/__manifest__.py
        
        # Add odoo_equivalent if not exists
        if ! grep -q "'odoo_equivalent':" backend/apps/$new/__manifest__.py; then
            sed -i "/'technical_name'/a \    'odoo_equivalent': '$old'," backend/apps/$new/__manifest__.py
        fi
    fi
done

# Frontend config techNames and displayNames
for app_info in "purchase:procurement:Procurement" "board:analytics:Analytics" "reporting:reports:Reports" "delivery:shipping:Shipping" "todo:tasks:Tasks" "livechat:messaging:Messaging" "elearning:learning:Learning"; do
    old=$(echo $app_info | cut -d: -f1)
    new=$(echo $app_info | cut -d: -f2)
    disp=$(echo $app_info | cut -d: -f3)
    
    if [ -f "frontend/src/apps/$new/config/menu.js" ]; then
        sed -i "s/techName: '$old'/techName: '$new'/g" frontend/src/apps/$new/config/menu.js
        sed -i "s/techName: \"$old\"/techName: \"$new\"/g" frontend/src/apps/$new/config/menu.js
        sed -i "s/displayName: '.*'/displayName: '$disp'/g" frontend/src/apps/$new/config/menu.js
    fi
done

echo "Folders moved and core configs updated!"
