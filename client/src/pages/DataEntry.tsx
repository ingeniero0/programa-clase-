import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal, Badge, InputGroup, Dropdown } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { dataService } from '../services/api.ts';
import { DataEntry, DataEntryFormData } from '../types/index.ts';

const schema = yup.object({
  category: yup.string().required('Categoría es requerida'),
  value: yup.number()
    .positive('El valor debe ser positivo')
    .max(999999999, 'El valor no puede exceder 999,999,999')
    .required('Valor es requerido'),
  description: yup.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .required('Descripción es requerida'),
  date: yup.string().required('Fecha es requerida'),
  priority: yup.string().oneOf(['low', 'medium', 'high'], 'Prioridad inválida').required('Prioridad es requerida'),
  tags: yup.string().optional(),
});

const DataEntryPage: React.FC = () => {
  const [entries, setEntries] = useState<DataEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DataEntryFormData>({
    resolver: yupResolver(schema),
  });

  const categories = [
    'Ventas',
    'Marketing',
    'Desarrollo',
    'Soporte',
    'Administración',
    'Investigación',
    'Recursos Humanos',
    'Finanzas',
    'Operaciones',
    'Calidad',
    'Logística',
    'Innovación'
  ];

  const priorities = [
    { value: 'low', label: 'Baja', color: 'success' },
    { value: 'medium', label: 'Media', color: 'warning' },
    { value: 'high', label: 'Alta', color: 'danger' }
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    filterAndSortEntries();
  }, [entries, searchTerm, selectedCategory, sortBy, sortOrder]);

  const filterAndSortEntries = () => {
    let filtered = [...entries];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'date':
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredEntries(filtered);
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await dataService.getDataEntries();
      setEntries(data);
    } catch (error: any) {
      toast.error('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DataEntryFormData) => {
    try {
      setSubmitting(true);
      
      if (editingEntry) {
        await dataService.updateDataEntry(editingEntry.id, data);
        toast.success('Entrada actualizada exitosamente');
      } else {
        await dataService.createDataEntry(data);
        toast.success('Entrada creada exitosamente');
      }
      
      reset();
      setEditingEntry(null);
      setShowModal(false);
      fetchEntries();
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry: DataEntry) => {
    setEditingEntry(entry);
    setValue('category', entry.category);
    setValue('value', entry.value);
    setValue('description', entry.description);
    setValue('date', new Date(entry.date).toISOString().split('T')[0]);
    setValue('priority', (entry as any).priority || 'medium');
    setValue('tags', (entry as any).tags || '');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      try {
        await dataService.deleteDataEntry(id);
        toast.success('Entrada eliminada exitosamente');
        fetchEntries();
      } catch (error: any) {
        toast.error('Error al eliminar: ' + error.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEntry(null);
    reset();
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold text-gradient">Ingreso de Datos</h1>
              <p className="text-muted">Gestiona tus entradas de datos</p>
            </div>
            <Button
              variant="primary"
              className="btn-gradient"
              onClick={() => setShowModal(true)}
            >
              ➕ Nueva Entrada
            </Button>
          </div>
        </Col>
      </Row>

      {/* Controles de filtrado y búsqueda */}
      <Row className="mb-4">
        <Col>
          <Card className="custom-card">
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>🔍 Buscar</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por descripción o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                        ✕
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>📂 Categoría</Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>📊 Ordenar por</Form.Label>
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'date' | 'value' | 'category')}
                    >
                      <option value="date">Fecha</option>
                      <option value="value">Valor</option>
                      <option value="category">Categoría</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>🔄 Orden</Form.Label>
                    <Form.Select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    >
                      <option value="desc">Descendente</option>
                      <option value="asc">Ascendente</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <div className="d-flex gap-2">
                    <Badge bg="info">
                      Total: {filteredEntries.length} entradas
                    </Badge>
                    <Badge bg="success">
                      Valor total: ${filteredEntries.reduce((sum, entry) => sum + entry.value, 0).toLocaleString()}
                    </Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Formulario Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingEntry ? 'Editar Entrada' : 'Nueva Entrada'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    {...register('category')}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('value')}
                    isInvalid={!!errors.value}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.value?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe esta entrada..."
                {...register('description')}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                {...register('date')}
                isInvalid={!!errors.date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prioridad</Form.Label>
                  <Form.Select
                    {...register('priority')}
                    isInvalid={!!errors.priority}
                  >
                    <option value="">Selecciona prioridad</option>
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.priority?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etiquetas (opcional)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ej: importante, urgente, proyecto-x"
                    {...register('tags')}
                    isInvalid={!!errors.tags}
                  />
                  <Form.Text className="text-muted">
                    Separa múltiples etiquetas con comas
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.tags?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="btn-gradient"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Guardando...
                  </>
                ) : (
                  editingEntry ? 'Actualizar' : 'Crear'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Tabla de entradas */}
      <Row>
        <Col>
          <Card className="custom-card">
            <Card.Header>
              <h5 className="mb-0">Entradas de Datos</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : filteredEntries.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <Alert.Heading>
                    {entries.length === 0 ? 'No hay entradas' : 'No se encontraron resultados'}
                  </Alert.Heading>
                  <p>
                    {entries.length === 0 
                      ? 'Comienza agregando tu primera entrada de datos.'
                      : 'Intenta ajustar los filtros de búsqueda.'
                    }
                  </p>
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Categoría</th>
                        <th>Valor</th>
                        <th>Descripción</th>
                        <th>Prioridad</th>
                        <th>Fecha</th>
                        <th>Etiquetas</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEntries.map(entry => (
                        <tr key={entry.id}>
                          <td>
                            <span className="badge bg-primary">{entry.category}</span>
                          </td>
                          <td className="fw-bold">${entry.value.toLocaleString()}</td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={entry.description}>
                              {entry.description}
                            </div>
                          </td>
                          <td>
                            {(() => {
                              const priority = (entry as any).priority || 'medium';
                              const priorityInfo = priorities.find(p => p.value === priority);
                              return (
                                <Badge bg={priorityInfo?.color || 'secondary'}>
                                  {priorityInfo?.label || 'Media'}
                                </Badge>
                              );
                            })()}
                          </td>
                          <td>{new Date(entry.date).toLocaleDateString()}</td>
                          <td>
                            {(() => {
                              const tags = (entry as any).tags;
                              if (!tags) return <span className="text-muted">-</span>;
                              return tags.split(',').map((tag: string, index: number) => (
                                <Badge key={index} bg="outline-secondary" className="me-1">
                                  {tag.trim()}
                                </Badge>
                              ));
                            })()}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEdit(entry)}
                                title="Editar"
                              >
                                ✏️
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(entry.id)}
                                title="Eliminar"
                              >
                                🗑️
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DataEntryPage;


