import { Box, Button, IconButton, Tooltip } from "@material-ui/core";
import {
  CheckCircleOutlineRounded,
  DeleteOutline,
  QuestionAnswerOutlined,
} from "@material-ui/icons";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";
import { ConfirmationDialog } from "../../components/ConfirmationDialog/ConfirmationDialog";
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

  const [showEndRoomConfirmationDialog, setShowEndRoomConfirmationDialog] =
    useState(false);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState(false);
  const [questionToDelete, setQuestionToDelete] = useState("");

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
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
    <>
      <ConfirmationDialog
        open={showEndRoomConfirmationDialog}
        onYesClick={handleEndRoom}
        onNoClick={setShowEndRoomConfirmationDialog}
        title="Deseja encerrar a sala?"
        bodyText="Após conformar essa ação esta sala deixará de existir"
      />

      <ConfirmationDialog
        open={showDeleteConfirmationDialog}
        onYesClick={() => handleDeleteQuestion(questionToDelete)}
        onNoClick={setShowDeleteConfirmationDialog}
        title="Tem certeza que deseja excluír essa pergunta?"
        bodyText="Essa ação não pode ser desfeita"
      />

      <div id="page-room">
        <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask" />

            <div>
              <RoomCode code={roomId} />
              <Button
                variant="outlined"
                onClick={() => setShowEndRoomConfirmationDialog(true)}
                style={{
                  textTransform: "none",
                  color: "#835afd",
                  background: "#fff",
                  borderColor: "#835afd",
                  borderRadius: "0.5rem",
                }}
              >
                Encerrar sala
              </Button>
            </div>
          </div>
        </header>

        <main>
          <div className="main-container">
            <div className="room-title">
              <h1>Sala {title}</h1>

              {questions.length > 0 && (
                <span>
                  {questions.length}{" "}
                  {questions.length === 1 ? "pergunta" : "perguntas"}
                </span>
              )}
            </div>

            {questions.length > 0 ? (
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
                              onClick={() =>
                                handleHighlightQuestion(question.id)
                              }
                            >
                              <QuestionAnswerOutlined />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Excluir pergunta">
                        <IconButton
                          type="button"
                          onClick={() => {
                            setShowDeleteConfirmationDialog(true);
                            setQuestionToDelete(question.id);
                          }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Tooltip>
                    </Question>
                  );
                })}
              </div>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                style={{
                  opacity: "0.5",
                  gap: "1rem",
                  marginTop: "4rem",
                  textAlign: "center",
                }}
              >
                <h2>As perguntas enviadas aparecerão aqui!</h2>
                <p style={{ fontWeight: 500 }}>
                  Compartilhe o código da sala para começar a receber perguntas
                  dos seus espectadores.
                </p>
              </Box>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
