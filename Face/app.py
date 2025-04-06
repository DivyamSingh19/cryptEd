# app.py
from flask import Flask, render_template, Response
import cv2
import numpy as np
from flask_socketio import SocketIO, emit
import time
from face_detection import process_frame_with_no_face_check, check_eye_gaze
import threading
import face_recognition
import os

app = Flask(__name__)
socketio = SocketIO(app)

multiple_faces_detected = False
no_face_detected = False
not_looking_start_time = 0
environment = 'classroom'
student_verified = False
verification_timer = None
camera_running = True

student_encodings = {}
student_images_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "student_images")

for student_name in os.listdir(student_images_dir):
    student_dir = os.path.join(student_images_dir, student_name)
    if os.path.isdir(student_dir):
        encodings_list = []
        for image_file in os.listdir(student_dir):
            image_path = os.path.join(student_dir, image_file)
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)
            if len(encodings) > 0:
                encodings_list.extend(encodings)
        if len(encodings_list) > 0:
            student_encodings[student_name] = encodings_list

def verify_student(frame):
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame_encodings = face_recognition.face_encodings(rgb_frame)

    if not frame_encodings:
        return None, None

    for frame_encoding in frame_encodings:
        best_match_student = None
        best_match_distance = float('inf')

        for student_name, known_encodings in student_encodings.items():
            distances = face_recognition.face_distance(known_encodings, frame_encoding)
            min_distance = min(distances)
            if min_distance < best_match_distance:
                best_match_distance = min_distance
                best_match_student = student_name

        if best_match_distance <= 0.6: #Adjust threshold as needed.
            return best_match_student, best_match_distance
        else:
            return None, None

def verification_timeout():
    socketio.emit('verification_message', {'message': 'Student not recognized. Video feed stopped.'})

@socketio.on('environment_change')
def handle_environment_change(data):
    global environment
    environment = data['environment']
    print(f"Environment changed to: {environment}")

def generate_frames():
    global multiple_faces_detected, no_face_detected, not_looking_start_time, environment, student_verified, verification_timer, camera_running
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + b'\r\n')
        return

    while cap.isOpened() and camera_running:
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture frame.")
            break

        if not student_verified:
            student_id, distance = verify_student(frame)
            if student_id:
                student_verified = True
                socketio.emit('verification_message', {'message': f'Student Verified: {student_id}, Distance: {distance}'})
                if verification_timer and verification_timer.is_alive():
                    verification_timer.cancel()
            else:
                socketio.emit('verification_message', {'message': 'Verifying student identity...'})
                if verification_timer is None or not verification_timer.is_alive():
                    verification_timer = threading.Timer(20, verification_timeout)
                    verification_timer.start()
                continue

        frame, multiple_faces, face_detected, close_cam = process_frame_with_no_face_check(frame)
        if close_cam:
            camera_running = False
            socketio.emit('close_camera')
            continue

        no_face_detected = not face_detected

        if environment == 'home':
            multiple_faces_detected = multiple_faces
            if multiple_faces:
                socketio.emit('multiple_faces', {'multiple_faces': True})
            else:
                socketio.emit('multiple_faces', {'multiple_faces': False})
        else:
            socketio.emit('multiple_faces', {'multiple_faces': False})

        if no_face_detected:
            socketio.emit('no_face', {'no_face': True})
        else:
            socketio.emit('no_face', {'no_face': False})

        looking_forward = check_eye_gaze(frame)
        if not looking_forward:
            if not_looking_start_time == 0:
                not_looking_start_time = time.time()
            elif time.time() - not_looking_start_time > 5:
                socketio.emit('not_looking', {'not_looking': True})
        else:
            not_looking_start_time = 0
            socketio.emit('not_looking', {'not_looking': False})

        frame = cv2.resize(frame, (320, 240))
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.1)

    if cap.isOpened():
        cap.release()
    print("Camera Closed")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    socketio.run(app, debug=True)