import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

import { database } from "../services/Firebase";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import { UseAuth } from "../hooks/UseAuth";
import { UseFormat } from "../hooks/UseFormat";
import { UseQuestion } from "../hooks/UseQuestion";

import './styles/room.scss';

type BananaParams = {
  id: string;
};

const notify = (message: string) => toast.error(message);


function Room() {
  const { user } = UseAuth();
  const [newQuestion, setNewQuestion] = useState('');
  const params = useParams<BananaParams>();
  const roomId = params.id!;
  const { title, questions } = UseQuestion(roomId);

  async function handleSendNewQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() == '') {
      return notify('Você não fez sua pergunta');
    };
    if (!user) {
      return notify('Faça login primeiro');
    };

    const quest = UseFormat(newQuestion);

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

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {

    if (!user) {
      return notify('Faça login primeiro');
    };

    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();

    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        userId: user?.id
      });
    };
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
          {questions.length == 1 && <span>{questions.length} pergunta</span>}
          {questions.length > 1 && <span>{questions.length} perguntas</span>}
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
          {questions.slice(0).reverse().map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                user={question.user}>
                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    type="button"
                  area-aria-label="marcar como gostei"
                  onClick={() => handleLikeQuestion(question.id, question.likeId)}>
                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#737380">
                      <path d="M0 0h24v24H0V0z" fill="none"/>
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
              </Question>
            )
          }) }
        </div>
      </main>
    </div>
  );
};

export { Room };