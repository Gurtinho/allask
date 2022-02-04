import { useNavigate, useParams } from "react-router-dom";
import { database } from "../services/Firebase";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import { UseQuestion } from "../hooks/UseQuestion";

import deleteImg from '../assets/images/delete.svg';

import './styles/room.scss';

type BananaParams = {
  id: string;
};

function AdminRoom() {
  const params = useParams<BananaParams>();
  const roomId = params.id!;
  const { title, questions } = UseQuestion(roomId);
  const location = useNavigate();

  async function handleDeleteQuestion(questionId: string) {
    const confirm = window.confirm('Deseja deletar?');
    if (confirm) {
      return await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    };
  };
  
  async function handleCloseRoom() {
    const confirm = window.confirm('Deseja encerrar a sala?');
    if (confirm) {
      await database.ref(`rooms/${roomId}`).update({
        endAt: new Date(),
      });

      setTimeout(() => {
        database.ref(`rooms/${roomId}`).remove();
      }, 300000);

      location('/');
    };
  };

  return (
    <div id="page-room">
      <header>
        <div id="content">
          <h1>All Ask</h1>
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined
              onClick={() => handleCloseRoom()}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="title-room">
          <h1>Sala { title }</h1>
          {questions.length == 1 && <span>{questions.length} pergunta</span>}
          {questions.length > 1 && <span>{questions.length} perguntas</span>}
        </div>
        <div className="list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                user={question.user}>
                <button
                  className="remove-question"
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="deletar pergunta" />
                </button>
              </Question>
            )
          }) }
        </div>
      </main>
    </div>
  );
};

export { AdminRoom };