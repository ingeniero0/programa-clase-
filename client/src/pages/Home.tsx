import React from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Plataforma de Analítica de Datos
              </h1>
              <p className="lead mb-4">
                Transforma tus datos en insights accionables con nuestra plataforma moderna 
                de análisis y visualización.
              </p>
              <div className="d-flex gap-3">
                {user ? (
                  <Button as={Link} to="/dashboard" variant="light" size="lg" className="btn-gradient">
                    Ir al Dashboard
                  </Button>
                ) : (
                  <>
                    <Button as={Link} to="/register" variant="light" size="lg" className="btn-gradient">
                      Comenzar Gratis
                    </Button>
                    <Button as={Link} to="/login" variant="outline-light" size="lg">
                      Iniciar Sesión
                    </Button>
                  </>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <div className="display-1">📊</div>
                <p className="fs-5">Visualiza, analiza y comprende tus datos</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-gradient">Características Principales</h2>
              <p className="lead text-muted">
                Herramientas poderosas para el análisis de datos
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md={4}>
              <Card className="custom-card h-100 text-center">
                <Card.Body className="p-4">
                  <div className="display-4 mb-3">📈</div>
                  <Card.Title>Dashboard Interactivo</Card.Title>
                  <Card.Text>
                    Visualiza tus métricas clave con gráficos dinámicos y dashboards personalizables.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="custom-card h-100 text-center">
                <Card.Body className="p-4">
                  <div className="display-4 mb-3">🔐</div>
                  <Card.Title>Seguridad Avanzada</Card.Title>
                  <Card.Text>
                    Autenticación segura con cifrado de datos y protección de la información.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="custom-card h-100 text-center">
                <Card.Body className="p-4">
                  <div className="display-4 mb-3">⚡</div>
                  <Card.Title>Rendimiento Optimizado</Card.Title>
                  <Card.Text>
                    Procesamiento rápido de datos con manejo de excepciones y concurrencias.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Carousel Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-gradient">Casos de Uso</h2>
              <p className="lead text-muted">
                Descubre cómo nuestra plataforma puede transformar tu análisis de datos
              </p>
            </Col>
          </Row>
          
          <Row>
            <Col lg={8} className="mx-auto">
              <Carousel fade indicators={false} controls={true}>
                <Carousel.Item>
                  <div className="text-center p-5">
                    <div className="display-1 mb-4">📊</div>
                    <h3 className="fw-bold mb-3">Análisis de Ventas</h3>
                    <p className="lead text-muted mb-4">
                      Visualiza tendencias de ventas, identifica patrones estacionales y optimiza tu estrategia comercial con dashboards interactivos.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                      <span className="badge bg-primary fs-6">Dashboard</span>
                      <span className="badge bg-success fs-6">Gráficos</span>
                      <span className="badge bg-info fs-6">Tendencias</span>
                    </div>
                  </div>
                </Carousel.Item>
                
                <Carousel.Item>
                  <div className="text-center p-5">
                    <div className="display-1 mb-4">📈</div>
                    <h3 className="fw-bold mb-3">Métricas de Rendimiento</h3>
                    <p className="lead text-muted mb-4">
                      Monitorea KPIs clave, genera reportes automáticos y toma decisiones basadas en datos en tiempo real.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                      <span className="badge bg-warning fs-6">KPIs</span>
                      <span className="badge bg-danger fs-6">Reportes</span>
                      <span className="badge bg-dark fs-6">Tiempo Real</span>
                    </div>
                  </div>
                </Carousel.Item>
                
                <Carousel.Item>
                  <div className="text-center p-5">
                    <div className="display-1 mb-4">🔍</div>
                    <h3 className="fw-bold mb-3">Análisis Predictivo</h3>
                    <p className="lead text-muted mb-4">
                      Utiliza algoritmos avanzados para predecir tendencias futuras y anticiparte a los cambios del mercado.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                      <span className="badge bg-secondary fs-6">IA</span>
                      <span className="badge bg-primary fs-6">Predicciones</span>
                      <span className="badge bg-success fs-6">Machine Learning</span>
                    </div>
                  </div>
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Technology Stack */}
      <section className="bg-light py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold">Stack Tecnológico</h2>
              <p className="lead text-muted">
                Construido con las mejores tecnologías modernas
              </p>
            </Col>
          </Row>
          
          <Row className="g-3 justify-content-center">
            <Col xs={6} sm={4} md={2}>
              <Card className="custom-card text-center">
                <Card.Body>
                  <div className="fs-1 mb-2">⚛️</div>
                  <Card.Title className="fs-6">React 18</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={4} md={2}>
              <Card className="custom-card text-center">
                <Card.Body>
                  <div className="fs-1 mb-2">🔷</div>
                  <Card.Title className="fs-6">TypeScript</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={4} md={2}>
              <Card className="custom-card text-center">
                <Card.Body>
                  <div className="fs-1 mb-2">🟢</div>
                  <Card.Title className="fs-6">Node.js</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={4} md={2}>
              <Card className="custom-card text-center">
                <Card.Body>
                  <div className="fs-1 mb-2">🚀</div>
                  <Card.Title className="fs-6">Express</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={4} md={2}>
              <Card className="custom-card text-center">
                <Card.Body>
                  <div className="fs-1 mb-2">🎨</div>
                  <Card.Title className="fs-6">Bootstrap</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={4} md={2}>
              <Card className="custom-card text-center">
                <Card.Body>
                  <div className="fs-1 mb-2">📊</div>
                  <Card.Title className="fs-6">Chart.js</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="display-5 fw-bold mb-4">¿Listo para comenzar?</h2>
              <p className="lead text-muted mb-4">
                Únete a miles de usuarios que ya están analizando sus datos con nuestra plataforma.
              </p>
              {!user && (
                <Button as={Link} to="/register" size="lg" className="btn-gradient">
                  Crear Cuenta Gratuita
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;


