import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QuizLoader from "../QuizLoader";
import { useAuth } from "@/contexts/AuthContext";
import AuthSupa from "./AuthSupa";

const QuizForm = () => {
  const [inputValues, setInputValues] = useState({
    topic: "",
    questions: 0,
    choices: "",
    difficulty: "",
  });

  const { user, session } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const nav = useNavigate();

  if (!user) return <div className="flex justify-center items-center bg-black text-white text-2xl">Loading ...</div>;

  const submitForm = async () => {
    console.log(inputValues);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/quiz", {
        ...inputValues,
        ownerId: user.id,
      }, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
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

  return (
    <div className="bg-black text-white flex flex-col space-y-6 items-center justify-center h-screen">
      <h1 className="text-2xl">Welcome, {user.email} 👋 </h1>
      <Card className="w-[50vh] p-6 ">
        <CardHeader>
          <CardTitle className="text-xl">Create your quiz</CardTitle>
        </CardHeader>
        <CardDescription>
          <form action="" className="flex flex-col w-full h-full">
            <div className="m-2 flex flex-col">
              <label htmlFor="topic" className="my-2">
                What's the Topic
              </label>
              <Input
                type="text"
                placeholder="Enter the topic..."
                onChange={(e) =>
                  setInputValues({ ...inputValues, topic: e.target.value })
                }
              />
            </div>
            <div className="m-2 flex flex-col">
              <label htmlFor="questions" className="my-2">
                No. of Questions
              </label>
              <Input
                type="number"
                placeholder="Enter the no. of questions..."
                onChange={(e) =>
                  setInputValues({
                    ...inputValues,
                    questions: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="m-2 flex flex-col">
              <label htmlFor="choices" className="my-2">
                No. of choices
              </label>
              <Select
                onValueChange={(e) =>
                  setInputValues({ ...inputValues, choices: e })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No. of choices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Two">Two</SelectItem>
                  <SelectItem value="Three">Three</SelectItem>
                  <SelectItem value="Four">Four</SelectItem>
                  <SelectItem value="True/False">True / False</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="m-2 flex flex-col">
              <label htmlFor="difficulty" className="my-2">
                Difficulty Level
              </label>
              <Select
                onValueChange={(e) =>
                  setInputValues({ ...inputValues, difficulty: e })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardDescription>
        <CardFooter className="flex items-center justify-center mb-2">
          <Button type="button" className=" px-7 py-4 cursor-pointer" onClick={submitForm}>
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default QuizForm;
