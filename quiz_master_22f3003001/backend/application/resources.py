from flask_restful import Api, Resource, reqparse 
from .models import *
from werkzeug.security import check_password_hash, generate_password_hash 
from .database import db
from flask_security import auth_required, roles_required, current_user, hash_password, roles_accepted
from flask import jsonify,request
from flask_caching import Cache
import os 
from celery.result import AsyncResult
from .task import generate_usercsvreport,generate_admincsvreport, monthly_user_report, daily_user_updates
import os
from datetime import date


cache = Cache()
api=Api()


def role_list(roles):
    lis=[]
    for role in roles:
        lis.append(role.name)
    return lis  

def daily(quiz):
    print("updating people")
    task = daily_user_updates.delay(quiz)
    return jsonify({"message": "Daily G-Chat updates sent", "task_id": task.id})


subject_parser=reqparse.RequestParser()  

subject_parser.add_argument("name")
subject_parser.add_argument("description")
subject_parser.add_argument("field")

class Subjects(Resource):
    @auth_required()
    @roles_accepted("admin","user")
    def get(self):
        subject=Subject.query.all()
        json_subject=[]
        try:
            
            for i in subject:
                
                this_subject={}
                this_subject["id"]=i.id 
                this_subject["name"]=i.name
                this_subject["description"]=i.description
                this_subject["field"]=i.field
                json_subject.append(this_subject)
            if json_subject:
                print(json_subject)
                return json_subject
            else:
                return {
                    "message":"No Subjects Found"
                },400    
        except:
            return {
                "message":"Some internal error occured"
            },404
         
            
    @auth_required()
    @roles_accepted("admin")       
    def post(self):
        args=subject_parser.parse_args()
        try:
            subject=Subject(name=args["name"],description=args["description"],field=args["field"])
            db.session.add(subject)
            db.session.commit()
            
            sub=[{
                "id": subject.id,
                "name": subject.name,
                "description": subject.description
            }]
            print(sub)
            return sub
        except:
            return {
                "message":"Some internal error occured"
            },404 
    
    
    @auth_required()
    @roles_accepted("admin") 
    def put(self,subject_id):
        args=subject_parser.parse_args()
        try:
            subject=Subject.query.get(subject_id)
            subject.name=args["name"]
            subject.description=args["description"]
            subject.field=args["field"]
            db.session.commit()
            sub=[{
                "id": subject.id,
                "name": subject.name,
                "description": subject.description
            }]
            print(sub)
            return sub
        except:
            return {
                "message":"Some internal error occured"
            },404
        
  

    @auth_required()
    @roles_accepted("admin") 
    def delete(self,subject_id):
        try:
            subject=Subject.query.get(subject_id)
            db.session.delete(subject)
            db.session.commit()
            
            image_path = os.path.join("static/images/subject_images", f"subject_{subject_id}.jpg")
            try:
                    if os.path.exists(image_path):
                        os.remove(image_path)
                        print(f"Deleted image for subject {subject_id}")
            except Exception as e:
                    print(f"could not delete image")
                    return jsonify({'message': f"Subject deleted, but image removal failed: {str(e)}"}), 200
            print("deleted successfully")
            return {"message":"Subject deleted successfully"}
        except:
          return {
                "message":"Some internal error occured"
            },404
         
       

ch_parser=reqparse.RequestParser()
ch_parser.add_argument("name")
ch_parser.add_argument("description")

        
class chapters(Resource) :
    
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,subject_id):
        chap=Chapter.query.filter_by(subject_id=subject_id).all()
        json_chap=[]
        try:
            
            for i in chap:
                
                this_chap={}
                this_chap["id"]=i.id 
                this_chap["name"]=i.name
                this_chap["description"]=i.description
                json_chap.append(this_chap)
            if json_chap:
                print("okk")
                print(json_chap)
                return json_chap
            else:
                return {
                    "message":"No Chapters Found"
                },400    
        except:
            return {
                "message":"Some internal error occured"
            },404
            
               
    @auth_required()
    @roles_accepted("admin")    
    def post(self,subject_id):
        args=ch_parser.parse_args()
        try:
            chapter=Chapter(name=args["name"], description=args["description"],subject_id=subject_id)
            db.session.add(chapter)
            db.session.commit()
            data=[{'id':chapter.id,
                   'name':chapter.name,
                   'description':chapter.description,
                   'subject_id':chapter.subject_id}]
            return data
        except:
            return {
                "message":"Some internal error occured"
            },404 
        
    @auth_required()
    @roles_accepted("admin")       
    def put(self,ch_id):
        args=ch_parser.parse_args()
        try:
            chapter=Chapter.query.get(ch_id)
            chapter.name=args["name"]
            chapter.description=args["description"]
            db.session.commit()
            data=[{'id':chapter.id,
                   'name':chapter.name,
                   'description':chapter.description,
                   'subject_id':chapter.subject_id}]
            return data
        except:
            return {
                "message":"Some internal error occured"
            },404 
        
    @auth_required()
    @roles_accepted("admin")    
    def delete(self,ch_id):
        try:
            chapter=Chapter.query.get(ch_id)
            db.session.delete(chapter)
            db.session.commit()
            print("Chapter is deleted successfully",ch_id)
            return{"message":"Chapter is deleted successfully"}
        except:
            return {
                "message":"Some internal error occured"
            },404      



quiz_parser=reqparse.RequestParser()
quiz_parser.add_argument("name")
quiz_parser.add_argument("description")
quiz_parser.add_argument("level")
quiz_parser.add_argument("duration")
quiz_parser.add_argument("deadline")
quiz_parser.add_argument("attempt")

class quiz(Resource) :
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,ch_id):
        quiz=Quiz.query.filter_by(chapter_id=ch_id).all()
        json_quiz=[]
        try: 
            for i in quiz:
                
                this_quiz={}
                this_quiz["id"]=i.id 
                this_quiz["name"]=i.name
                this_quiz["description"]=i.description
                this_quiz["level"]=i.level 
                this_quiz["duration"]=i.duration 
                this_quiz["deadline"]=i.deadline 
                this_quiz["attempt"]=i.attempt 
                json_quiz.append(this_quiz)
            if json_quiz:
                return json_quiz
            else:
                return {
                    "message":"No Quiz Found"
                },400    
        except:
            return {
                "message":"Some internal error occured"
            },404
     
     
    @auth_required()
    @roles_accepted("admin")    
    def post(self,ch_id):
        try: 
            args=quiz_parser.parse_args()
            quizz=Quiz(name=args["name"],description=args["description"],duration=args["duration"],deadline=args["deadline"],level=args["level"],chapter_id=ch_id,attempt=args["attempt"])
            db.session.add(quizz)
            db.session.commit()
            this_quiz={}
            this_quiz["id"]=quizz.id 
            this_quiz["name"]=quizz.name
            this_quiz["description"]=quizz.description
            this_quiz["level"]=quizz.level 
            this_quiz["duration"]=quizz.duration 
            this_quiz["deadline"]=quizz.deadline 
            this_quiz["attempt"]=quizz.attempt
            q=[this_quiz]
            print(q)
            daily(q)
            return q
        except:
            return {
                "message":"Some internal error occured"
            },404
    

    
    @auth_required()
    @roles_accepted("admin")
    def put(self,quiz_id):
        args=quiz_parser.parse_args()
        print(args)
        try: 
            quiz=Quiz.query.get(quiz_id)
            print(quiz)
            if quiz:
                quiz.name=args["name"]
                quiz.description=args["description"]
                quiz.level=args["level"]
                quiz.deadline=args["deadline"]
                quiz.attempt=args["attempt"]
                quiz.duration=args["duration"]
                db.session.commit()
                q=[{"name":quiz.name,"description":quiz.description,"level":quiz.level,"id":quiz.id,"attempt":quiz.attempt,"duration":quiz.duration}]
                return {"message":"quiz updated successfully ","data":q}
            
            else:
                return {"message":"no quiz found"}    
        except os.error as e:
            print(e)
            return {
                "message":"Some internal error occured"
            },404
    
    @auth_required()
    @roles_accepted("admin")
    def delete(self,quiz_id):  
        try: 
            quiz=Quiz.query.get(quiz_id)            
            db.session.delete(quiz)
            print("deleted successfully",quiz_id)
            db.session.commit()
        except:
            quiz=Quiz.query.get(quiz_id).first() 
            print(quiz)
            print("cannot be deleted",quiz_id)
            return {
                "message":"Some internal error occured"
            },404


class single_quiz(Resource) :
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,id):
        quiz=Quiz.query.filter_by(id=id).all()
        json_quiz=[]
        try: 
            for i in quiz:
                
                this_quiz={}
                this_quiz["id"]=i.id 
                this_quiz["name"]=i.name
                this_quiz["description"]=i.description
                this_quiz["level"]=i.level 
                this_quiz["duration"]=i.duration 
                this_quiz["deadline"]=i.deadline 
                this_quiz["attempt"]=i.attempt 
                json_quiz.append(this_quiz)
            if json_quiz:
                return json_quiz
            else:
                return {
                    "message":"No Quiz Found"
                },400    
        except:
            return {
                "message":"Some internal error occured"
            },404


class quizbystudent(Resource) :
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,s_id=None):
        try: 
            if s_id:
              quiz=db.session.query(Quiz).join(Scorecard, Quiz.id==Scorecard.quiz_id).filter(Scorecard.student_id==s_id).all()
            else:
                quiz=db.session.query(Quiz).join(Scorecard, Quiz.id==Scorecard.quiz_id).filter(Scorecard.student_id==current_user.id).all()  
            json_quiz=[]
       
            
            for i in quiz:
                
                this_quiz={}
                this_quiz["id"]=i.id 
                this_quiz["name"]=i.name
                this_quiz["description"]=i.description
                this_quiz["level"]=i.level 
                this_quiz["duration"]=i.duration 
                this_quiz["deadline"]=i.deadline 
                this_quiz["attempt"]=i.attempt 
                json_quiz.append(this_quiz)
            if json_quiz:
                return json_quiz
            else:
                return {
                    "message":"No Quiz Found"
                },400    
        except:
            return {
                "message":"Some internal error occured"
            },404




question_parser=reqparse.RequestParser()
question_parser.add_argument("name")
question_parser.add_argument("question_statement")
question_parser.add_argument("type")
question_parser.add_argument("correct_ans")
question_parser.add_argument("marks")

class questions(Resource) :
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,quiz_id):
        question=Question.query.filter_by(quiz_id=quiz_id).all()
        json_question=[]
        try: 
            for i in question:
                
                this_question={}
                this_question["id"]=i.id 
                this_question["question_statement"]=i.question_statement
                if "admin" in role_list(current_user.roles):
                    this_question["correct_ans"]=i.correct_ans
                this_question["type"]=i.types
                this_question["marks"]=i.marks

                json_question.append(this_question)
            if json_question:
                print(json_question)
                return json_question
            else:
                return {
                    "message":"No Questions Found"
                },400    
        except:
            return {
                "message":"Some internal error occured"
            },404
        
    @auth_required()
    @roles_accepted("admin")    
    def post(self,quiz_id):
        args=question_parser.parse_args()
        try:
            
          question=Question(question_statement=args["question_statement"],marks=args["marks"],types=args["type"],correct_ans=args["correct_ans"],quiz_id=quiz_id)
          db.session.add(question)
          db.session.commit()
          q=[{
              "id":question.id, "question_statement":question.question_statement,"marks":question.marks,"correct_ans":question.correct_ans,"quiz_id":question.quiz_id
          }]
          print(q)
          return q
        except os.error as e:
            print(e)
            return {
                "message":"Some internal error occured"
            },404
        
    @auth_required()
    @roles_accepted("admin")    
    def put(self,question_id):
        args=question_parser.parse_args()
        try:
          question=Question.query.get(question_id)
          if question:
            question.question_statement=args["question_statement"]
            question.correct_ans=args["correct_ans"]
            question.marks=args["marks"]
            question.type=args["type"]
            db.session.commit()
            print(question)
            return {"message":"Question updated successfully"}
          else:
              return {"message":"Question not found"},400
                
        except os.error as e:
            
            return {
                
                "message":"Some internal error occured:{str(e)}",
            },404
            
            
    @auth_required()
    @roles_accepted("admin")    
    def delete(self,question_id):      
        try:
            question=Question.query.get(question_id)
            db.session.delete(question)
            db.session.commit()
                           
        except:
            return {
                "message":"Some internal error occured"
            },404




question_parser2=reqparse.RequestParser()
question_parser2.add_argument("name")
question_parser2.add_argument("question_statement")
question_parser2.add_argument("type")
question_parser2.add_argument("correct_ans")
question_parser2.add_argument("marks")

class questionsscore(Resource) :
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,quiz_id):
        
        try: 
            question=Question.query.filter_by(quiz_id=quiz_id).all()
            json_question=[]
            for i in question:
                
                this_question={}
                this_question["id"]=i.id 
                this_question["question_statement"]=i.question_statement
                this_question["correct_ans"]=i.correct_ans
                this_question["type"]=i.types
                this_question["marks"]=i.marks

                json_question.append(this_question)
            if json_question:
                print(json_question)
                return json_question
            else:
                return {
                    "message":"No Questions Found"
                },400    
        except Exception as e:
            print(e)
            return {
                "message":"Some internal error occured"
            },404 
 
option_parser=reqparse.RequestParser()
option_parser.add_argument("name")
    
class options(Resource) :
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,question_id):
        try:
          option=Option.query.filter_by(question_id=question_id).all()
          option_json=[]
          for i in option:  
              this_option={}
              this_option["id"]=i.id 
              this_option["name"]=i.name     
              option_json.append(this_option)
          if option_json:
              print(option_json)
              return option_json
          else:
              return {"message":"No option found"} ,404  
          
        except:
            return {
                "message":"Some internal error occured"
            },404
     
    @auth_required()
    @roles_accepted("admin")    
    def post(self,question_id):
        args=option_parser.parse_args()
        try:
          print('Creating option:', args["name"])
          option=Option(name=args["name"],question_id=question_id)
          db.session.add(option)
          db.session.commit()
          ans=[{
              "id":option.id,
              "name":option.name,
          }]
          return ans
        except:
            return {
                "message":"Some internal error occured"
            },404
        
    @auth_required()
    @roles_accepted("admin")    
    def put(self,option_id):
        args=option_parser.parse_args()
        print('edit option:', args["name"])
        try:
          option=Option.query.get(option_id)
          option.name=args["name"]
          db.session.commit()
          return {
              "message":"Option updated successfully"
          }
        except:
            return {
                "message":"Some internal error occured"
            },404
        
    @auth_required()
    @roles_accepted("admin")    
    def delete(self,option_id):  
        try:
           option=Option.query.get(option_id)
           db.session.delete(option)
           db.session.commit()
        except:
            return {
                "message":"Some internal error occured"
            },404



user_parser=reqparse.RequestParser()
user_parser.add_argument('f_name')
user_parser.add_argument('l_name')
user_parser.add_argument('qualification')
user_parser.add_argument('field')
user_parser.add_argument('dob')
user_parser.add_argument('password')
class user_detail_all(Resource) :
    @auth_required()
    @roles_accepted("admin")
    def get(self,user_id=None):
        user=[]
        if not user_id:
            
            
                details=User.query.all()
                for i in details:
                    user_detail={}
                    user_detail["id"]=i.id
                    user_detail["username"]=i.username
                    user_detail["email"]=i.email
                    user_detail["dob"]=i.dob
                    user_detail["qualification"]=i.qualification
                    user_detail["f_name"]=i.f_name
                    user_detail["l_name"]=i.l_name
                    user_detail["field"]=i.field
                    user_detail["active"]=i.active
                    #user_detail["roles"]=current_user.roles
                    user.append(user_detail) 
                    print(user)       
                
        else:    
            user_detail={}
            details=User.query.get(user_id)
            user_detail["id"]=details.id
            user_detail["username"]=details.username
            user_detail["email"]=details.email
            user_detail["dob"]=details.dob
            user_detail["qualification"]=details.qualification
            user_detail["f_name"]=details.f_name
            user_detail["l_name"]=details.l_name
            user_detail["field"]=details.field
            user_detail["active"]=details.active
            user.append(user_detail)    
                
       
        if user:
            return user 
        else:
            return {"message":"User Not found"} 
        
class user_detail(Resource) :
    @auth_required()
    @roles_accepted("admin","user")
    def get(self):
        user=[]
           
        user_detail={}
        details=User.query.get(current_user.id)
        user_detail["id"]=details.id
        user_detail["username"]=details.username
        user_detail["email"]=details.email
        user_detail["dob"]=details.dob
        user_detail["qualification"]=details.qualification
        user_detail["f_name"]=details.f_name
        user_detail["l_name"]=details.l_name
        user_detail["field"]=details.field
        user_detail["active"]=details.active
        user.append(user_detail)    
                
       
        if user:
            return user 
        else:
            return {"message":"User Not found"}       
                
    
    
   
    @auth_required()
    @roles_accepted("user")
    def put(self):
        
        try:
            args=user_parser.parse_args()
            current_user.f_name=args["f_name"]
            current_user.l_name=args["l_name"]
            current_user.qualification=args["qualification"]
            current_user.field=args["field"]
            current_user.dob=args["dob"]
            db.session.commit()
            print(current_user)
            return {"id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "f_name": current_user.f_name,
            "l_name": current_user.l_name,
            "qualification": current_user.qualification,
            "field": current_user.field,
            "dob": current_user.dob,
            "active": current_user.active}
            
        except Exception as e:
            print("error",e)
            return {
                "message":"Some internal error occured"
            },404    
    
    @auth_required()
    @roles_accepted("user")
    def delete(self):  
        user=User.query.get(current_user.id)
        db.session.delete(user)
        db.session.commit()

user_parser=reqparse.RequestParser()
user_parser.add_argument('f_name')
user_parser.add_argument('l_name')
user_parser.add_argument('qualification')
user_parser.add_argument('field')
user_parser.add_argument('dob')

class userbyquiz(Resource) :
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,quiz_id):
        user=[]
        if "admin" in role_list(current_user.roles):
          
            users = db.session.query(User).join(Scorecard, Scorecard.student_id == User.id).filter(Scorecard.quiz_id == quiz_id).all()    
        
                
        for i in users:
                user_detail={}
                user_detail["id"]=i.id
                user_detail["username"]=i.username
                user_detail["email"]=i.email
                user_detail["dob"]=i.dob
                user_detail["qualification"]=i.qualification
                user_detail["f_name"]=i.f_name
                user_detail["l_name"]=i.l_name
                user_detail["field"]=i.field
                user_detail["active"]=i.active
                user.append(user_detail) 
                print(user)       
        if user:
            return user 
        else:
            return {"message":"User Not found"}  


#score_parser=reqparse.RequestParser()
# score_parser.add_argument('duration')
# score_parser.add_argument('attempt')
# score_parser.add_argument('marks')
# score_parser.add_argument('state')

class allscorecard(Resource) :
    
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,user_id):
        
        scores=[]
        if "admin" in role_list(current_user.roles):
            details=Scorecard.query.filter_by(student_id=user_id).all()
        else:
            details=Scorecard.query.filter_by(student_id=current_user.id).all()
        for i in details:
            score={}
            score["id"]=i.id
            score["duration"]=i.duration
            score["attempted_on"]=i.attempted_on
            score["attempt"]=i.attempt
            score["marks"]=i.marks
            score["state"]=i.state
            score["total_marks"]=i.total_marks
            
            scores.append(score)
        if scores:
            print(scores)
            return scores
        else:
            print("found nothing")
            return {"message":"No scorecards found"},404     
                         



class scorecards(Resource) :
    
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,quiz_id,user_id):
        
        scores=[]
        if "admin" in role_list(current_user.roles):
            details=Scorecard.query.filter_by(student_id=user_id,quiz_id=quiz_id).all()
        else:
            details=Scorecard.query.filter_by(student_id=current_user.id,quiz_id=quiz_id).all()
            
        for i in details:
            score={}
            score["id"]=i.id
            score["duration"]=i.duration
            score["attempted_on"]=i.attempted_on
            score["attempt"]=i.attempt
            score["marks"]=i.marks
            score["total_marks"]=i.total_marks
            score["state"]=i.state
            
            scores.append(score)
        if scores:
            print(scores)
            return scores
        else:
            print("found nothing")
            return {"message":"No scorecards found"},404     
                         
    
            
    @auth_required()
    @roles_accepted("user") 
    def post(self,user_id,quiz_id):
        try:
            from datetime import date
            marks=0
            
            question=Question.query.filter_by(quiz_id=quiz_id).all()
            
            for i in question:
                useranswer=UserAnswer.query.filter_by(question_id=i.id,student_id=user_id).first()
                
                attempts=useranswer.attempt
                if useranswer.answer_chosen==i.correct_ans:
                    marks+=int(i.marks)
                  
            old=Scorecard.query.filter_by(quiz_id=quiz_id,student_id=user_id).first()
            if old:
                old.duration="120"
                old.attempted_on=str(date.today())
                old.marks=marks
                old.state="Completed"
                old.attempt=attempts
            else:    
                   
                #args=score_parser.parse_args()
                #args["duration"]
                scores=Scorecard(duration="120",attempted_on=str(date.today()),marks=marks,state="Completed",student_id=user_id,quiz_id=quiz_id,attempt=attempts)
                db.session.add(scores)
            db.session.commit()
            return {"message":"scorecard created successfully"}
        except os.error as e:
            print(e)
            return {
                "message":"Some internal error occured"
            },404
        

user_answer_parser=reqparse.RequestParser()
user_answer_parser.add_argument("answer_chosen")  
 
class user_answers(Resource) :
    @auth_required()
    @roles_accepted("admin","user")
    def get(self,question_id,user_id):
        print(question_id,user_id,"hdshskks")
        try:
           
           ans=[]
           if "admin" in role_list(current_user.roles): 
              answers=UserAnswer.query.filter_by(student_id=user_id,question_id=question_id).all() 
           else:
               answers=UserAnswer.query.filter_by(student_id=user_id,question_id=question_id).all() 
           print(answers)    
           for i in answers:
               answer={}
               answer["answer_chosen"]=i.answer_chosen
               answer["id"]=i.id
               answer["question_id"]=i.question_id
               ans.append(answer)
           print(ans,"ans")     
           if ans:
               return ans
           else:
               print("error")
               return {
                "message":"No answers found"
            },400    
                    
        except Exception as e:
            print(e)
            return {
                "message":"Some internal error occured"
            },404
        
        
    @auth_required()
    @roles_accepted("admin", "user")
    def post(self,  quiz_id):
        try:
            data = request.get_json()  
            print(data)
            answers = data.get("answers", [])  
            quiz_id = data.get("quiz_id")
            user_id = data.get("user_id")

            for ans in answers:
                question_id = ans["question_id"]
                answer_chosen = ans["answer_chosen"]
                

                # Check if an answer already exists for this user & question
                existing_answer = UserAnswer.query.filter_by(
                    student_id=user_id, quiz_id=quiz_id, question_id=question_id
                ).first()
                print(existing_answer)
                if existing_answer:
                    existing_answer.attempt += 1
                    existing_answer.answer_chosen = answer_chosen
                    print(existing_answer)
                else:
                    attempt = 1
                    new_answer = UserAnswer(
                        student_id=user_id,
                        question_id=question_id,
                        quiz_id=quiz_id,
                        answer_chosen=answer_chosen,
                        attempt=attempt
                    )
                    db.session.add(new_answer)
                    print(new_answer)

            db.session.commit() 
            
            return {"message": "User answers added successfully"}, 200

        except Exception as e:
            print("Error:", e)
            return {"message": "Some internal error occurred"}, 500

class admin_dash(Resource) :
    @auth_required()
    @roles_accepted("admin")
    def get(self):
        
        try:
           
           ds=0
           total_users=User.query.count()
           total_subjects=Subject.query.count()
           total_quiz=Quiz.query.count()
           
           print(total_users,total_subjects,total_quiz)
           return {
            "users": total_users,
            "subjects": total_subjects,
            "quiz": total_quiz
        }, 200
                    
        except Exception as e:
            print(e)
            return {
                "message":"Some internal error occured"
            },404    
         



# RESOURCES 
api.add_resource(Subjects,"/api/sub/get","/api/sub/create","/api/sub/update/<int:subject_id>","/api/sub/delete/<int:subject_id>")
api.add_resource(chapters,"/api/ch/get/<int:subject_id>","/api/ch/create/<int:subject_id>","/api/ch/update/<int:ch_id>","/api/ch/delete/<int:ch_id>")
api.add_resource(quiz,"/api/quiz/get/<int:ch_id>","/api/quiz/create/<int:ch_id>","/api/quiz/update/<int:quiz_id>","/api/quiz/delete/<int:quiz_id>")
api.add_resource(quizbystudent,"/api/quizbys/get/<int:s_id>","/api/quizbys/get")
api.add_resource(single_quiz,"/api/squiz/get/<int:id>")
api.add_resource(questions,"/api/ques/get/<int:quiz_id>","/api/ques/create/<int:quiz_id>","/api/ques/update/<int:question_id>","/api/ques/delete/<int:question_id>")
api.add_resource(options,"/api/option/get/<int:question_id>","/api/option/create/<int:question_id>","/api/option/update/<int:option_id>","/api/option/delete/<int:option_id>")
api.add_resource(user_detail,"/api/user/get","/api/user/update","/api/user/delete/<int:user_id>")
api.add_resource(user_detail_all,"/api/user_all/get","/api/user_all/get/<int:user_id>")
api.add_resource(scorecards,"/api/score/get/<int:quiz_id>/<int:user_id>","/api/score/create/<int:quiz_id>/<int:user_id>")
api.add_resource(allscorecard,"/api/scoreall/get/<int:user_id>")
api.add_resource(user_answers,"/api/ans/get/<int:question_id>/<int:user_id>","/api/ans/create/<int:quiz_id>")
api.add_resource(questionsscore,"/api/qscore/get/<int:quiz_id>")
api.add_resource(userbyquiz,"/api/userbyquiz/get/<int:quiz_id>")
api.add_resource(admin_dash,"/api/admindash")
