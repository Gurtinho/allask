import { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, firebase } from '../services/Firebase';

type User = {
  id: string;
  name: string | null;
  avatar: string | null;
};

type AuthContextType = {
  user: User | undefined;
  singinWithGoogle: () => Promise<void>;
};

export const authContext = createContext({} as AuthContextType);

type BananaProps = {
  children: ReactNode;
};

function AuthContextProvider(props: BananaProps) {

    const [user, setUser] = useState<User>();

  // monitorar se existia um login
  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { uid, displayName, photoURL } = user;

        if (!displayName && !photoURL) {
          throw new Error('Missing information from google account.');
        };

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      };
      return () => {
        unSubscribe();
      };
    });
  }, []);
  
  async function singinWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const results = await auth.signInWithPopup(provider);

    if (results.user) {
      const { uid, displayName, photoURL } = results.user;

      if (!displayName && !photoURL) {
        throw new Error('Missing information from google account.');
      };

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      });
    };
  };

  return (
    <authContext.Provider value={{ user, singinWithGoogle }}>
      { props.children }
    </authContext.Provider>
  );
};

export { AuthContextProvider };