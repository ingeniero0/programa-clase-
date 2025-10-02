import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Dropdown, Badge, Alert } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext.tsx';
import { dataService } from '../services/api.ts';
import { AnalyticsData, DataEntry } from '../types/index.ts';

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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [entries, setEntries] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsData, entriesData] = await Promise.all([
        dataService.getAnalytics(),
        dataService.getDataEntries()
      ]);
      setAnalytics(analyticsData);
      setEntries(entriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>No hay datos disponibles</h3>
          <p className="text-muted">Comienza agregando algunos datos para ver las analíticas.</p>
        </div>
      </Container>
    );
  }

  // Configuración de gráficos
  const categoryData = {
    labels: analytics.categoryBreakdown.map(cat => cat.category),
    datasets: [
      {
        label: 'Valor Total',
        data: analytics.categoryBreakdown.map(cat => cat.totalValue),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyData = {
    labels: analytics.monthlyTrend.map(month => month.month),
    datasets: [
      {
        label: 'Valor Mensual',
        data: analytics.monthlyTrend.map(month => month.value),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

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
          '#FF9F40'
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold text-gradient">
                ¡Bienvenido, {user?.name}! 👋
              </h1>
              <p className="text-muted">Aquí tienes un resumen de tus datos</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Controles de Dashboard */}
      <Row className="mb-4">
        <Col>
          <Card className="custom-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <h5 className="mb-0">📊 Panel de Control</h5>
                  <small className="text-muted">Personaliza tu vista de datos</small>
                </Col>
                <Col md={6} className="text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-primary" size="sm">
                        📅 {timeRange === '7d' ? '7 días' : timeRange === '30d' ? '30 días' : timeRange === '90d' ? '90 días' : '1 año'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setTimeRange('7d')}>Últimos 7 días</Dropdown.Item>
                        <Dropdown.Item onClick={() => setTimeRange('30d')}>Últimos 30 días</Dropdown.Item>
                        <Dropdown.Item onClick={() => setTimeRange('90d')}>Últimos 90 días</Dropdown.Item>
                        <Dropdown.Item onClick={() => setTimeRange('1y')}>Último año</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        📈 {chartType === 'line' ? 'Línea' : 'Barras'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setChartType('line')}>Gráfico de Línea</Dropdown.Item>
                        <Dropdown.Item onClick={() => setChartType('bar')}>Gráfico de Barras</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    
                    <Button 
                      variant="outline-success" 
                      size="sm" 
                      onClick={handleRefresh}
                      disabled={refreshing}
                    >
                      {refreshing ? (
                        <>
                          <Spinner size="sm" className="me-1" />
                          Actualizando...
                        </>
                      ) : (
                        <>
                          🔄 Actualizar
                        </>
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Métricas principales */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="custom-card text-center pulse-animation">
            <Card.Body>
              <div className="display-4 text-primary mb-2">📊</div>
              <h3 className="fw-bold">{analytics.totalEntries}</h3>
              <p className="text-muted mb-0">Total Entradas</p>
              <small className="text-success">
                +{entries.filter(e => {
                  const entryDate = new Date(e.date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return entryDate > weekAgo;
                }).length} esta semana
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="custom-card text-center pulse-animation">
            <Card.Body>
              <div className="display-4 text-success mb-2">💰</div>
              <h3 className="fw-bold">${analytics.totalValue.toLocaleString()}</h3>
              <p className="text-muted mb-0">Valor Total</p>
              <small className="text-info">
                Promedio: ${analytics.averageValue.toLocaleString()}
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="custom-card text-center pulse-animation">
            <Card.Body>
              <div className="display-4 text-info mb-2">📈</div>
              <h3 className="fw-bold">${analytics.averageValue.toLocaleString()}</h3>
              <p className="text-muted mb-0">Promedio por Entrada</p>
              <small className="text-warning">
                Máximo: ${Math.max(...entries.map(e => e.value)).toLocaleString()}
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="custom-card text-center pulse-animation">
            <Card.Body>
              <div className="display-4 text-warning mb-2">🏷️</div>
              <h3 className="fw-bold">{analytics.categoryBreakdown.length}</h3>
              <p className="text-muted mb-0">Categorías Activas</p>
              <small className="text-primary">
                Top: {analytics.categoryBreakdown[0]?.category || 'N/A'}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="custom-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📈 Tendencia Temporal</h5>
              <div className="d-flex gap-2">
                <Badge bg="info">{timeRange}</Badge>
                <Badge bg="secondary">{chartType === 'line' ? 'Línea' : 'Barras'}</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: '400px' }}>
                {chartType === 'line' ? (
                  <Line data={monthlyData} options={chartOptions} />
                ) : (
                  <Bar data={monthlyData} options={chartOptions} />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="custom-card">
            <Card.Header>
              <h5 className="mb-0">🥧 Distribución por Categoría</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: '300px' }}>
                <Pie data={doughnutData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                      },
                    },
                  },
                }} />
              </div>
              <div className="mt-3">
                {analytics.categoryBreakdown.slice(0, 3).map((cat, index) => (
                  <div key={cat.category} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="me-2" 
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: doughnutData.datasets[0].backgroundColor[index],
                          borderRadius: '50%'
                        }}
                      />
                      <span className="small">{cat.category}</span>
                    </div>
                    <Badge bg="outline-primary">{cat.percentage.toFixed(1)}%</Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        <Col>
          <Card className="custom-card">
            <Card.Header>
              <h5 className="mb-0">📊 Comparación por Categoría</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: '300px' }}>
                <Bar data={categoryData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Entradas Recientes */}
      <Row className="g-4 mt-4">
        <Col>
          <Card className="custom-card">
            <Card.Header>
              <h5 className="mb-0">🕒 Entradas Recientes</h5>
            </Card.Header>
            <Card.Body>
              {entries.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <Alert.Heading>No hay entradas recientes</Alert.Heading>
                  <p>Comienza agregando algunos datos para verlos aquí.</p>
                </Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Categoría</th>
                        <th>Descripción</th>
                        <th>Valor</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.slice(0, 5).map(entry => (
                        <tr key={entry.id}>
                          <td>
                            <Badge bg="primary">{entry.category}</Badge>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={entry.description}>
                              {entry.description}
                            </div>
                          </td>
                          <td className="fw-bold text-success">
                            ${entry.value.toLocaleString()}
                          </td>
                          <td>
                            {new Date(entry.date).toLocaleDateString()}
                          </td>
                          <td>
                            <Badge bg="success">Activo</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;


