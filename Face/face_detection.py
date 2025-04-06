# face_detection.py
import cv2
import numpy as np
import mediapipe as mp
import time
from flask_socketio import emit

mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils
mp_face_mesh = mp.solutions.face_mesh

face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.5)
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

no_face_start_time = 0

def detect_faces(frame):
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_detection.process(rgb_frame)
    faces = []
    if results.detections:
        for detection in results.detections:
            bbox = detection.location_data.relative_bounding_box
            h, w, c = frame.shape
            x, y, width, height = int(bbox.xmin * w), int(bbox.ymin * h), int(bbox.width * w), int(bbox.height * h)
            faces.append((x, y, width, height))
    return faces

def check_multiple_faces(faces):
    return len(faces) > 1

def process_frame_with_no_face_check(frame):
    global no_face_start_time
    faces = detect_faces(frame)
    multiple_faces = check_multiple_faces(faces)
    face_detected = len(faces) > 0

    if not face_detected:
        if no_face_start_time == 0:
            no_face_start_time = time.time()
        elif time.time() - no_face_start_time > 10:
            emit('close_camera')
            return frame, multiple_faces, face_detected, True
    else:
        no_face_start_time = 0

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    return frame, multiple_faces, face_detected, False

def check_eye_gaze(frame):
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        landmarks = results.multi_face_landmarks[0].landmark
        mesh_points = np.array([[landmark.x, landmark.y, landmark.z] for landmark in landmarks])
        frame_height, frame_width, _ = frame.shape
        mesh_points[:, 0] *= frame_width
        mesh_points[:, 1] *= frame_height

        left_iris = mesh_points[473:478]
        right_iris = mesh_points[468:473]

        left_iris_center = np.mean(left_iris, axis=0)
        right_iris_center = np.mean(right_iris, axis=0)

        horizontal_diff = abs(left_iris_center[0] - right_iris_center[0])
        vertical_diff = abs(left_iris_center[1] - right_iris_center[1])

        horizontal_threshold = frame_width / 10
        vertical_threshold = frame_height / 15

        if horizontal_diff < horizontal_threshold and vertical_diff < vertical_threshold:
            return True
        else:
            return False

    else:
        return None