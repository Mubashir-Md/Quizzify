import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface Quiz {
  _id: string;
  topic: string;
  roomId: string;
  questions: {
    question: string;
    choices: string[];
    answer: string;
  }[];
}

const ProfilePage = () => {
  const { user, session } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const nav = useNavigate();
  const [quizId, setQuizId] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');

  useEffect(() => {
    if (!session) {
      nav("/auth");
      return;
    }
  }, [session, nav]);

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/myQuizzes`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });
        setQuizzes(res.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    if (session) fetchUserQuizzes();
  }, [session]);

  if (!user)
    return (
      <div className="text-white h-screen flex items-center bg-black justify-center text-center mt-20">
        Loading...
      </div>
    );

  return (
    <>
      <div className="bg-black min-h-screen px-6 py-10 text-white ">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Quizzes</h1>

          <Table className="bg-white text-black rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Room Id</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz._id}>
                  <TableCell>{quiz.topic}</TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell>{quiz.roomId}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() => {setShowDialog(true); setQuizId(quiz._id); setRoomId(quiz.roomId)}}
                      className="cursor-pointer"
                    >
                      Launch
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog} >
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>You are going to launch quiz and people can start joining in.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant={'outline'} onClick={()=>setShowDialog(false)} className="cursor-pointer">No</Button>
                <Button variant={'default'} className="cursor-pointer" onClick={()=>nav(`/admin/launch/${quizId}/${roomId}`)}>Yes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProfilePage;
