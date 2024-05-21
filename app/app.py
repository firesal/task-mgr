import random
from flask import Flask, render_template, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from user_management import User
from task_management import add_first_task_for_user, fetch_user_tasks, update_task_mongo, add_task_for_user, delete_task_by_task_id


app = Flask(__name__)
cors = CORS(app, supports_credentials=True)

def add_demo_user():
    demo_user_id = str(User.add_demo_user())

    #add first task for the user created
    return add_first_task_for_user(demo_user_id), demo_user_id

def check_cookies(request):
    cookies = request.cookies
    return cookies.get('USER_ID', False)

def make_user_response(tasks, user_id):
    user_details = User.find_user_by_id(user_id)
    return {
            'tasks': tasks,
            'username': user_details[0]['username']
    }

@app.route("/")
def main_app():
    return render_template("index.html")


@app.route("/api/user/login",methods=["POST"])
def user_login():
    result = User.login_user(**request.json)
    if result["status"] == True:
        response.headers['Set-Cookie'] = f'USER_ID={str(result["user_id"])}; Path=/'
    response = make_response(jsonify(result), 200)
    return response, 200


@app.route("/api/user/add_user",methods=["POST"])
def handle_form_data():
    # Check if the request contains form data
    user_id = request.cookies.get('USER_ID', False)
    if request.method == "POST":
        # Get form data
        form_data = request.json
        new_user = User(**form_data)
        if new_user.validate_new_user():
            return User.rename_and_update_user(user_id, form_data)
            # return jsonify({'status': True, 'message': 'Validation Success'}), 200
        else:
            return jsonify({'status': False, 'message': new_user.validation_msg}), 200
        # response = User.add_user(dict(form_data))
        # return jsonify(response), 200

tasks = [
  { 'title': 'Your First Task...', 'id': str(random.getrandbits(128)), 'description': 'Click to edit. Put your description here..', 'status':'To Do'}
  
];

@app.route("/api/taskmgr/lists", methods=["POST"])
def sample_to_list():
    # if request.method == "OPTIONS":
        # Respond to the preflight request
    response = make_response()
    response.headers["Access-Control-Allow-Methods"] = "POST"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Max-Age"] = "86400"
    response.headers.add('Access-Control-Allow-Origin', '*')  # 24 hours
    if not check_cookies(request):
        new_user_response, new_user_id = add_demo_user()
        if new_user_response['status'] == True:
            response = make_response(jsonify(make_user_response(new_user_response['tasks'], new_user_id)), 200)
            # response.set_cookie('USER_ID', str(new_user_id), domain='localhost', path='/')
            response.headers['Set-Cookie'] = f'USER_ID={str(new_user_id)}; Path=/'
            return response
    else:
        user_id = request.cookies.get('USER_ID', False)
        user_tasks = fetch_user_tasks(user_id)
        if not user_tasks:
            user = User.find_user_by_id(user_id)
            if not user:
                new_user_response, new_user_id = add_demo_user()
                response = make_response(jsonify(make_user_response(new_user_response['tasks'], new_user_id)), 200)
                response.headers['Set-Cookie'] = f'USER_ID={str(new_user_id)}; Path=/'
                return response


        return jsonify(make_user_response(user_tasks, user_id)), 200 
    return jsonify(make_user_response(tasks, 'new_user')), 200 
    # return jsonify(tasks), 200

@app.route("/api/taskmgr/update", methods=["POST"])
def update_list():
    user_id = request.cookies.get('USER_ID', False)
    if request.method == "POST":
        tasks = request.json['tasks']
        task_id = request.json.get('task_id', False)
        for i, task in enumerate(tasks):
            if task['id'] == task_id and task_id != 'new_id':
                update_task_mongo(task_id, task)
    
    user_tasks = fetch_user_tasks(user_id)
    return jsonify(user_tasks), 200


@app.route("/api/taskmgr/add", methods=["POST"])
def add_list():
    user_id = request.cookies.get('USER_ID', False)
    if request.method == "POST":
        tasks = request.json['tasks']
        task_id = request.json.get('task_id', 'new_id')
        for i, task in enumerate(tasks):
            if task['id'] == 'new_id' and task_id == 'new_id':
                result = add_task_for_user(user_id, task)
                tasks[i]['id'] =result['task_id']
    
    user_tasks = fetch_user_tasks(user_id)
    return jsonify(user_tasks), 200


@app.route("/api/taskmgr/delete", methods=["POST"])
def delete_list():
    user_id = request.cookies.get('USER_ID', False)
    if request.method == "POST":
        task_id = request.json.get('task_id', 'new_id')
        result = delete_task_by_task_id(task_id)
        
        user_tasks = fetch_user_tasks(user_id)
        return jsonify(user_tasks), 200