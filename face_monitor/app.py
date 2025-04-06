# app.py (Flask backend)
from flask import Flask, request, jsonify, render_template
import cv2
import face_recognition
import numpy as np
import os
import time
from datetime import datetime

app = Flask(__name__)

# --- 1. Load Known Faces and Student Data ---
known_face_encodings = []
known_face_names = []
student_data = {}  # Store student exam data
last_face_time = {}
detection_timeout = 10
exam_start_time = {} #store the exam start time.

def load_known_faces(image_folder):
    """Loads known faces and student data from the specified folder."""
    for filename in os.listdir(image_folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(image_folder, filename)
            image = face_recognition.load_image_file(image_path)
            face_encodings = face_recognition.face_encodings(image)
            if face_encodings:
                name = filename.split('.')[0]
                known_face_encodings.append(face_encodings[0])
                known_face_names.append(name)
                student_data[name] = {"attendance": [], "warnings": []} # Initialize student data.
            else:
                print(f"Warning: No face found in {image_path}")

load_known_faces("student_images")

# --- 2. Define Routes ---
@app.route('/')
def index():
    """Renders the HTML page."""
    return render_template('index.html')

@app.route('/start_exam', methods=['POST'])
def start_exam():
    """Starts the exam for a student."""
    student_name = request.form.get('student_name')
    if student_name in student_data:
        exam_start_time[request.remote_addr] = datetime.now()
        return jsonify({"message": f"Exam started for {student_name}"})
    else:
        return jsonify({"error": "Student not found."}), 404

@app.route('/upload', methods=['POST'])
def upload():
    """Handles image uploads and performs face recognition."""
    file = request.files['image']
    if file:
        nparr = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        rgb_frame = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        face_names = []
        face_locations_return = []
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]
            face_names.append(name)
            face_locations_return.append({"top": int(top), "right": int(right), "bottom": int(bottom), "left": int(left)})

        if face_names:
            last_face_time[request.remote_addr] = time.time()
            for name in face_names:
                if name in student_data:
                    student_data[name]["attendance"].append(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            return jsonify({"names": face_names, "locations": face_locations_return})
        else:
            if request.remote_addr in last_face_time and (time.time() - last_face_time[request.remote_addr]) > detection_timeout:
                del last_face_time[request.remote_addr]
                for name in student_data:
                    student_data[name]["warnings"].append(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                return jsonify({"warning": "Face not detected for too long!", "camera_off": True})
            return jsonify({"names": [], "camera_off": False})
    return jsonify({"error": "No image uploaded", "camera_off": False})

@app.route('/get_student_data/<student_name>')
def get_student_data(student_name):
    """Retrieves student exam data."""
    if student_name in student_data:
        return jsonify(student_data[student_name])
    else:
        return jsonify({"error": "Student not found."}), 404

if __name__ == '__main__':
    app.run(debug=True)