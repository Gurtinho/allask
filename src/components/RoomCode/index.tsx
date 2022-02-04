import copyImg from '../../assets/images/copy.svg';
import './roomCode.scss';

type BananaProps = {
  code: string;
};

function RoomCode(props: BananaProps) {
  async function copyRoomCodeToClipboard() {
    await navigator.clipboard.writeText(props.code);
  };

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="copiar" />
      </div>
      <span>{props.code}</span>
    </button>
  );
};

export { RoomCode };