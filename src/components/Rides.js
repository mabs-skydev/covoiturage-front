import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';

const Rides = ({ user }) => {
	const [rides, setRides] = useState([]);

	useEffect(() => {
		getRidesList()
	}, [])


	const getRidesList = async () => {
		const { data } = await axios.get('http://localhost:5000/api/rides');
		setRides(data);
	}

	const handleBookRide = async (id) => {
		try {
			const { data } = await axios.put(`http://localhost:5000/api/rides/${id}/book`, {}, { headers: { "Authorization": localStorage.getItem('token') } });

			let newRides = rides.filter(ride => ride._id !== data._id);
			newRides.unshift(data);

			setRides(newRides);
		} catch (error) {
			console.log(error)
		}

	}

	const handleCancelRide = async (id) => {
		try {
			const { data } = await axios.put(`http://localhost:5000/api/rides/${id}/cancel`, {}, { headers: { "Authorization": localStorage.getItem('token') } });

			let newRides = rides.filter(ride => ride._id !== data._id);
			newRides.push(data);

			setRides(newRides);
		} catch (error) {
			console.log(error)
		}

	}

	const statusButton = (ride) => {
		const current = ride.users.find(u => u.user === user._id);

		if (current.status === "accepted") return <Button variant="success" disabled>Votre demande a été accepter</Button>;
		if (current.status === "rejected") return <Button variant="secondary" disabled>Votre demande a été réfuser</Button>;

		return <Button variant="danger" onClick={e => handleCancelRide(ride._id)}>Retirer votre réservation</Button>;
	}

	return (
		<Row>
			{rides.map(ride => <Col sm="10" md="4" lg="3" key={ride._id}>
				<Card className='m-3' style={{ width: '18rem' }}>
					<Card.Body>
						<Card.Title>{ride.from} - {ride.to}</Card.Title>
						<Card.Subtitle className="mb-2 text-muted">Date de départ: {ride.pickup_time}:00 <span className='ml-3'>{ride.users.filter(u => u.status === "accepted").length || 0}/{ride.capacity}</span></Card.Subtitle>
						<Card.Text>{ride.car.model}</Card.Text>
						<Card.Text>{ride.car.user.lastname} {ride.car.user.firstname}</Card.Text>
						{
							user !== null && <>
								{
									ride.users.some(u => u.user === user._id) ?
										statusButton(ride)
										:
										<Button variant="primary" onClick={e => handleBookRide(ride._id)}>Réserver une place</Button>
								}
							</>
						}
					</Card.Body>
				</Card>

			</Col>)
			}
		</Row >
	)
}

export default Rides