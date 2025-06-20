import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
            <Button
              variant="secondary"
              onClick={onAddRandom}
              disabled={randomLoading}
            >
              {randomLoading ? '產生中...' : '新增隨機20筆資料'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
