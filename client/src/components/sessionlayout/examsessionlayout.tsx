import React, { useEffect, useState, useRef } from "react";
import {
  AlertCircle,
  Camera,
  Clock,
  Send,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const ExamSessionLayout = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showWarning, setShowWarning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalQuestions = 5;

  // Camera state
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceWarning, setFaceWarning] = useState("");
  const [proctorEvents, setProctorEvents] = useState<
    Array<{
      time: string;
      event: string;
      severity: "info" | "warning" | "error";
    }>
  >([]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Low time warning
  useEffect(() => {
    if (timeLeft <= 300) {
      // 5 minutes
      setShowWarning(true);
    }
  }, [timeLeft]);

  // Initialize continuous webcam feed
  useEffect(() => {
    let stream: MediaStream | null = null;
    let faceCheckInterval: NodeJS.Timeout | null = null;

    const initializeCamera = async () => {
      try {
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        });

        // Set up video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
          setCameraError("");

          // Log successful camera initialization
          addProctorEvent("Camera initialized successfully", "info");

          // Start continuous face detection
          startFaceDetection();
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraError("Failed to access camera. Please check permissions.");
        addProctorEvent("Failed to access camera", "error");
      }
    };

    // Simulate face detection with the model
    const startFaceDetection = () => {
      // This interval simulates your face detection model
      // Replace with actual integration to your model
      faceCheckInterval = setInterval(() => {
        // Simulating face detection results
        const randomValue = Math.random();

        if (randomValue > 0.85) {
          // Simulate no face detected
          setFaceDetected(false);
          setFaceWarning("No face detected");
          addProctorEvent("No face visible in camera", "warning");

          // Draw warning on canvas
          drawToCanvas(false, "No face detected");
        } else if (randomValue > 0.75) {
          // Simulate multiple faces
          setFaceDetected(true);
          setFaceWarning("Multiple faces detected");
          addProctorEvent("Multiple faces detected", "warning");

          // Draw warning on canvas
          drawToCanvas(true, "Multiple faces detected");
        } else if (randomValue > 0.65) {
          // Simulate face partially visible
          setFaceDetected(true);
          setFaceWarning("Face partially visible");
          addProctorEvent("Face partially visible", "warning");

          // Draw warning on canvas
          drawToCanvas(true, "Face partially visible");
        } else {
          // Normal case - face detected properly
          setFaceDetected(true);
          setFaceWarning("");

          // Draw normal detection on canvas
          drawToCanvas(true);
        }
      }, 2000); // Check every 2 seconds
    };

    // Function to draw video and detection results on canvas
    const drawToCanvas = (faceDetected: boolean, warning?: string) => {
      if (!canvasRef.current || !videoRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      // Draw video feed to canvas
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // If face detected, draw a detection box
      if (faceDetected) {
        // Simulate different face positions with some movement
        const centerX = 320 + Math.sin(Date.now() / 1000) * 20;
        const centerY = 240 + Math.cos(Date.now() / 1000) * 10;
        const boxSize = 180;

        // Draw face detection box
        ctx.strokeStyle = warning ? "#EF4444" : "#22C55E";
        ctx.lineWidth = 3;
        ctx.strokeRect(
          centerX - boxSize / 2,
          centerY - boxSize / 2,
          boxSize,
          boxSize
        );

        // Draw status text
        ctx.font = "16px sans-serif";
        ctx.fillStyle = warning ? "#EF4444" : "#22C55E";
        ctx.fillText(
          warning || "Face detected",
          centerX - boxSize / 2,
          centerY - boxSize / 2 - 10
        );
      } else {
        // No face detected - show warning
        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#EF4444";
        ctx.fillText(warning || "No face detected", 20, 30);
      }

      // Always add timestamp to the corner
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(
        new Date().toLocaleTimeString(),
        canvasRef.current.width - 80,
        canvasRef.current.height - 10
      );
    };

    // Helper function to add proctor events
    const addProctorEvent = (
      event: string,
      severity: "info" | "warning" | "error"
    ) => {
      setProctorEvents((prev) => [
        { time: new Date().toLocaleTimeString(), event, severity },
        ...prev.slice(0, 9), // Keep most recent 10 events
      ]);
    };

    // Initialize camera
    initializeCamera();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (faceCheckInterval) {
        clearInterval(faceCheckInterval);
      }
    };
  }, []);

  // Visibility change detector
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Log or handle the student leaving the page
        setProctorEvents((prev) => [
          {
            time: new Date().toLocaleTimeString(),
            event: "Student left exam window",
            severity: "error",
          },
          ...prev.slice(0, 9),
        ]);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    // Submit logic
    console.log("Submitting answers:", answers);
    alert("Exam submitted successfully!");
  };

  // Reset face detection warnings
  const acknowledgeWarning = () => {
    setFaceWarning("");
  };

  const questions = [
    {
      id: "q1",
      text: "What is the capital of France?",
      options: [
        { value: "a", label: "London" },
        { value: "b", label: "Berlin" },
        { value: "c", label: "Paris" },
        { value: "d", label: "Madrid" },
      ],
    },
    {
      id: "q2",
      text: "In which year did World War II end?",
      options: [
        { value: "a", label: "1939" },
        { value: "b", label: "1945" },
        { value: "c", label: "1950" },
        { value: "d", label: "1943" },
      ],
    },
    {
      id: "q3",
      text: "What is the chemical symbol for gold?",
      options: [
        { value: "a", label: "Au" },
        { value: "b", label: "Ag" },
        { value: "c", label: "Fe" },
        { value: "d", label: "Hg" },
      ],
    },
    {
      id: "q4",
      text: "Which planet is known as the Red Planet?",
      options: [
        { value: "a", label: "Jupiter" },
        { value: "b", label: "Mars" },
        { value: "c", label: "Venus" },
        { value: "d", label: "Mercury" },
      ],
    },
    {
      id: "q5",
      text: "Who painted the Mona Lisa?",
      options: [
        { value: "a", label: "Vincent van Gogh" },
        { value: "b", label: "Pablo Picasso" },
        { value: "c", label: "Leonardo da Vinci" },
        { value: "d", label: "Michelangelo" },
      ],
    },
  ];

  return (
    <div className="relative w-screen h-screen bg-slate-50 overflow-hidden">
      {/* Header with Timer and Exam Info */}
      <div className="bg-white w-full shadow-sm px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Final Examination</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            CS103: Introduction to Computer Science
          </span>
        </div>

        <div
          className={`flex items-center rounded-full px-4 py-1.5 ${
            timeLeft <= 300
              ? "bg-red-50 text-red-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          <span className="font-mono font-semibold">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Warning Alerts */}
      <div className="absolute top-16 left-0 right-0 z-20 flex flex-col items-center gap-2">
        {/* Timer Warning */}
        {showWarning && (
          <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded shadow-md flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>Warning: Less than 5 minutes remaining!</span>
            <button
              onClick={() => setShowWarning(false)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Face Detection Warning */}
        {faceWarning && (
          <div className="w-full max-w-md bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded shadow-md flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>Proctoring alert: {faceWarning}</span>
            <button
              onClick={acknowledgeWarning}
              className="ml-auto text-slate-600 hover:text-slate-800"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Left Side - Progress Panel */}
      <div className="absolute left-6 top-24 w-64 bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-semibold text-slate-700 mb-3">Exam Progress</h3>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i + 1)}
              className={`w-10 h-10 rounded-md flex items-center justify-center font-medium text-sm
                ${
                  answers[`q${i + 1}`]
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : currentQuestion === i + 1
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {answers[`q${i + 1}`] && <CheckCircle className="w-4 h-4" />}
              {!answers[`q${i + 1}`] && i + 1}
            </button>
          ))}
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm gap-2">
            <div className="w-4 h-4 rounded-sm bg-green-100 border border-green-300"></div>
            <span className="text-slate-600">Answered</span>
          </div>
          <div className="flex items-center text-sm gap-2">
            <div className="w-4 h-4 rounded-sm bg-blue-100 border border-blue-300"></div>
            <span className="text-slate-600">Current</span>
          </div>
          <div className="flex items-center text-sm gap-2">
            <div className="w-4 h-4 rounded-sm bg-slate-100"></div>
            <span className="text-slate-600">Unanswered</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" />
          Submit Exam
        </button>
      </div>

      {/* Right Side - Live Webcam Feed with Continuous Monitoring */}
      <div className="absolute top-24 right-6 w-72">
        {/* Video Feed Container */}
        <div className="bg-white rounded-lg shadow-md p-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              Proctoring Camera
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                !isCameraReady
                  ? "bg-slate-100 text-slate-800"
                  : faceDetected
                  ? faceWarning
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {!isCameraReady
                ? "Initializing"
                : faceDetected
                ? faceWarning
                  ? "Warning"
                  : "Face Detected"
                : "No Face"}
            </span>
          </div>

          {/* Live Video Display */}
          <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
            {/* Hidden Video Element (for stream processing) */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute w-full h-full object-cover opacity-0"
            />

            {/* Canvas for Drawing Detection Results */}
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />

            {/* Fallback when camera isn't ready */}
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <div className="text-center text-white">
                  <Camera className="mx-auto w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs opacity-70">Initializing camera...</p>
                  {cameraError && (
                    <p className="text-xs text-red-400 mt-2">{cameraError}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Camera Status Text */}
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-slate-500">Face must remain visible</p>
            <span className="text-xs font-mono text-slate-400">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Proctoring Event Log */}
        <div className="bg-white rounded-lg shadow-md p-3 mb-3">
          <h3 className="text-sm font-medium text-slate-700 mb-2 flex justify-between items-center">
            <span>Proctoring Log</span>
            <span className="text-xs text-slate-400">
              {proctorEvents.length} events
            </span>
          </h3>

          <div className="max-h-40 overflow-y-auto">
            {proctorEvents.length > 0 ? (
              <div className="space-y-1.5">
                {proctorEvents.map((event, index) => (
                  <div
                    key={index}
                    className="text-xs py-1 flex justify-between items-start border-b border-slate-100 pb-1.5"
                  >
                    <span className="text-slate-500 shrink-0 mr-2">
                      {event.time}
                    </span>
                    <span
                      className={`text-right ${
                        event.severity === "error"
                          ? "text-red-600"
                          : event.severity === "warning"
                          ? "text-yellow-600"
                          : "text-slate-600"
                      }`}
                    >
                      {event.event}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-2">
                No events recorded
              </p>
            )}
          </div>
        </div>

        {/* Exam Rules */}
        <div className="bg-white rounded-lg shadow-md p-3">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            Exam Rules
          </h3>
          <ul className="text-xs text-slate-600 space-y-1 list-disc ml-4">
            <li>Do not leave the exam screen</li>
            <li>Keep your face clearly visible</li>
            <li>No other persons allowed in frame</li>
            <li>No talking or external assistance</li>
            <li>No additional devices or materials</li>
          </ul>
        </div>
      </div>

      {/* Center - Main Questions Area */}
      <div
        ref={contentRef}
        className="absolute top-24 left-0 right-0 bottom-6 mx-auto p-6 w-full max-w-3xl overflow-y-auto"
        style={{ marginLeft: "280px", marginRight: "88px" }}
      >
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6 pb-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Question {currentQuestion} of {totalQuestions}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    currentQuestion > 1 &&
                    setCurrentQuestion(currentQuestion - 1)
                  }
                  disabled={currentQuestion === 1}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    currentQuestion < totalQuestions &&
                    setCurrentQuestion(currentQuestion + 1)
                  }
                  disabled={currentQuestion === totalQuestions}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {questions.map((question, index) => (
            <div
              key={question.id}
              className={`space-y-4 ${
                index + 1 === currentQuestion ? "block" : "hidden"
              }`}
            >
              <h3 className="text-lg font-medium text-slate-800">
                {question.text}
              </h3>

              <div className="space-y-3 mt-4">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className={`block p-3 border rounded-lg transition-colors cursor-pointer
                      ${
                        answers[question.id] === option.value
                          ? "bg-blue-50 border-blue-300"
                          : "hover:bg-slate-50 border-slate-200"
                      }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={answers[question.id] === option.value}
                        onChange={() =>
                          handleAnswerChange(question.id, option.value)
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-slate-700">
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-4 mt-6 border-t border-slate-100">
                <button
                  onClick={() =>
                    currentQuestion > 1 &&
                    setCurrentQuestion(currentQuestion - 1)
                  }
                  disabled={currentQuestion === 1}
                  className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Previous
                </button>

                {currentQuestion < totalQuestions ? (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
                  >
                    Save & Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded flex items-center gap-2"
                  >
                    <span>Submit Exam</span>
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamSessionLayout;
