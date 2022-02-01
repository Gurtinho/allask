import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

import { database } from "../services/Firebase";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { UseAuth } from "../hooks/UseAuth";
import { FormatText } from "../hooks/FormatText";

import '../styles/room.scss';

// objeto, chave string e valor objeto
type BananaQuestions = Record<string, {
  user: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
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
};

type BananaParams = {
  id: string;
};

const notify = (message: string) => toast.error(message);


function Room() {
  const { user } = UseAuth();
  const params = useParams<BananaParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<BananaQuest[]>([]);
  const [title, setTitle] = useState('');

  const roomId = params.id!;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: BananaQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          user: value.user,
          isAnswered: value.isAnswered,
          isHighLighted: value.isHighLighted
        };
      });
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
   }, [roomId]);
  
  async function handleSendNewQuestion(event: FormEvent) {
    event.preventDefault();
    if (newQuestion.trim() == '') return notify('Você não fez sua pergunta');
    if (!user) return notify('Faça login primeiro');

    const quest = FormatText(newQuestion);
    
    const question = {
      content: quest,
      user: {
        name: user.name,
        avatar: user.avatar
      },
      isHighLighted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);
  };
  
  return (
    <div id="page-room">
      <header>
        <div id="content">
          <h1>All Ask</h1>
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="title-room">
          <h1>Sala { title }</h1>
          { questions.length > 0 && <span>{questions.length} pergunta</span> }
        </div>

        <form onSubmit={handleSendNewQuestion}>
          <Toaster position="top-center" />
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div>
                <img src={user.avatar!} alt={user.name!} />
                <span>{user.name}</span>
              </div>
            ): (
                <span>Para enviar uma pergunta,
                  <Link className="link" to='/'>faça seu login</Link>
                </span>
            ) }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
        <div className="list">
          {questions.map(question => {
            return (
              <Question
                content={question.content}
                user={question.user}/>
            )
          }) }
        </div>
      </main>
    </div>
  );
};

export { Room };