import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setExpanded(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <BootstrapNavbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      fixed="top"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
          📊 DataAnalytics
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              onClick={() => setExpanded(false)}
            >
              Inicio
            </Nav.Link>
            
            {user && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  className={isActive('/dashboard') ? 'active' : ''}
                  onClick={() => setExpanded(false)}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/data-entry" 
                  className={isActive('/data-entry') ? 'active' : ''}
                  onClick={() => setExpanded(false)}
                >
                  Ingresar Datos
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/analytics" 
                  className={isActive('/analytics') ? 'active' : ''}
                  onClick={() => setExpanded(false)}
                >
                  Análisis
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <NavDropdown 
                title={`👤 ${user.name}`} 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/dashboard">
                  Mi Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login"
                  className={isActive('/login') ? 'active' : ''}
                  onClick={() => setExpanded(false)}
                >
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/register"
                  className={isActive('/register') ? 'active' : ''}
                  onClick={() => setExpanded(false)}
                >
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;


