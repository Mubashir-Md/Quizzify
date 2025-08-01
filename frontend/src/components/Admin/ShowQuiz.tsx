import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { CheckCircle, FileText } from "lucide-react";
import { useState } from "react";
import ButtonQuiz from "../ui/Button";

const ShowQuiz = () => {
  const quizData = JSON.parse(localStorage.getItem("quiz") || "");
  const { session } = useAuth();
  const nav = useNavigate();
  const {isDarkMode} = useTheme()
  const [loading, setLoading] = useState(false);
  
  const saveQuiz = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/saveQuiz`, quizData, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      })

      nav(`/admin/profile`);

    } catch (error) {
        setLoading(false);
        console.error("Error saving quiz:", error);
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h1 className={`text-3xl sm:text-4xl font-bold ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Quiz Preview
            </h1>
          </div>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Review your generated quiz before saving
          </p>
        </div>

        {/* Quiz Info Card */}
        <div className={`rounded-xl shadow-lg border mb-8 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-4 sm:p-6">
            <h2 className={`text-xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Quiz Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Topic
                </p>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {quizData.topic}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Questions
                </p>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {quizData.questions.length}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Difficulty
                </p>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {quizData.difficulty}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Card */}
        <div className={`rounded-xl shadow-lg border mb-8 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-4 sm:p-6">
            <h2 className={`text-xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Questions & Answers
            </h2>
            
            <div className="space-y-6 max-h-96 sm:max-h-[500px] overflow-y-auto pr-2">
              {quizData.questions.map((item: any, index: any) => (
                <div key={index} className={`p-4 rounded-lg border transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  {/* Question */}
                  <div className="mb-4">
                    <h3 className={`font-semibold text-lg mb-2 ${
                      isDarkMode ? 'text-white' : 'text-black'
                    }`}>
                      {index + 1}. {item.question}
                    </h3>
                  </div>
                  
                  {/* Choices */}
                  <div className="mb-4">
                    <p className={`text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Options:
                    </p>
                    <ul className="space-y-2">
                      {item.choices.map((choice: any, choiceIndex: any) => (
                        <li key={choiceIndex} className={`flex items-center gap-2 text-sm ${
                          choice === item.answer 
                            ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                            : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {choice === item.answer ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="w-4 h-4 flex items-center justify-center">•</span>
                          )}
                          {choice}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Answer */}
                  <div className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-yellow-400/10 border border-yellow-400/20' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                    }`}>
                      Correct Answer: {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <ButtonQuiz
            onClick={saveQuiz}
            disabled={loading}
            className="px-8 py-4 text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                Saving Quiz...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Save Quiz
              </>
            )}
          </ButtonQuiz>
        </div>
      </div>
    </div>
  );
};

export default ShowQuiz;
