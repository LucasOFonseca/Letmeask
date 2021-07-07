import { FileCopyOutlined } from "@material-ui/icons";
import "./styles.scss";

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <FileCopyOutlined />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
}
