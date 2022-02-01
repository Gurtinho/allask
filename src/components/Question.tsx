import '../styles/questions.scss';

type BananaProps = {
  content: string;
  user: {
    name: string;
    avatar: string;
  }
};

function Question({ content, user }: BananaProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={user.avatar} alt={user.name} />
          <span>{user.name}</span>
        </div>
        <div></div>
      </footer>
    </div>
  );
};

export { Question };