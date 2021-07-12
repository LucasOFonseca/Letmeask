import { FileCopyOutlined } from "@material-ui/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);

    if (!toast.isActive("copy-code")) {
      toast.success("Código copiado!", {
        toastId: "copy-code",
        autoClose: 3000,
      });
    }
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <FileCopyOutlined style={{ color: "#fff" }} />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
}
