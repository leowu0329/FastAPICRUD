import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CaseRand20 from './caseRand20';

const MyNavbar = ({ onAddCase, onAddRandom, randomLoading }) => {
  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/case-list" style={{ fontWeight: 'bold' }}>
          檢驗總表
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Button variant="primary" className="me-2" onClick={onAddCase}>
              新增案件
            </Button>
            <CaseRand20 onAddRandom={onAddRandom} loading={randomLoading} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
