import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';

const CreateCar = ({ user, onCarCreated }) => {
	const [modele, setModele] = useState("");

	const handleOnCreateCar = async (e) => {
		try {
			e.preventDefault();

			const { data } = await axios.post('http://localhost:5000/api/cars', {
				model: modele
			}, {
				headers: {
					Authorization: localStorage.getItem('token')
				}
			});
			onCarCreated(data)
		} catch (error) {

		}
	}

	return (
		<div
			className="modal show"
			style={{ display: 'block', position: 'initial' }}
		>
			<Modal show={true}>
				<Modal.Body>
					<Form onSubmit={handleOnCreateCar}>
						<Form.Group className="mb-3" controlId="model">
							<Form.Label>Modéle</Form.Label>
							<Form.Control value={modele} onChange={e => setModele(e.target.value)} required type="text" placeholder="Modéle" />
						</Form.Group>
						<Button variant="primary" type="submit">
							Enregistrer
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}

export default CreateCar;