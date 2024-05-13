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



products = [
  { 'title': 'Mercedes', 'id': 1 },
  { 'title': 'Audi', 'id': 2 },
  { 'title': 'BMW', 'id': 3 },
];

@app.route("/api/todo/lists", methods=["POST"])
@cross_origin()
def sample_to_list():
    return jsonify(products), 200
    