from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Course, UserProgress
import os
import json
import time
import uuid

app = Flask(__name__)

# ---------------- CORS ----------------
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# ---------------- DATABASE ----------------
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "database.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
with app.app_context():
    db.create_all()

# ---------------- SIGNUP ----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 409

    user = User(
        name=name,
        email=email,
        password=generate_password_hash(password)
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }), 201

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }), 200

# ---------------- HEALTH CHECK ----------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "BLMS backend running"}), 200

# ---------------- COURSES ----------------
@app.route("/courses", methods=["POST"])
def add_course():
    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    duration = data.get("duration")
    image = data.get("image", "")
    topics = data.get("topics", [])
    quiz = data.get("quiz", [])

    if not title or not description or not duration:
        return jsonify({"message": "Title, description, and duration required"}), 400

    course = Course(
        title=title,
        description=description,
        duration=duration,
        image=image,
        topics=json.dumps(topics),
        quiz=json.dumps(quiz),
        created_at=int(time.time())
    )
    db.session.add(course)
    db.session.commit()

    return jsonify({"message": "Course added successfully"}), 201

@app.route("/courses", methods=["GET"])
def get_courses():
    courses = Course.query.order_by(Course.created_at.desc()).all()
    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "duration": c.duration,
            "image": c.image,
            "topics": json.loads(c.topics or "[]"),
            "quiz": json.loads(c.quiz or "[]")
        } for c in courses
    ]), 200

@app.route("/courses/<string:course_id>", methods=["GET"])
def get_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"message": "Course not found"}), 404
    return jsonify({
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "duration": course.duration,
        "image": course.image,
        "topics": json.loads(course.topics or "[]"),
        "quiz": json.loads(course.quiz or "[]")
    }), 200

@app.route("/courses/<string:course_id>", methods=["DELETE"])
def delete_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"message": "Course not found"}), 404
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course deleted"}), 200

# ---------------- USER PROGRESS ----------------
@app.route("/progress/<string:user_id>/<string:course_id>/topic", methods=["POST"])
def update_topic(user_id, course_id):
    data = request.get_json()
    topic_id = data.get("topic_id")
    if topic_id is None:
        return jsonify({"message": "topic_id required"}), 400

    progress = UserProgress.query.filter_by(user_id=user_id, course_id=course_id).first()
    if not progress:
        progress = UserProgress(
            user_id=user_id,
            course_id=course_id,
            completed_topics=json.dumps([topic_id])
        )
        db.session.add(progress)
    else:
        completed = json.loads(progress.completed_topics or "[]")
        if topic_id not in completed:
            completed.append(topic_id)
            progress.completed_topics = json.dumps(completed)

    progress.last_updated = int(time.time())
    db.session.commit()
    return jsonify({"message": "Topic updated"}), 200

@app.route("/progress/<string:user_id>/<string:course_id>/quiz", methods=["POST"])
def update_quiz(user_id, course_id):
    data = request.get_json()
    quiz_id = data.get("quiz_id")
    score = data.get("score")

    if quiz_id is None or score is None:
        return jsonify({"message": "quiz_id and score required"}), 400

    # Get course quiz length automatically
    course = Course.query.get(course_id)
    total_questions = len(json.loads(course.quiz or "[]")) if course else 0

    progress = UserProgress.query.filter_by(user_id=user_id, course_id=course_id).first()
    if not progress:
        progress = UserProgress(
            user_id=user_id,
            course_id=course_id,
            quiz_results=json.dumps({quiz_id: score})
        )
        db.session.add(progress)
    else:
        quiz_results = json.loads(progress.quiz_results or "{}")
        quiz_results[quiz_id] = score
        progress.quiz_results = json.dumps(quiz_results)

    # ✅ Certificate earned if final score >= 60%
    if quiz_id == "final" and total_questions > 0:
        progress.certificate_earned = (score / total_questions) >= 0.6

    progress.last_updated = int(time.time())
    db.session.commit()
    return jsonify({
        "message": "Quiz updated",
        "certificate_earned": progress.certificate_earned
    }), 200

@app.route("/progress/<string:user_id>/<string:course_id>", methods=["GET"])
def get_progress(user_id, course_id):
    progress = UserProgress.query.filter_by(user_id=user_id, course_id=course_id).first()
    if not progress:
        return jsonify({
            "completed_topics": [],
            "quiz_results": {},
            "certificate_earned": False
        }), 200
    return jsonify({
        "completed_topics": json.loads(progress.completed_topics or "[]"),
        "quiz_results": json.loads(progress.quiz_results or "{}"),
        "certificate_earned": progress.certificate_earned
    }), 200

# ---------------- ANNOUNCEMENTS ----------------
announcements_store = []

@app.route("/announcements", methods=["POST"])
def add_announcement():
    data = request.get_json()
    title = data.get("title")
    message = data.get("message")
    type_ = data.get("type", "update")

    if not title or not message:
        return jsonify({"message": "Title and message required"}), 400

    announcements_store.append({
        "id": str(uuid.uuid4()),
        "title": title,
        "message": message,
        "type": type_,
        "createdAt": int(time.time())
    })
    return jsonify({"message": "Announcement added"}), 201

@app.route("/announcements", methods=["GET"])
def get_announcements():
    return jsonify(sorted(announcements_store, key=lambda x: x["createdAt"], reverse=True)), 200

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
