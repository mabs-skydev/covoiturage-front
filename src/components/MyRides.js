import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Badge, Button, Form, Modal, Nav, Table } from 'react-bootstrap';

const MyRides = () => {
	const [rides, setRides] = useState([]);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [pickupTime, setPickupTime] = useState(8);
	const [capacity, setCapacity] = useState(4);
	const [price, setPrice] = useState(5);

	const getMyRides = async () => {
		const { data } = await axios.get('http://localhost:5000/api/rides/me', { headers: { Authorization: localStorage.getItem('token') } });
		setRides(data);
	}

	useEffect(() => {
		getMyRides()
	}, []);

	const handleManageRideRequest = async (rideId, userId, status) => {
		try {
			const { data } = await axios.put(`http://localhost:5000/api/rides/${rideId}/status`,
				{
					userId,
					status
				},
				{ headers: { Authorization: localStorage.getItem('token') } }
			)

			const updateRide = rides.map(ride => ride._id === data._id ? data : ride);

			setRides(updateRide)
		} catch (error) {
			console.log(error)
		}
	}

	const handleSaveRide = async (e) => {
		try {
			e.preventDefault();

			const { data } = await axios.post('http://localhost:5000/api/rides', {
				from,
				to,
				pickup_time: pickupTime,
				capacity
			},
				{
					headers: { Authorization: localStorage.getItem('token') }
				});

			setRides(prev => [...rides, data]);
			setShow(false)
		} catch (error) {
			console.log(error)
		}

	}

	return (
		<div>
			<Nav className='my-2'>
				<Button variant="success" className="ms-auto" onClick={handleShow}>Créer une voyage</Button>
			</Nav>
			{
				rides.map(ride => <div className='my-5' key={ride._id}>
					<h4>{ride.from} - {ride.to} à {ride.pickup_time}:00</h4>
					<Table striped>
						<thead>
							<tr>
								<th>Nom passager</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{ride.users.map(u => <tr>
								<td>{u.user.firstname} {u.user.lastname}</td>
								<td>{u.status === "pending" ? <>
									<Button onClick={e => handleManageRideRequest(ride._id, u._id, 'accepted')} variant='success' className='mx-3'>Accepter</Button>
									<Button onClick={e => handleManageRideRequest(ride._id, u._id, 'rejected')} variant='danger'>Refuser</Button>
								</> :
									u.status === "accepted" ? < Badge bg="success">Accepter</Badge> : <Badge bg="danger">Refuser</Badge>}
								</td>
							</tr>
							)}
						</tbody>
					</Table>
				</div>)
			}

			<Modal show={show} onHide={handleClose}>
				<Modal.Body>
					<Form onSubmit={handleSaveRide}>
						<Form.Group className="mb-3" controlId="depart" required>
							<Form.Label>Départ</Form.Label>
							<Form.Control value={from} onChange={e => setFrom(e.target.value)} type="text" placeholder="Départ" />
						</Form.Group>
						<Form.Group className="mb-3" controlId="destination" required>
							<Form.Label>Destination</Form.Label>
							<Form.Control value={to} onChange={e => setTo(e.target.value)} type="text" placeholder="Destination" />
						</Form.Group>
						<Form.Group className="mb-3" controlId="heure" required>
							<Form.Label>Heure de départ</Form.Label>
							<Form.Control value={pickupTime} onChange={e => setPickupTime(e.target.value)} type="number" min={0} max={24} placeholder="Heure de départ" />
						</Form.Group>
						<Form.Group className="mb-3" controlId="capacity" required>
							<Form.Label>Nombre de places</Form.Label>
							<Form.Control value={capacity} onChange={e => setCapacity(e.target.value)} type="number" min={0} max={20} placeholder="Nombre de places" />
						</Form.Group>
						<Form.Group className="mb-3" controlId="capacity" required>
							<Form.Label>Prix</Form.Label>
							<Form.Control value={price} onChange={e => setPrice(e.target.value)} type="number" min={0} placeholder="Prix" />
						</Form.Group>
						<Button variant="primary" type="submit">
							Enregistrer
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</div >
	)
}

export default MyRides;