import React from 'react';
import { Navbar, Nav } from 'react-bootstrap'

function NavBar(props) {
    return (
        <div className='bg-light shadow'>
            <div className='container'>
                <Navbar expand="lg">
                    <Navbar.Brand href="#home" className="font-weight-bold">LOGO</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="#home">HOME</Nav.Link>
                            <Nav.Link href="#link">ABOUTUS</Nav.Link>
                            <Nav.Link href="#home">HELP</Nav.Link>
                            <Nav.Link href="#link">FAQ</Nav.Link>
                            <Nav.Link href="#link">TOS</Nav.Link>
                            <Nav.Link href="#link" className='btn btn-primary font-weight-bold text-white'>Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </div>
    );
}

export default NavBar;