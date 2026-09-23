#!/bin/bash

# Ensure target directories exist and old ones are moved
for app_info in "purchase:procurement" "board:analytics" "reporting:reports" "delivery:shipping" "todo:tasks" "livechat:messaging" "elearning:learning"; do
    old="${app_info%%:*}"
    new="${app_info##*:}"
    
    if [ -d "backend/apps/$old" ]; then
        mv backend/apps/$old backend/apps/$new
    fi
    if [ -d "frontend/src/apps/$old" ]; then
        mv frontend/src/apps/$old frontend/src/apps/$new
    fi
    
    # 1. apps.py
    if [ -f "backend/apps/$new/apps.py" ]; then
        sed -i "s/name = 'apps.$old'/name = 'apps.$new'/g" backend/apps/$new/apps.py
    fi
    
    # 2. __manifest__.py
    if [ -f "backend/apps/$new/__manifest__.py" ]; then
        sed -i "s/'technical_name': '$old'/'technical_name': '$new'/g" backend/apps/$new/__manifest__.py
        if ! grep -q "'odoo_equivalent':" backend/apps/$new/__manifest__.py; then
            sed -i "/'technical_name'/a \    'odoo_equivalent': '$old'," backend/apps/$new/__manifest__.py
        fi
    fi
done

# Frontend config
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

echo "Folders and configs verified!"
