from flask_sqlalchemy import SQLAlchemy
import uuid
import json
from sqlalchemy.ext.mutable import MutableDict, MutableList
from sqlalchemy.types import Text, Boolean, Integer, String

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    # Relationship to user progress
    progress = db.relationship("UserProgress", backref="user", lazy=True, cascade="all, delete-orphan")


class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    duration = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(300), default="")
    topics = db.Column(db.Text, default="[]")  # JSON string of topics
    quiz = db.Column(db.Text, default="[]")    # JSON string of quiz questions
    created_at = db.Column(db.Integer)

    # Relationship to user progress
    progress = db.relationship("UserProgress", backref="course", lazy=True, cascade="all, delete-orphan")


class UserProgress(db.Model):
    __tablename__ = "user_progress"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    course_id = db.Column(db.String(36), db.ForeignKey("courses.id"), nullable=False)

    completed_topics = db.Column(db.Text, default="[]")  # JSON array of topic IDs
    quiz_results = db.Column(db.Text, default="{}")      # JSON object {quiz_id: score}
    certificate_earned = db.Column(db.Boolean, default=False)
    last_updated = db.Column(db.Integer)

    def add_completed_topic(self, topic_id):
        """Add a completed topic if not already present."""
        topics = json.loads(self.completed_topics or "[]")
        if topic_id not in topics:
            topics.append(topic_id)
            self.completed_topics = json.dumps(topics)

    def update_quiz_score(self, quiz_id, score):
        """Update quiz score and store in quiz_results."""
        results = json.loads(self.quiz_results or "{}")
        results[quiz_id] = score
        self.quiz_results = json.dumps(results)
