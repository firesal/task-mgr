import random
from flask import Flask, render_template, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from user_management import User
from task_management import add_first_task_for_user, fetch_user_tasks


app = Flask(__name__)
cors = CORS(app, supports_credentials=True)

def add_demo_user():
    demo_user_id = str(User.add_demo_user())

    #add first task for the user created
    return add_first_task_for_user(demo_user_id), demo_user_id

def check_cookies(request):
    cookies = request.cookies
    return cookies.get('USER_ID', False)

@app.route("/")
def main_app():
    return render_template("index.html")


@app.route("/api/user/add_user")
def handle_form_data():
    # Check if the request contains form data
    if request.method == "POST" and request.form:
        # Get form data
        form_data = request.form

        response = User.add_user(dict(form_data))
        return jsonify(response), 200
    else:
        # No form data found in the request
        return "No form data found", 400

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
            response = make_response(jsonify(new_user_response['tasks']), 200)
            # response.set_cookie('USER_ID', str(new_user_id), domain='localhost', path='/')
            response.headers['Set-Cookie'] = f'USER_ID={str(new_user_id)}; Path=/'
            return response
    else:
        user_id = request.cookies.get('USER_ID', False)
        user_tasks = fetch_user_tasks(user_id)
        return jsonify(user_tasks), 200 
    return jsonify(tasks), 200 
    # return jsonify(tasks), 200

@app.route("/api/taskmgr/update", methods=["POST", "OPTIONS"])
@cross_origin()
def update_list():
    global tasks
    if request.method == "POST":
        tasks = request.json
        for i, task in enumerate(tasks):
            if task['id'] == 'new_id':
                tasks[i]['id'] = str(random.getrandbits(128))

    return jsonify(tasks), 200