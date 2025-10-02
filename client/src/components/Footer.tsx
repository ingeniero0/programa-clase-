import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>📊 DataAnalytics</h5>
            <p className="text-muted">
              Plataforma moderna para análisis de datos con visualizaciones interactivas.
            </p>
          </Col>
          <Col md={4}>
            <h6>Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Inicio</a></li>
              <li><a href="/dashboard" className="text-muted text-decoration-none">Dashboard</a></li>
              <li><a href="/analytics" className="text-muted text-decoration-none">Análisis</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6>Tecnologías</h6>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-primary">React</span>
              <span className="badge bg-info">TypeScript</span>
              <span className="badge bg-success">Node.js</span>
              <span className="badge bg-warning">Express</span>
            </div>
          </Col>
        </Row>
        <hr className="my-3" />
        <Row>
          <Col className="text-center text-muted">
            <p className="mb-0">
              © {currentYear} DataAnalytics Platform. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;


