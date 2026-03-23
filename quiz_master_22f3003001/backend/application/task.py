from celery import shared_task

#csv by user
from celery import shared_task
import csv
from datetime import datetime, timedelta
from jinja2 import Template
from .mail import send_email
from .models import *
import requests
import os
from sqlalchemy import and_

from datetime import date


# Task 1 

@shared_task(ignore_results=False, name="generate_userreport")
def generate_usercsvreport(user_id):
    from application.models import Scorecard, User, Quiz, Chapter, Subject
    from application.database import db

    user = User.query.get(user_id)
    if not user:
        return None

    scorecards = Scorecard.query.filter_by(student_id=user_id).all()
    filename = f"user_{user_id}_report_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"

    folder_path = "static/reports"
    os.makedirs(folder_path, exist_ok=True)
    path = os.path.join(folder_path, filename)

    with open(path, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Sr No", "Quiz Name", "Subject","Total Score", "Score", "Attempted On", "Duration", "State", "Attempt No"])

        for i, sc in enumerate(scorecards, start=1):
            quiz = Quiz.query.get(sc.quiz_id)
            chapter = Chapter.query.get(quiz.chapter_id)
            subject = Subject.query.get(chapter.subject_id)

            writer.writerow([
                i,
                quiz.name,
                subject.name,
                sc.total_marks,
                sc.marks,
                sc.attempted_on,
                sc.duration,
                sc.state,
                sc.attempt
            ])
    return filename


@shared_task(ignore_results=False, name="generate_admincsvreport")
def generate_admincsvreport():
    from application.models import Scorecard, User, Quiz, Chapter, Subject
    from application.database import db


    users=User.query.all()
    filename = f"admin_report_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"

    folder_path = "static/reports"
    os.makedirs(folder_path, exist_ok=True)
    path = os.path.join(folder_path, filename)
    print(path)

    with open(path, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Sr No", "Username", "Email", "TotalQuiz","Qualification","field","dob"])

        for i,us in enumerate(users, start=1):
            scores= Scorecard.query.filter_by(student_id=us.id).count()
           
            

            writer.writerow([
                i,
                us.username,
                us.email,
                scores,
                us.qualification,
                us.field,
                us.dob
                
            ])
    
    print("Generated report at:", filename)        
    return filename



#monthly report
@shared_task(ignore_results=False, name="monthly_user_report")
def monthly_user_report():
    one_month_ago = datetime.utcnow() - timedelta(days=30)
    users = User.query.all()

    for user in users:
        # Fetch scorecards for quizzes attempted in the last month
        scorecards = Scorecard.query.filter(
            Scorecard.student_id == user.id,
            Scorecard.attempted_on >= one_month_ago
        ).all()

        # Quiz stats
        attempted_quizzes = len(scorecards)
        total_score = sum(int(sc.marks) for sc in scorecards if sc.marks.isdigit())
        avg_score = total_score / attempted_quizzes if attempted_quizzes > 0 else 0

        # Missed quizzes 
        missed_quizzes = (
                Quiz.query
                .filter(
                    Quiz.deadline != None,
                    Quiz.deadline < datetime.utcnow()
                )
                .outerjoin(
                    Scorecard,
                    and_(
                        Scorecard.quiz_id == Quiz.id,
                        Scorecard.student_id == user.id
                    )
                )
                .filter(Scorecard.id == None)
                .all()
             )             
        
        
        # Render email content
        mail_template = Template("""
        <h3>Hello {{ username }},</h3>
        <p>Here's your learning activity summary for the past month:</p>
        <ul>
            <li><strong>Quizzes Attempted:</strong> {{ attempted }}</li>
            <li><strong>Average Score:</strong> {{ avg }}%</li>
        </ul>
        {% if missed %}
        <p><strong>Quizzes you may have missed:</strong></p>
        <ul>
            {% for quiz in missed %}
                <li>{{ quiz.name }} (Deadline: {{ quiz.deadline }})</li>
            {% endfor %}
        </ul>
        {% endif %}
        <p>Keep practicing!</p>
        <h5>QuizMaster Team</h5>
        """)

        message = mail_template.render(
            username=user.username,
            attempted=attempted_quizzes,
            avg=round(avg_score, 2),
            missed=missed_quizzes
        )

        try:
            send_email(
                to_address=user.email,
                subject=" Your Monthly Quiz Report - QuizMaster",
                message=message,
                content="html"
            )
            print(f"Sent monthly report to {user.email}")
        except Exception as e:
            print(f"Error sending email to {user.email}: {e}")

    return "Monthly reports sent"






@shared_task(ignore_results=False, name="daily_userupdates")
def daily_user_updates(quiz):
    print(quiz)
    quiz=quiz[0]
    today_str = date.today().strftime("%Y-%m-%d")
    users = User.query.all()
    for user in users:
        
        

        message_lines = [f"Hi {user.username}, new quiz came today best of luck:"]
        message_lines.append(
        f"• {quiz['name']} — {quiz['description']}\n"
        f"   Level: {quiz['level']}, Duration: {quiz['duration']}, Deadline: {quiz['deadline'] }"
    ) 
       
        final_message = "\n".join(message_lines)

       
        response = requests.post(
            "https://chat.googleapis.com/v1/spaces/AAQAfj5Q-9M/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=Sa457CIssr39RuZXUD2imsgJij4EQL6ZiEotU7ctdFM",
            json={"text": final_message}
        )
        print(f"User {user.username} - status: {response.status_code}")

    return "Daily updates sent."

