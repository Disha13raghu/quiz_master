Quiz App
This is a single-page quiz application built using Flask and Vue.js. The app supports user login, quiz creation, taking quizzes, and background email notifications using Celery and Redis.

The backend includes app.py which handles routes and API logic. User authentication is managed using Flask-Security. Database interactions are done with SQLAlchemy. Background tasks like email notifications and monthly auto-reminders are written in task.py and handled asynchronously with Celery and Redis. There is no separate mail handler file; all task logic is inside task.py.

The frontend uses Vue. All component scripts are inside the templates/src/ folder, and index.html is located in templates/.

To run the application:

Start Redis server
redis-server

Run Flask backend
python app.py

Run Celery worker
celery -A task.celery worker --loglevel=info

Run periodic task scheduler (for monthly automated webhook/emails)
celery -A task.celery beat --loglevel=info

Make sure all required packages are installed before running. They are listed in requirements.txt.

This project includes default features like user registration, login, quiz creation, result tracking, and role-based access. Additional features include email notifications and monthly scheduled webhooks handled using Celery and Redis.

