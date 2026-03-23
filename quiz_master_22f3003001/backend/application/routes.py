from flask import current_app as app, jsonify,request, render_template, send_from_directory
from flask_security import auth_required, roles_required, current_user, login_user, roles_accepted,logout_user
from .database import db
from werkzeug.security import check_password_hash, generate_password_hash
from .models import *
import os
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
from celery.result import AsyncResult
from .task import generate_usercsvreport,generate_admincsvreport, monthly_user_report, daily_user_updates
import os
from datetime import date

def role_list(roles):
    lis=[]
    for role in roles:
        lis.append(role.name)
    return lis 


@app.route("/",methods=["GET"])
def home():
    return  render_template("index.html")


@app.route("/api/login",methods=["POST"])
def user_login():
    body=request.get_json()
    email=body["email"]
    password=body["password"]
    
    if not email:
        return {"message":"Email is required"},400
    
    user=app.security.datastore.find_user(email=email)
    if user:
        if check_password_hash(user.password,password):
            login_user(user)
            return jsonify({
                "id":user.id,
                "username":user.username,
                "auth-token":user.get_auth_token()
            })
        else:
            return {
                "message":"Incorrect Password"
            },400  
    else : 
        return {
                "message":"Incorrect Username"
            },404       
            
        
    
    

@app.route("/api/admin")
@auth_required("token")
@roles_required("admin")
def admin_home():
    return "<h1>ADMIN HOME</h1>"


@app.route("/api/home")
@auth_required("token")
@roles_accepted("user","admin")
def user_home():
    user=current_user
    roles=""
    if "admin" in role_list(current_user.roles):
        roles="admin"
    else:
        roles="user"
        
        
    return jsonify(
        {
            "username":user.username,
            "email":user.email,
            "password":user.password,
            "role":roles,
        }
    )
    
@app.post("/api/registration")    
def user_details():
    data=request.get_json()
    print(data)
    if not app.security.datastore.find_user(email=data["email"]):
        app.security.datastore.create_user(email=data["email"],
                                           username=data["username"],
                                           password=generate_password_hash(data["password"]),
                                           roles=["user"],
                                           f_name=data["f_name"],  l_name=data["l_name"],
                                           qualification=data["qualification"],  field=data["field"],
                                           dob=data["dob"])
        
        db.session.commit()
        
        return jsonify({
            "message":"User created successfully"
        }),201
    else:
        return jsonify({
            "message":"User already exist"
        }),400
        
           
@app.route("/api/newquiz") 
@auth_required("token")
@roles_accepted("user","admin")           
def newquiz():
    recent_quizzes = Quiz.query.order_by(Quiz.id.desc()).limit(5).all()
    
    newquiz=[]
    for i in recent_quizzes:
        chap=i.chapter
        sub=chap.subject
        query={}
        query["id"]=i.id
        query["name"]=i.name
        query["description"]=i.description
        query["deadline"]=i.deadline
        query["level"]=i.level
        query["attempt"]=i.attempt
        query["chapter_id"]=i.chapter_id
        query["subject_id"]=sub.id
        newquiz.append(query)
    if newquiz:
        return newquiz
    else:
        return jsonify({"message":"No quizzes found"}),400  
        
@app.route("/upload_subject/<int:sid>",methods=["POST"]) 
@auth_required("token")
@roles_accepted("admin")  
def upload_subject(sid):
    try:
        if 'image' not in request.files:
            print("no image")
            return jsonify({'error': 'No image uploaded'}), 400 
        image = request.files['image']
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        frontend_path = os.path.join(project_root, 'frontend')
        folder = os.path.join(frontend_path, 'static', 'images', 'subject_images')
        os.makedirs(folder, exist_ok=True)
            
        filename = f"subject_{sid}.jpg"
        image_path = os.path.join(folder, filename)
        if os.path.exists(image_path):
                print(f"✅ Image exists at: {image_path}")
        else:
                print(f"❌ Image NOT found at: {image_path}")
                
        image.save(image_path)
        url_path = f'/static/images/subject_images/{filename}'
        return jsonify({'path': url_path}), 200
  
    except Exception as e:
        print(e)
        return(jsonify({'message': 'some error occoured'}),404)    
       
           
@app.route("/upload_profile", methods=["POST"]) 
@auth_required("token")
@roles_accepted("user")  
def upload_profile():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400 
        
        image = request.files['image']
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        frontend_path = os.path.join(project_root, 'frontend')
        folder = os.path.join(frontend_path, 'static', 'images', 'profile_images')
        os.makedirs(folder, exist_ok=True)
        
        filename = f"profile_{current_user.id}.jpg"
        image_path = os.path.join(folder, filename)
        if os.path.exists(image_path):
            print(f"✅ Image exists at: {image_path}")
        else:
            print(f"❌ Image NOT found at: {image_path}")
            
        image.save(image_path)
        return jsonify({'path': f'{image_path}'}),200   
    except Exception as e:
        print(e)
        return(jsonify({'message': 'some error occoured'}),404)

            
@auth_required("token")        
@app.route("/logout",methods=["POST"])
def logout():
    try:
     logout_user() 
     if current_user.is_authenticated:
         return jsonify({"message":"Cannot log out"  }),404
       
     else:
         print("logged out")
         return {"message":"Logged out Successfully"}
         
    except:
        return jsonify({"message":"Cannot log out"  }),404
 
        
@app.route("/user_count")
@auth_required("token")  
@roles_accepted("admin")
def student_count():
    user_count=User.query.count()
         
from collections import defaultdict


@app.route("/quiz_count")
@auth_required("token")  
@roles_accepted("admin")
def quiz_count():  
    try:
        results = (
        db.session.query(
            Subject.id.label("subject_id"),
            Subject.name.label("subject_name"),
            Scorecard.id.label("scorecard_id")
        )
        .join(Chapter, Subject.id == Chapter.subject_id)
        .join(Quiz, Chapter.id == Quiz.chapter_id)
        .join(Scorecard, Quiz.id == Scorecard.quiz_id)
        .all()
    )

        counts = defaultdict(lambda: {"subject_name": "", "quiz_count": 0})

        for subject_id, subject_name, scorecard_id in results:
            counts[subject_id]["subject_name"] = subject_name
            counts[subject_id]["quiz_count"] += 1

        return [{"subject_id": sid, **info} for sid, info in counts.items()]
            
    except Exception as e:
        print("Error:", e)
        return jsonify({"message": "Error occurred"}), 500   
    
#backend jobs trigger
@app.route('/export_csv/<id>')
def export(id):
    try:
        print(id)
        result = AsyncResult(id)
        print(result)
        return send_from_directory('static/reports',result.result)
    except Exception as e:
        print(e)
        return jsonify({"message": "internal server error"},404)

    
    
@app.route("/user/csv", methods=["POST"])
@auth_required("token")  
@roles_accepted("admin","user")
def user_csv():
    try:
        uid=request.args.get('id')
        if not uid:
            uid= current_user.id
            
        task = generate_usercsvreport.delay(uid)
        return jsonify({"message": "User report started", "id": task.id})
    except Exception as e:
        print(e)
        return jsonify({"message": "internal server error"},404)


@app.route("/admin/csv", methods=["POST"])
@auth_required("token")  
@roles_accepted("admin")
def admin_csv():
    try:
        task = generate_admincsvreport.delay()
        return jsonify({"message": "Admin report started", "id": task.id})
    except Exception as e:
        print(e)
        return jsonify({"message": "internal server error"},404)


@app.route("/monthly", methods=["POST"])
def monthly():
    try:
        task = monthly_user_report.delay()
        return jsonify({"message": "Monthly emails sent", "result": task.result})
    except Exception as e:
        print(e)
        return jsonify({"message": "internal server error"},404)
        




       