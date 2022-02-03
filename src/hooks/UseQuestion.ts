import { useEffect, useState } from "react";
import { database } from "../services/Firebase";
import { UseAuth } from "./UseAuth";

// objeto, chave string e valor objeto
type BananaQuestions = Record<string, {
  user: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likes: Record<string, {
    userId: string;
  }>;
}>

type BananaQuest = {
  id: string;
  user: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

function UseQuestion(roomId: string) {
  const { user } = UseAuth();
  const [questions, setQuestions] = useState<BananaQuest[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: BananaQuestions = databaseRoom.questions;
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          user: value.user,
          isAnswered: value.isAnswered,
          isHighLighted: value.isHighLighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.userId == user?.id)?.[0]
        };
      });
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
    return () => {
      roomRef.off('value');
    };
  }, [roomId, user?.id]);
  return { questions, title };
};

export { UseQuestion };