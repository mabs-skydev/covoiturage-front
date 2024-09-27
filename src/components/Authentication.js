import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Dropdown, Form, Modal } from 'react-bootstrap';

const Authentication = ({ user, onUserLogin, onUserLogout }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [isDriver, setIsDriver] = useState(false);

	const [show, setShow] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [showLogin, setShowLogin] = useState(true);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleLogin = async (e) => {
		try {
			e.preventDefault();

			const { data } = await axios.post('http://localhost:5000/auth/login', {
				email,
				password
			});
			onUserLogin(data);
			handleClose();
		} catch (error) {
			setErrorMsg(error.response.data.error);
		}
	}

	const handleSignup = async (e) => {
		try {
			e.preventDefault();
			const { data } = await axios.post('http://localhost:5000/auth/register', {
				firstname,
				lastname,
				email,
				password,
				is_driver: isDriver
			});
			setSuccessMsg("Utilisateur enregistré avec succès ! Veuillez vous connecter");
			setShowLogin(true);
		} catch (error) {
			setErrorMsg(error.response.data.error);
		}
	}

	return (
		<div style={{ minWidth: 120 }}>
			{
				user === null ?
					<Button variant="primary" className='auto' onClick={handleShow}>
						se connecter
					</Button> :
					<Dropdown className="d-inline">
						<Dropdown.Toggle id="dropdown-autoclose-true">
							{user.lastname} {user.firstname}
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item href="#" onClick={onUserLogout}>Se déconnecter</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
			}

			<Modal show={show} onHide={handleClose}>
				<Modal.Body>
					{
						showLogin ?
							<>
								<Form className="mb-3" onSubmit={handleLogin}>
									<Form.Group className="mb-3" controlId="formBasicEmail">
										<Form.Label>Email</Form.Label>
										<Form.Control required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
									</Form.Group>

									<Form.Group className="mb-3" controlId="formBasicPassword">
										<Form.Label>Password</Form.Label>
										<Form.Control required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
									</Form.Group>
									<Button variant="primary" type="submit">
										Se connecter
									</Button>
								</Form>
								<span className='mb-3' onClick={e => setShowLogin(false)}>Vous êtes nouveau ? créez un compte ici</span>
							</>
							:
							<>
								<Form className="mb-3" onSubmit={handleSignup}>
									<Form.Group className="mb-3" controlId="formBasicEmail">
										<Form.Label>Nom</Form.Label>
										<Form.Control required type="text" placeholder="Nom" value={firstname} onChange={e => setFirstname(e.target.value)} />
									</Form.Group>
									<Form.Group className="mb-3" controlId="formBasicEmail">
										<Form.Label>Prénom</Form.Label>
										<Form.Control required type="text" placeholder="Prénom" value={lastname} onChange={e => setLastname(e.target.value)} />
									</Form.Group>
									<Form.Group className="mb-3" controlId="formBasicEmail">
										<Form.Label>Email</Form.Label>
										<Form.Control required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
									</Form.Group>

									<Form.Group className="mb-3" controlId="formBasicPassword">
										<Form.Label>Password</Form.Label>
										<Form.Control required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
									</Form.Group>
									<Form.Group className="mb-3" controlId="formBasicCheckbox">
										<Form.Check // prettier-ignore
											type="switch"
											id="custom-switch"
											label="Je suis un chauffeur"
											checked={isDriver} onChange={e => setIsDriver(!isDriver)}
										/>
									</Form.Group>
									<Button variant="primary" type="submit">
										Se connecter
									</Button>
								</Form>
								<span className='mb-3' onClick={e => setShowLogin(true)}>Vous avez déjà un compte cliquez ici</span>
							</>

					}

					{errorMsg && <Alert variant="danger" className='my-3'>
						{errorMsg}
					</Alert>}
					{successMsg && <Alert variant="success" className='my-3'>
						{successMsg}
					</Alert>}
				</Modal.Body>
			</Modal>

		</div>
	)
}

export default Authentication