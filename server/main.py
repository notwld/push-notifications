import json
from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
import os,time,requests

app = Flask(__name__)
CORS(app)

# DATABASE_URL = os.environ.get("DATABASE_URL")
DATABASE_URL = "postgres://postgres:salad123@localhost:5432"
DATABASE_URL = str(DATABASE_URL).replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    expo_tokens = db.relationship("ExpoToken", backref="user", lazy=True)


class ExpoToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

with app.app_context():
    db.create_all()

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    user = User(
        username=data["username"], email=data["email"], password=data["password"]
    )
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "User already exists"}), 400
    return jsonify({"message": "User created successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"], password=data["password"]).first()
    if user is None:
        return jsonify({"error": "Invalid credentials"}), 400
    user = {"id":user.id,"username":user.username,"email":user.email}
    return jsonify({"message": "Login successful","user":user}), 200


@app.route("/add-expo-token", methods=["POST"])
def add_expo_token():
    data = request.get_json()
    user = User.query.filter_by(id=data["user_id"]).first()
    if user is None:
        return jsonify({"error": "User not found"}), 400
    expo_token = ExpoToken(token=data["token"], user_id=user.id)
    db.session.add(expo_token)
    db.session.commit()
    return jsonify({"message": "Expo token added successfully"}), 201


def send_notification(token, msg, body):
    url = "https://exp.host/--/api/v2/push/send"
    headers = {"Content-Type": "application/json"}
    data = {"to": token, "title": msg, "body": body}
    requests.post(url, headers=headers, data=json.dumps(data))


@app.route("/send-notifications", methods=["GET","POST"])
def send_notifications():
    if request.method == "GET":
        return render_template("index.html")
    msg = request.form.get("title")
    body = request.form.get("body")

    if not msg or not body:
        return jsonify({"success": False, "message": "Missing required fields in the form"}), 400
    
    expo_tokens = ExpoToken.query.all()
    if not expo_tokens:
        return jsonify(
            {
                "success": False,
                "message": "No Expo tokens found for the provided user ID",
            }
        ), 404

    for token in expo_tokens:
        send_notification(token.token, msg, body)
        time.sleep(2)

    return jsonify(
        {"success": True, "message": "Notification sending process started"}
    ), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
