import React from 'react'
import { NavLink } from 'react-router-dom'
import{ Container,Nav,Navbar} from 'react-bootstrap'

export const NavigateApp = () => {
  return (
    <div>
     <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="/reservas">Reservas</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <br />
      

    </div>
  )
}

