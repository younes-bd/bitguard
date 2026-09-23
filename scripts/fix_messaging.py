content=open('backend/apps/messaging/apps.py').read(); open('backend/apps/messaging/apps.py', 'w').write(content.replace('apps.livechat', 'apps.messaging'))
