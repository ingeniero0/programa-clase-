import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Doughnut, Line, Scatter } from 'react-chartjs-2';
import { dataService } from '../services/api.ts';
import { AnalyticsData } from '../types/index.ts';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dataService.getAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error al cargar analíticas</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchAnalytics}>
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!analytics) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          <Alert.Heading>No hay datos disponibles</Alert.Heading>
          <p>Comienza agregando algunos datos para ver las analíticas.</p>
        </Alert>
      </Container>
    );
  }

  // Configuración de gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Gráfico de barras por categoría
  const categoryBarData = {
    labels: analytics.categoryBreakdown.map(cat => cat.category),
    datasets: [
      {
        label: 'Valor Total',
        data: analytics.categoryBreakdown.map(cat => cat.totalValue),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      },
      {
        label: 'Cantidad',
        data: analytics.categoryBreakdown.map(cat => cat.count),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Gráfico de líneas - tendencia mensual
  const monthlyLineData = {
    labels: analytics.monthlyTrend.map(month => month.month),
    datasets: [
      {
        label: 'Valor Mensual',
        data: analytics.monthlyTrend.map(month => month.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Cantidad Mensual',
        data: analytics.monthlyTrend.map(month => month.count),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // Gráfico de dona - distribución porcentual
  const doughnutData = {
    labels: analytics.categoryBreakdown.map(cat => cat.category),
    datasets: [
      {
        data: analytics.categoryBreakdown.map(cat => cat.percentage),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Gráfico de dispersión - valor vs cantidad
  const scatterData = {
    datasets: [
      {
        label: 'Valor vs Cantidad por Categoría',
        data: analytics.categoryBreakdown.map(cat => ({
          x: cat.count,
          y: cat.totalValue,
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Cantidad de Entradas'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Valor Total'
        }
      }
    },
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold text-gradient">Análisis Avanzado</h1>
              <p className="text-muted">Visualizaciones detalladas de tus datos</p>
            </div>
            <Button
              variant="outline-primary"
              onClick={fetchAnalytics}
              disabled={loading}
            >
              🔄 Actualizar
            </Button>
          </div>
        </Col>
      </Row>

      {/* Resumen estadístico */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="custom-card text-center">
            <Card.Body>
              <div className="display-4 text-primary mb-2">📊</div>
              <h3 className="fw-bold">{analytics.totalEntries}</h3>
              <p className="text-muted mb-0">Total Entradas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="custom-card text-center">
            <Card.Body>
              <div className="display-4 text-success mb-2">💰</div>
              <h3 className="fw-bold">${analytics.totalValue.toLocaleString()}</h3>
              <p className="text-muted mb-0">Valor Total</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="custom-card text-center">
            <Card.Body>
              <div className="display-4 text-info mb-2">📈</div>
              <h3 className="fw-bold">${analytics.averageValue.toLocaleString()}</h3>
              <p className="text-muted mb-0">Promedio</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="custom-card text-center">
            <Card.Body>
              <div className="display-4 text-warning mb-2">🏷️</div>
              <h3 className="fw-bold">{analytics.categoryBreakdown.length}</h3>
              <p className="text-muted mb-0">Categorías</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos principales */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="custom-card">
            <Card.Header>
              <h5 className="mb-0">Tendencia Temporal</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                <Line data={monthlyLineData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="custom-card">
            <Card.Header>
              <h5 className="mb-0">Distribución por Categoría</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                <Doughnut data={doughnutData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        <Col lg={8}>
          <Card className="custom-card">
            <Card.Header>
              <h5 className="mb-0">Análisis por Categoría</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                <Bar data={categoryBarData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="custom-card">
            <Card.Header>
              <h5 className="mb-0">Correlación Valor vs Cantidad</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                <Scatter data={scatterData} options={scatterOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla detallada */}
      <Row className="g-4 mt-4">
        <Col>
          <Card className="custom-card">
            <Card.Header>
              <h5 className="mb-0">Desglose Detallado por Categoría</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Categoría</th>
                      <th>Cantidad</th>
                      <th>Valor Total</th>
                      <th>Promedio</th>
                      <th>Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.categoryBreakdown.map((cat, index) => (
                      <tr key={index}>
                        <td>
                          <span className="badge bg-primary">{cat.category}</span>
                        </td>
                        <td className="fw-bold">{cat.count}</td>
                        <td className="fw-bold text-success">
                          ${cat.totalValue.toLocaleString()}
                        </td>
                        <td>${(cat.totalValue / cat.count).toLocaleString()}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                              <div
                                className="progress-bar"
                                style={{ width: `${cat.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-muted">{cat.percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;


