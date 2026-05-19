#!/bin/bash
cd /mnt/c/Users/youne/Desktop/2-InfoTech/website/website12/backend
python3 manage.py runserver 0.0.0.0:8000 > /tmp/django.log 2>&1 &
sleep 5
python3 scripts/test_api.py
