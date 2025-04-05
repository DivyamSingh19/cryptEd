import React, { useEffect, useState, useRef } from "react";
import { AlertCircle, Camera, Clock, Send, CheckCircle } from "lucide-react";

const ExamSessionLayout = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showWarning, setShowWarning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const totalQuestions = 5;

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

  // Visibility change detector
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Log or handle the student leaving the page
        console.log("Student left exam page");
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

      {/* Warning Alert */}
      {showWarning && (
        <div className="absolute top-16 left-0 right-0 mx-auto w-full max-w-md bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded shadow-md flex items-center z-20">
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

      {/* Right Side - Video feed */}
      <div className="absolute top-24 right-6 w-72">
        <div className="bg-white rounded-lg shadow-md p-3 mb-3">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            Proctoring Camera
          </h3>
          <div className="bg-slate-800 w-full h-44 rounded-md flex items-center justify-center text-white">
            <div className="text-center">
              <Camera className="mx-auto w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs opacity-70">Camera feed</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Your face must be visible at all times
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            Exam Rules
          </h3>
          <ul className="text-xs text-slate-600 space-y-1 list-disc ml-4">
            <li>Do not leave the exam screen</li>
            <li>Maintain face visibility in camera</li>
            <li>No external resources allowed</li>
            <li>Submit before time expires</li>
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
