import { useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { UseAuth } from '../hooks/UseAuth';

import illustration from '../assets/images/illustration.svg';
import googleImg from '../assets/images/google-icon.svg';
import { Button } from '../components/Button';
import { database } from '../services/Firebase';
import toast, { Toaster } from 'react-hot-toast';

import '../styles/auth.scss';

const notify = (message: string) => toast.error(message);

function Home() {
	const location = useNavigate();
	const { user, singinWithGoogle } = UseAuth();
	const [ roomCode, setRoomCode ] = useState('');

	async function handleCreateRoom() {
		if (!user) await singinWithGoogle();
		location('/rooms/new');
	};

	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault();

		if (roomCode.trim() == '') return notify('Insira o código da sala');

		const roomRef = await database.ref(`rooms/${roomCode}`).get();

		if (!roomRef.exists()) return notify('Código inválido');

		location(`/rooms/${roomCode}`);
	};

	return (
		<div id="page-auth">
			<aside>
				<img src={illustration} alt="ilustração" />
				<strong>Crie salas ao vivo</strong>
				<p>Tire dúvidas em tempo real</p>
			</aside>
	
			<main>
				<div className='main-content'>
					<h1>All Ask</h1>

					<button onClick={handleCreateRoom} className='create-room'>
							<img src={googleImg} alt="Google" />
							Crie sua sala com o Google
					</button>

					<div className='separator'>Ou entre em uma sala</div>
					
					<form onSubmit={handleJoinRoom}><Toaster position='top-right'/>
						<input
							type="text"
							placeholder='Digite o código da sala'
							onChange={event => setRoomCode(event.target.value)}
							value={roomCode}
						/>
						<Button type="submit">Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	);
};

export { Home };