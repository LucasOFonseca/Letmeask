import { IconButton, Tooltip } from "@material-ui/core";
import {
  CheckCircleOutlineRounded,
  DeleteOutline,
  QuestionAnswerOutlined,
} from "@material-ui/icons";
import { useHistory, useParams } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";
import { CustomButton } from "../../components/CustomButton";
import { Question } from "../../components/Question";
import { RoomCode } from "../../components/RoomCode";
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que deseja excluír essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />

          <div>
            <RoomCode code={roomId} />
            <CustomButton isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </CustomButton>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>

          {questions.length > 0 && (
            <span>
              {questions.length}{" "}
              {questions.length === 1 ? "pergunta" : "perguntas"}
            </span>
          )}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <Tooltip title="Marcar como respondida">
                      <IconButton
                        type="button"
                        onClick={() =>
                          handleCheckQuestionAsAnswered(question.id)
                        }
                      >
                        <CheckCircleOutlineRounded />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='marcar como "respondendo"'>
                      <IconButton
                        onClick={() => handleHighlightQuestion(question.id)}
                      >
                        <QuestionAnswerOutlined />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <Tooltip title="Excluir pergunta">
                  <IconButton
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
