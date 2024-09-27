import 'bootstrap/dist/css/bootstrap.min.css';
import Authentication from './components/Authentication';
import { useEffect, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Rides from './components/Rides';
import { Link, Route, Routes } from 'react-router-dom';
import MyRides from './components/MyRides';
import CreateCar from './components/CreateCar';

function App() {
  const [user, setUser] = useState(null);

  const handleOnUserLogin = data => {
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  }

  const handleOnUserLogout = data => {
    setUser(null)
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location = "/";

  }

  const handleOnCarCreated = car => {
    const newUser = { ...user, car };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user')))
    }
  }, [])


  return (
    <div>
      <Container className='p-3 mb-5'>
        <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
          <Container>
            <Navbar.Brand href="#home">Covoiturage App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Link className="link-primary link-underline-opacity-0 mx-3" to="/">Offres</Link>
                {user !== null && user.is_driver && <Link className="link-primary link-underline-opacity-0" to="/my-rides">Mes Offres</Link>}
              </Nav>
            </Navbar.Collapse>
          </Container>
          <Authentication user={user} onUserLogin={handleOnUserLogin} onUserLogout={handleOnUserLogout} />
        </Navbar>

        <Container className='m-5'>
          <Routes>
            <Route path='/' element={<Rides user={user} />} />
            <Route path='/my-rides' element={<MyRides />} />
          </Routes>
        </Container>
        {user !== null && user.is_driver && !Object.hasOwn(user, "car") && <CreateCar user={user} onCarCreated={handleOnCarCreated} />}
      </Container>
    </div>
  );
}

export default App;
