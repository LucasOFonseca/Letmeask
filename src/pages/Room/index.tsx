import { Box, Button, IconButton, TextField, Tooltip } from "@material-ui/core";
import { ThumbUpAltRounded } from "@material-ui/icons";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";
import { Question } from "../../components/Question";
import { RoomCode } from "../../components/RoomCode";
import { useAuth } from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";
import "../../styles/room.scss";

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  const [newQuestion, setNewQuestion] = useState("");
  const [validate, setValidate] = useState({
    error: false,
    helperText: "",
  });

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      setValidate({
        error: true,
        helperText: "Digite algo",
      });

      return;
    }

    if (newQuestion.length < 3) {
      setValidate({
        error: true,
        helperText: "Mínimo de 3 caracteres",
      });

      return;
    }

    if (newQuestion.length > 500) {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },

      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  }

  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  useEffect(() => {
    if (newQuestion.length > 500) {
      setValidate({
        error: true,
        helperText: "Máximo de 500",
      });
    }

    if (
      validate.error === true &&
      newQuestion !== "" &&
      validate.error === true &&
      newQuestion.length > 3 &&
      validate.error === true &&
      newQuestion.length < 500
    ) {
      setValidate({ error: false, helperText: "" });
    }
  }, [newQuestion, validate.error]);

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />

          <RoomCode code={roomId} />
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

        <form onSubmit={handleSendQuestion}>
          <TextField
            multiline
            fullWidth
            variant="outlined"
            rows={5}
            label="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
            error={validate.error}
            helperText={validate.helperText}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button
              variant="contained"
              type="submit"
              disabled={!user || newQuestion === ""}
              style={{
                color: "#fff",
                background: "#835afd",
                borderRadius: "0.5rem",
                padding: "0.75rem 2rem",
                opacity: !user || newQuestion === "" ? "0.75" : undefined,
              }}
            >
              Enviar pergunta
            </Button>
          </div>
        </form>

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
                    <div className="like-btn-div">
                      {question.likeCount > 0 && (
                        <span>{question.likeCount}</span>
                      )}

                      <Tooltip
                        title={!question.likeId ? "Like" : "Remover like"}
                      >
                        <IconButton
                          className={`like-button ${
                            question.likeId ? "liked" : ""
                          }`}
                          type="button"
                          aria-label="Marcar como gostei"
                          onClick={() =>
                            handleLikeQuestion(question.id, question.likeId)
                          }
                        >
                          <ThumbUpAltRounded />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </Question>
              );
            })}
          </div>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            style={{ opacity: "0.5", gap: "1rem", marginTop: "4rem" }}
          >
            <h2>Esta sala ainda não tem perguntas!</h2>
            <h3>Seja o primeiro a enviar uma :)</h3>
          </Box>
        )}
      </main>
    </div>
  );
}
