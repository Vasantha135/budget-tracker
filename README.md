#backend
venv\Scripts\activate
pip install django djangorestframework django-filter djangorestframework-
pip install django-cors-headers
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

#frontend
venv\Scripts\activate
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install d3
npm run dev

