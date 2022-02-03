import { ReactNode } from 'react';
import './questions.scss';

type BananaProps = {
  content: string;
  user: {
    name: string;
    avatar: string;
  }
  children?: ReactNode;
};

function Question({ content, user, children }: BananaProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={user.avatar} alt={user.name} />
          <span>{user.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
};

export { Question };