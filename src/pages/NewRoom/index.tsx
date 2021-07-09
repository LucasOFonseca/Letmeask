import { Button, TextField } from "@material-ui/core";
import { FormEvent, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";
import "../../styles/auth.scss";

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();

  const [newRoom, setNewRoom] = useState("");
  const [validate, setValidate] = useState({
    error: false,
    helperText: "",
  });

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      setValidate({
        error: true,
        helperText: "Insira um nome para sua sala",
      });

      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }

  useEffect(() => {
    if (validate.error === true && newRoom !== "") {
      setValidate({ error: false, helperText: "" });
    }
  }, [newRoom, validate.error]);

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />

          <h2>Criar uma nova sala</h2>

          <form onSubmit={handleCreateRoom}>
            <TextField
              fullWidth
              variant="outlined"
              label="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
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
              Criar sala
            </Button>
          </form>
          <p className="link-to-home">
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
