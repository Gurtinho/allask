import illustration from '../assets/images/illustration.svg';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

import '../styles/auth.scss';
import { UseAuth } from '../hooks/UseAuth';
import { database } from '../services/Firebase';

function NewRoom() {
	const { user } = UseAuth();
	const [newRoom, setNewRoom] = useState('');
	const location = useNavigate();

	async function handleCreateNewRoom(event: FormEvent) {
		event.preventDefault();

		if (newRoom.trim() === ' ') return;

		const roomRef = database.ref('rooms');
		const firebaseRooms = await roomRef.push({
			title: newRoom,
			userId: user?.id,
		});

		location(`/rooms/${firebaseRooms.key}`);
	};

	return (
		<div id="page-auth">
			<aside>
				<img src={illustration} alt="ilustração" />
				<strong>Crie salas ao vivo</strong>
				<p>Tire dúvidas em tempo rel</p>
			</aside>

			<main>
				<div className='main-content'>
					<h1>All Ask</h1>
					
          <h2>Criar uma nova sala</h2>
          
					<form onSubmit={handleCreateNewRoom}>
						<input
							type="text"
							placeholder='Nome da sala'
							onChange={event => setNewRoom(event.target.value)}
							value={newRoom}
						/>
						<Button type="submit">Criar sala</Button>
          </form>
          
          <p>
            Quer entrar em uma sala? <Link to="/">Clique aqui</Link>
          </p>
				</div>
			</main>
		</div>
	);
};

export { NewRoom };