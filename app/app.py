from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
from user_management import User

app = Flask(__name__)
cors = CORS(app)

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
  { 'title': 'Mercedes', 'id': 1, 'description': 'Elegance in motion: where luxury meets performance.', "status":"To Do"},
  { 'title': 'Audi', 'id': 2,'description': 'Innovation that excites: redefining the driving experience, one Audi at a time', "status":"Doing" },
  { 'title': 'BMW', 'id': 3, 'description': "Born to stand out. Elevate your drive with BMW's iconic design and performance.", "status":"Done"},
];

@app.route("/api/taskmgr/lists", methods=["POST"])
@cross_origin()
def sample_to_list():
    return jsonify(tasks), 200

@app.route("/api/taskmgr/update", methods=["POST"])
@cross_origin()
def update_list():
    global tasks
    if request.method == "POST":
        tasks = request.json
    return jsonify(tasks), 200