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
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# ---------------- HEALTH ----------------
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "BLMS backend running"}), 200

# ---------------- AUTH ----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    if not all(k in data for k in ("name", "email", "password")):
        return jsonify({"message": "All fields required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already registered"}), 409

    user = User(
        name=data["name"],
        email=data["email"],
        password=generate_password_hash(data["password"])
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Signup successful",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not check_password_hash(user.password, data.get("password")):
        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }), 200

# ---------------- COURSES ----------------
@app.route("/courses", methods=["POST"])
def add_course():
    data = request.get_json()

    if not all(k in data for k in ("title", "description", "duration")):
        return jsonify({"message": "Missing fields"}), 400

    course = Course(
        title=data["title"],
        description=data["description"],
        duration=data["duration"],
        image=data.get("image", ""),
        topics=json.dumps(data.get("topics", [])),
        quiz=json.dumps(data.get("quiz", [])),
        created_at=int(time.time())
    )

    db.session.add(course)
    db.session.commit()
    return jsonify({"message": "Course added"}), 201


@app.route("/courses", methods=["GET"])
def get_courses():
    courses = Course.query.order_by(Course.created_at.desc()).all()
    return jsonify([{
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "duration": c.duration,
        "image": c.image,
        "topics": json.loads(c.topics or "[]"),
        "quiz": json.loads(c.quiz or "[]")
    } for c in courses]), 200


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

# ---------------- PROGRESS ----------------
@app.route("/progress/<string:user_id>/<string:course_id>", methods=["GET"])
def get_progress(user_id, course_id):
    progress = UserProgress.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()

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


@app.route("/progress/<string:user_id>/<string:course_id>/topic", methods=["POST"])
def update_topic(user_id, course_id):
    data = request.get_json()
    topic_id = data.get("topic_id")

    progress = UserProgress.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()

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

    course = Course.query.get(course_id)
    total = len(json.loads(course.quiz or "[]")) if course else 0

    progress = UserProgress.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()

    if not progress:
        progress = UserProgress(
            user_id=user_id,
            course_id=course_id,
            quiz_results=json.dumps({quiz_id: score})
        )
        db.session.add(progress)
    else:
        results = json.loads(progress.quiz_results or "{}")
        results[quiz_id] = score
        progress.quiz_results = json.dumps(results)

    if quiz_id == "final" and total:
        progress.certificate_earned = (score / total) >= 0.6

    progress.last_updated = int(time.time())
    db.session.commit()

    return jsonify({
        "message": "Quiz updated",
        "certificate_earned": progress.certificate_earned
    }), 200

# ---------------- ANNOUNCEMENTS ----------------
announcements_store = []

@app.route("/announcements", methods=["POST"])
def add_announcement():
    data = request.get_json()
    announcements_store.append({
        "id": str(uuid.uuid4()),
        "title": data.get("title"),
        "message": data.get("message"),
        "type": data.get("type", "update"),
        "createdAt": int(time.time())
    })
    return jsonify({"message": "Announcement added"}), 201


@app.route("/announcements", methods=["GET"])
def get_announcements():
    return jsonify(
        sorted(announcements_store, key=lambda x: x["createdAt"], reverse=True)
    ), 200

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
