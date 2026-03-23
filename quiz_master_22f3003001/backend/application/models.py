from .database import db
from flask_security import UserMixin, RoleMixin

class User(db.Model, UserMixin):
    id=db.Column(db.Integer,primary_key=True)
    email=db.Column(db.String,unique=True,nullable=False)
    username=db.Column(db.String,unique=True,nullable=False)
    password=db.Column(db.String,nullable=False)
    fs_uniquifier=db.Column(db.String,unique=True,nullable=False)
    active=db.Column(db.Boolean,nullable=False)
    roles=db.relationship("Role",backref="bearer",secondary="user_roles")
    f_name=db.Column(db.String)
    l_name=db.Column(db.String)
    qualification=db.Column(db.String)
    field=db.Column(db.String)
    dob=db.Column(db.String)
    answers=db.relationship('UserAnswer', backref='user', lazy=True, cascade="all, delete")
    scorecards=db.relationship('Scorecard', backref='user', lazy=True, cascade="all, delete")


class Role(db.Model, RoleMixin):
     id= db.Column(db.Integer,primary_key=True)   
     name=db.Column(db.String,unique=True,nullable=False)
     description=db.Column(db.String)
     
class UserRoles(db.Model):
        id= db.Column(db.Integer,primary_key=True) 
        user_id= db.Column(db.Integer,db.ForeignKey("user.id")) 
        role_id= db.Column(db.Integer,db.ForeignKey("role.id"))
    
    
class Subject(db.Model):
    id= db.Column(db.Integer,primary_key=True)   
    name=db.Column(db.String,unique=True,nullable=False)
    #image
    description=db.Column(db.String)
    field=db.Column(db.String)
    chapters = db.relationship('Chapter', backref='subject', lazy=True, cascade="all, delete")
    
    

    

class Quiz(db.Model):
    id= db.Column(db.Integer,primary_key=True)  
    chapter_id=db.Column(db.Integer,db.ForeignKey("chapter.id"),nullable=False) 
    name=db.Column(db.String,unique=True,nullable=False)
    description=db.Column(db.String)   
    level=db.Column(db.Integer,nullable=False)
    duration=db.Column(db.String,nullable=False)
    deadline=db.Column(db.String)
    attempt=db.Column(db.String,default="Multiple")
    scorecards=db.relationship('Scorecard', backref='quiz', lazy=True, cascade="all, delete")
    questions = db.relationship('Question', backref='quiz', lazy=True, cascade="all, delete")
    user_answers = db.relationship('UserAnswer', backref='quiz', lazy=True, cascade="all, delete") 
    
    

class Question(db.Model):
     id= db.Column(db.Integer,primary_key=True)
     quiz_id=db.Column(db.Integer,db.ForeignKey("quiz.id"),nullable=False)
     question_statement=db.Column(db.String) #,nullable=False)
     types=db.Column(db.String)#,nullable=False)
     correct_ans=db.Column(db.String,nullable=False)
     marks=db.Column(db.String)#,nullable=False)
     options = db.relationship('Option', backref='question', lazy=True, cascade="all, delete")
     answers=db.relationship('UserAnswer', backref='question', lazy=True, cascade="all, delete")
     
class Option(db.Model):
    id= db.Column(db.Integer,primary_key=True)
    question_id=db.Column(db.Integer,db.ForeignKey("question.id"),nullable=False)
    name=db.Column(db.String,nullable=False)
            
    
class UserAnswer(db.Model):
      id= db.Column(db.Integer,primary_key=True)   
      student_id=db.Column(db.Integer,db.ForeignKey("user.id"),nullable=False)
      question_id=db.Column(db.Integer,db.ForeignKey("question.id"),nullable=False) 
      quiz_id=db.Column(db.Integer,db.ForeignKey("quiz.id"),nullable=False)
      attempt=db.Column(db.Integer,nullable=False)
      answer_chosen=db.Column(db.String,nullable=False)


class Scorecard(db.Model):
    id= db.Column(db.Integer,primary_key=True)   
    student_id=db.Column(db.Integer,db.ForeignKey("user.id"),nullable=False)
    quiz_id=db.Column(db.Integer,db.ForeignKey("quiz.id"),nullable=False)
    duration=db.Column(db.String)
    attempted_on=db.Column(db.String)
    attempt=db.Column(db.Integer,nullable=False)
    marks=db.Column(db.String)
    total_marks=db.Column(db.String)
    state=db.Column(db.String,nullable=False)
    
    

    
