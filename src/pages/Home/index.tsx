import { Button, TextField, useMediaQuery } from "@material-ui/core";
import { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import googleIconImg from "../../assets/images/google-icon.svg";
import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";
import "../../styles/auth.scss";

export function Home() {
  const history = useHistory();

  const desktop = useMediaQuery("(min-width: 950px)");

  const { user, signInWithGoogle } = useAuth();

  const [roomCode, setRoomCode] = useState("");
  const [validate, setValidate] = useState({
    error: false,
    helperText: "",
  });

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      setValidate({
        error: true,
        helperText: "Insira um código",
      });

      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error("Sala não encontrada!");

      return;
    }

    if (roomRef.val().endedAt) {
      toast.error("Sala fechada.");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  useEffect(() => {
    if (validate.error === true && roomCode !== "") {
      setValidate({ error: false, helperText: "" });
    }
  }, [roomCode, validate.error]);

  if (desktop) {
    return (
      <div id="page-auth">
        <aside>
          <div>
            <img
              src={illustrationImg}
              alt="Ilustração simbolizando perguntas e respostas"
            />
            <strong>
              Crie salas de Q&amp;A
              <wbr /> ao-vivo
            </strong>
            <p>
              Tire as dúvidas da sua audiência em
              <wbr /> tempo-real
            </p>
          </div>
        </aside>

        <main>
          <div className="main-content">
            <img src={logoImg} alt="Letmeask" />
            <Button
              variant="contained"
              style={{
                marginTop: "4rem",
                height: "3.125rem",
                borderRadius: "0.5rem",
                background: "#ea4335",
                fontWeight: 500,
                color: "#fff",
                textTransform: "none",
              }}
              onClick={handleCreateRoom}
            >
              <img
                src={googleIconImg}
                alt="Logo do Google"
                style={{ marginRight: "0.5rem" }}
              />
              Crie sua sala com o Google
            </Button>

            <div className="separator">ou entre em uma sala</div>
            <form onSubmit={handleJoinRoom}>
              <TextField
                fullWidth
                variant="outlined"
                label="Digite o código da sala"
                onChange={(event) => setRoomCode(event.target.value)}
                value={roomCode}
                style={{
                  borderRadius: "0.5rem",
                }}
                error={validate.error}
                helperText={validate.helperText}
              />
              <Button
                variant="contained"
                type="submit"
                style={{
                  color: "#fff",
                  background: "#835afd",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 2rem",
                }}
              >
                Entrar na sala
              </Button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div id="page-auth">
      <main>
        <div className="text-container">
          <img src={logoImg} alt="Letmeask" />
          <strong>
            Crie salas de Q&amp;A
            <wbr /> ao-vivo
          </strong>
          <p>
            Tire as dúvidas da sua audiência em
            <wbr /> tempo-real
          </p>
        </div>

        <div className="main-content">
          <Button
            variant="contained"
            style={{
              marginTop: "4rem",
              height: "3.125rem",
              borderRadius: "0.5rem",
              background: "#ea4335",
              fontWeight: 500,
              color: "#fff",
              textTransform: "none",
            }}
            onClick={handleCreateRoom}
          >
            <img
              src={googleIconImg}
              alt="Logo do Google"
              style={{ marginRight: "0.5rem" }}
            />
            Crie sua sala com o Google
          </Button>

          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <TextField
              fullWidth
              variant="outlined"
              label="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
              style={{
                borderRadius: "0.5rem",
              }}
              error={validate.error}
              helperText={validate.helperText}
            />
            <Button
              variant="contained"
              type="submit"
              style={{
                color: "#fff",
                background: "#835afd",
                borderRadius: "0.5rem",
                padding: "0.75rem 2rem",
              }}
            >
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
