BitGuard Final Fullstack Package

Includes:
- Django backend with server-rendered templates (dark cyber theme), models, serializers, API endpoints and admin.
- React frontend in /frontend that consumes APIs: products, auth tokens, dashboard.
- Stripe checkout redirect, webhook placeholder, secure download endpoint.
- JWT auth via SimpleJWT.

Quick start:
1) python -m venv venv
2) source venv/bin/activate
3) pip install -r requirements.txt
4) cp .env.example .env and set keys
5) python manage.py makemigrations && python manage.py migrate
6) python manage.py createsuperuser
7) python manage.py runserver

Frontend: cd frontend; npm install; npm start
