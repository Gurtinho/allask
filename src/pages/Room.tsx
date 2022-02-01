import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

import { database } from "../services/Firebase";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { UseAuth } from "../hooks/UseAuth";
import { FormatText } from "../hooks/FormatText";

import '../styles/room.scss';

type BananaParams = {
  id: string;
};

const notify = (message: string) => toast.error(message);

function Room() {
  const { user } = UseAuth();
  const params = useParams<BananaParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const roomId = params.id!; // ! = confia no pai que existe
  
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
          <h1>Nome da sala</h1>
          <span>4 perguntas</span>
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
      </main>
    </div>
  );
};

export { Room };