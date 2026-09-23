#!/bin/bash
git checkout HEAD -- backend/apps/mail/domain/models.py
cp backend/apps/mail/domain/models.py backend/apps/inbox/domain/models.py
sed -i "s/app_label = 'core'/app_label = 'inbox'/g" backend/apps/inbox/domain/models.py
cd backend
source venv/bin/activate
python3 manage.py check
