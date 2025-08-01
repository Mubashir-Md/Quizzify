import { useTheme } from "@/contexts/ThemeContext";

const QuizLoader = () => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`flex items-center justify-center h-screen overflow-hidden ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div
        className={`backdrop-blur-xl shadow-2xl rounded-xl p-10 flex flex-col items-center justify-center space-y-4 w-full max-w-md ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="text-6xl animate-pulse">🧠</div>
        <h2
          className={`text-2xl font-semibold ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Generating Your Quiz
        </h2>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Please wait while we prepare your questions...
        </p>
        <div
          className={`rounded-full h-2 w-full overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <div
            className={`h-full animate-pulse ${
              isDarkMode ? "bg-yellow-400" : "bg-yellow-500"
            }`}
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuizLoader;
