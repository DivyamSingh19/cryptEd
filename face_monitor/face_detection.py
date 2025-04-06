import cv2
import face_recognition
import time
import threading

class FaceRecognitionExam:
    def __init__(self, camera_index=0, tolerance=0.6, detection_timeout=10):
        self.camera_index = camera_index
        self.tolerance = tolerance
        self.detection_timeout = detection_timeout
        self.known_face_encodings = []
        self.known_face_names = []
        self.face_detected = True
        self.detection_start_time = None
        self.camera_active = True
        self.warning_issued = False
        self.camera_thread = None

    def load_known_faces(self, image_paths, names):
        """Loads known faces and their names."""
        for image_path, name in zip(image_paths, names):
            image = face_recognition.load_image_file(image_path)
            face_encoding = face_recognition.face_encodings(image)
            if face_encoding:
                self.known_face_encodings.append(face_encoding[0])
                self.known_face_names.append(name)
            else:
                print(f"Warning: No face found in {image_path}")

    def detect_faces(self):
        """Detects faces in the camera feed."""
        video_capture = cv2.VideoCapture(self.camera_index)

        while self.camera_active:
            ret, frame = video_capture.read()
            if not ret:
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_frame)
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            face_names = []
            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=self.tolerance)
                name = "Unknown"

                if True in matches:
                    first_match_index = matches.index(True)
                    name = self.known_face_names[first_match_index]

                face_names.append(name)

            for (top, right, bottom, left), name in zip(face_locations, face_names):
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 0.5, (255, 255, 255), 1)

            if face_locations:
                self.face_detected = True
                self.detection_start_time = time.time()
                self.warning_issued = False #reset warning when face is present

            else:
                if self.face_detected:
                    self.face_detected = False
                    self.detection_start_time = time.time()

                if not self.face_detected and self.detection_start_time is not None:
                    elapsed_time = time.time() - self.detection_start_time
                    if elapsed_time > self.detection_timeout and not self.warning_issued:
                        print("Warning: Student's face not detected for too long!")
                        self.camera_active = False
                        self.warning_issued = True

            cv2.imshow('Video', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        video_capture.release()
        cv2.destroyAllWindows()

    def run(self):
        """Runs the face recognition."""
        self.camera_thread = threading.Thread(target=self.detect_faces)
        self.camera_thread.start()
        self.camera_thread.join() #Wait for camera thread to finish.
        if self.warning_issued:
            print("Camera Stopped. Warning Issued")
        else:
            print("Exam Ended normally")

# Example usage:
if __name__ == "__main__":
    image_paths = ["student1.jpg", "student2.jpg"]  # Replace with your image paths
    names = ["Student 1", "Student 2"]  # Replace with student names

    exam = FaceRecognitionExam()
    exam.load_known_faces(image_paths, names)
    exam.run()