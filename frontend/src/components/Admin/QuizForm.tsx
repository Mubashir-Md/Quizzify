import { useState } from "react";
import Button from "../ui/Button";
import Input  from "../ui/Input";
import Select from "../ui/Select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QuizLoader from "../QuizLoader";
import { useAuth } from "@/contexts/AuthContext";
import AuthSupa from "./AuthSupa";
import { useTheme } from "@/contexts/ThemeContext";
import { Brain } from "lucide-react";

const QuizForm = () => {
  const [inputValues, setInputValues] = useState({
    topic: "",
    questions: 0,
    choices: "",
    difficulty: "",
  });

  const { user, session } = useAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const nav = useNavigate();

  if (!user)
    return (
      <div className="flex justify-center items-center bg-black h-screen text-white text-2xl">
        Loading ...
      </div>
    );

  const submitForm = async () => {
    console.log(inputValues);
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz`,
        {
          ...inputValues,
          ownerId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      localStorage.setItem("quiz", JSON.stringify(res.data));
      nav("/admin/showQuiz");
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  if (!session || !user) return <AuthSupa />;

  if (loading) return <QuizLoader />;

  // return (
  //   <div
  //     className={`min-h-screen transition-colors duration-300 ${
  //       isDarkMode ? "bg-black text-white" : "bg-white text-black"
  //     }`}
  //   >
  //     <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
  //       <div className="w-full max-w-md space-y-6">
  //         {/* Welcome Message */}
  //         <div className="text-center">
  //           <h1
  //             className={`text-2xl font-bold mb-2 ${
  //               isDarkMode ? "text-white" : "text-black"
  //             }`}
  //           >
  //             Welcome, {user?.email} 👋
  //           </h1>
  //           <p
  //             className={`text-sm ${
  //               isDarkMode ? "text-gray-400" : "text-gray-600"
  //             }`}
  //           >
  //             Let's create an amazing quiz together
  //           </p>
  //         </div>
  //         <div
  //           className={`rounded-xl shadow-lg border transition-all duration-300 ${
  //             isDarkMode
  //               ? "bg-gray-900 border-gray-800"
  //               : "bg-white border-gray-200"
  //           }`}
  //         >
  //           <header className="p-6 pb-4">
  //             <div className="flex items-center gap-3 mb-2">
  //               <Brain
  //                 className={`w-6 h-6 ${
  //                   isDarkMode ? "text-yellow-400" : "text-yellow-600"
  //                 }`}
  //               />
  //               <h2
  //                 className={`text-xl font-bold ${
  //                   isDarkMode ? "text-white" : "text-black"
  //                 }`}
  //               >
  //                 Create Your Quiz
  //               </h2>
  //             </div>
  //             <p
  //               className={`text-sm ${
  //                 isDarkMode ? "text-gray-400" : "text-gray-600"
  //               }`}
  //             >
  //               Fill in the details below and let AI generate your quiz
  //             </p>
  //           </header>
  //           <div className="px-6 pb-6">
  //             <form action="" className="space-y-4">
  //               <div className="m-2 flex flex-col">
  //                 <label
  //                   className={`block text-sm font-medium mb-2 ${
  //                     isDarkMode ? "text-white" : "text-black"
  //                   }`}
  //                 >
  //                   What's the Topic?
  //                 </label>
  //                 <Input
  //                   type="text"
  //                   placeholder="Enter the topic..."
  //                   onChange={(e) =>
  //                     setInputValues({ ...inputValues, topic: e.target.value })
  //                   }
  //                 />
  //               </div>
  //               <div className="m-2 flex flex-col">
  //                 <label
  //                   className={`block text-sm font-medium mb-2 ${
  //                     isDarkMode ? "text-white" : "text-black"
  //                   }`}
  //                 >
  //                   Number of Questions
  //                 </label>
  //                 <Input
  //                   type="number"
  //                   placeholder="Enter the no. of questions..."
  //                   onChange={(e) =>
  //                     setInputValues({
  //                       ...inputValues,
  //                       questions: Number(e.target.value),
  //                     })
  //                   }
  //                 />
  //               </div>
  //               <div className="m-2 flex flex-col">
  //                 <label
  //                   className={`block text-sm font-medium mb-2 ${
  //                     isDarkMode ? "text-white" : "text-black"
  //                   }`}
  //                 >
  //                   Number of Choices
  //                 </label>
  //                 <Select
  //                   onValueChange={(e) =>
  //                     setInputValues({ ...inputValues, choices: e })
  //                   }
  //                 >
  //                   <SelectTrigger>
  //                     <SelectValue placeholder="No. of choices" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="Two">Two</SelectItem>
  //                     <SelectItem value="Three">Three</SelectItem>
  //                     <SelectItem value="Four">Four</SelectItem>
  //                     <SelectItem value="True/False">True / False</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //               <div className="m-2 flex flex-col">
  //                 <label
  //                   className={`block text-sm font-medium mb-2 ${
  //                     isDarkMode ? "text-white" : "text-black"
  //                   }`}
  //                 >
  //                   Difficulty Level
  //                 </label>
  //                 <Select
  //                   onValueChange={(e) =>
  //                     setInputValues({ ...inputValues, difficulty: e })
  //                   }
  //                 >
  //                   <SelectTrigger>
  //                     <SelectValue placeholder="Select Difficulty" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="Easy">Easy</SelectItem>
  //                     <SelectItem value="Medium">Medium</SelectItem>
  //                     <SelectItem value="Hard">Hard</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //             </form>
  //           </div>
  //           <div className="py-4">
  //             <ButtonQuiz type="button" onClick={submitForm} className="w-full">
  //               <Brain className="w-4 h-4" />
  //               Generate Quiz
  //             </ButtonQuiz>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md sm:max-w-lg space-y-6">
          {/* Welcome Message */}
          <div className="text-center">
            <h1 className={`text-2xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Welcome, {user?.email} 👋
            </h1>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Let's create an amazing quiz together
            </p>
          </div>

          {/* Quiz Form Card */}
          <div className={`rounded-xl shadow-lg border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-200'
          }`}>
            {/* Card Header */}
            <div className="p-4 sm:p-6 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Brain className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  Create Your Quiz
                </h2>
              </div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Fill in the details below and let AI generate your quiz
              </p>
            </div>

            {/* Form */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <form className="space-y-4">
                {/* Topic */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    What's the Topic?
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter the topic..."
                    isDarkMode={isDarkMode}
                    onChange={(e) =>
                      setInputValues({ ...inputValues, topic: e.target.value })
                    }
                  />
                </div>

                {/* Number of Questions */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    Number of Questions
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter the number of questions..."
                    isDarkMode={isDarkMode}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        questions: Number(e.target.value),
                      })
                    }
                  />
                </div>

                {/* Number of Choices */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    Number of Choices
                  </label>
                  <Select
                    placeholder="Select number of choices"
                    isDarkMode={isDarkMode}
                    options={[
                      { value: "Two", label: "Two" },
                      { value: "Three", label: "Three" },
                      { value: "Four", label: "Four" },
                      { value: "True/False", label: "True / False" }
                    ]}
                    onValueChange={(value) =>
                      setInputValues({ ...inputValues, choices: value })
                    }
                  />
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    Difficulty Level
                  </label>
                  <Select
                    placeholder="Select difficulty level"
                    isDarkMode={isDarkMode}
                    options={[
                      { value: "Easy", label: "Easy" },
                      { value: "Medium", label: "Medium" },
                      { value: "Hard", label: "Hard" }
                    ]}
                    onValueChange={(value) =>
                      setInputValues({ ...inputValues, difficulty: value })
                    }
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    onClick={submitForm}
                    className="w-full"
                  >
                    <Brain className="w-4 h-4" />
                    Generate Quiz
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizForm;
