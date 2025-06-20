import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Pagination,
  Modal,
  Spinner,
} from 'react-bootstrap';
import Swal from 'sweetalert2';

const FILTERS = {
  inspectionType: '',
  marketType: '',
  department: '',
  search: '',
};

const initialState = {
  inspectionType: '',
  marketType: '',
  customer: '',
  department: '',
  date: '',
  time: '',
  workOrder: '',
  operator: '',
  drawingVersion: '',
  productNumber: '',
  productName: '',
  quantity: 0,
  inspector: '',
  defectCategory: '',
  defectDescription: '',
  solution: '',
  inspectionHours: 0,
};

const PAGE_SIZE = 10;

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [filters, setFilters] = useState(FILTERS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialState);
  const [formLoading, setFormLoading] = useState(false);
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [randomLoading, setRandomLoading] = useState(false);

  const fetchCases = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page,
      limit: PAGE_SIZE,
      sortField,
      sortOrder,
    });

    if (filters.inspectionType)
      params.append('inspectionType', filters.inspectionType);
    if (filters.marketType) params.append('marketType', filters.marketType);
    if (filters.department) params.append('department', filters.department);
    if (filters.search) params.append('search', filters.search);

    try {
      const res = await fetch(`/api/cases?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setCases(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        throw new Error(data.message || 'Failed to fetch cases');
      }
    } catch (error) {
      setCases([]);
      setTotalPages(1);
      Swal.fire({
        icon: 'error',
        title: '取得資料失敗',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
    // eslint-disable-next-line
  }, [page, sortField, sortOrder, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleShowModal = (caseItem = null) => {
    if (caseItem && caseItem._id) {
      const date = caseItem.date
        ? new Date(caseItem.date).toISOString().split('T')[0]
        : '';
      setForm({ ...initialState, ...caseItem, date });
      setEditingCaseId(caseItem._id);
    } else {
      setForm(initialState);
      setEditingCaseId(null);
    }
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const url = editingCaseId ? `/api/cases/${editingCaseId}` : '/api/cases';
    const method = editingCaseId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        handleCloseModal();
        Swal.fire({
          icon: 'success',
          title: editingCaseId ? '更新成功!' : '新增成功!',
          showConfirmButton: false,
          timer: 1500,
        });
        fetchCases(); // Refresh list
      } else {
        throw new Error(
          data.message || (editingCaseId ? '更新失敗' : '新增失敗'),
        );
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: editingCaseId ? '更新失敗' : '新增失敗',
        text: error.message,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (caseId) => {
    Swal.fire({
      title: '確定要刪除嗎？',
      text: '這個操作無法復原！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '是的，刪除它！',
      cancelButtonText: '取消',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/cases/${caseId}`, { method: 'DELETE' });
          if (res.ok) {
            Swal.fire('已刪除！', '您的案件已被刪除。', 'success');
            fetchCases(); // Refresh list
          } else {
            const data = await res.json();
            throw new Error(data.message || '刪除失敗');
          }
        } catch (error) {
          Swal.fire('刪除失敗！', error.message, 'error');
        }
      }
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => setPage(number)}
        >
          {number}
        </Pagination.Item>,
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  // 點擊日期欄位切換排序
  const handleSortDate = () => {
    if (sortField === 'date') {
      if (page !== 1) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        setPage(1);
      } else {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      }
    } else {
      setSortField('date');
      setSortOrder('desc');
      if (page !== 1) {
        setPage(1);
      }
    }
  };

  // 新增隨機20筆資料
  const handleAddRandom = async () => {
    setRandomLoading(true);
    try {
      const res = await fetch('/api/cases/random', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: `已新增${data.count}筆隨機資料`,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchCases();
      } else {
        throw new Error(data.message || '新增失敗');
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: '新增失敗', text: err.message });
    } finally {
      setRandomLoading(false);
    }
  };

  return (
    <Container fluid className="my-4">
      <Row className="mb-3">
        <Col>
          <h2>案件列表</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={() => handleShowModal()} className="me-2">
            新增案件
          </Button>
          <Button
            variant="secondary"
            onClick={handleAddRandom}
            disabled={randomLoading}
          >
            {randomLoading ? '產生中...' : '新增隨機20筆資料'}
          </Button>
        </Col>
      </Row>

      <div className="mb-3 p-3 border rounded">
        <Row className="g-3">
          <Col md={3}>
            <Form.Control
              type="text"
              name="search"
              placeholder="搜尋關鍵字..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              name="inspectionType"
              value={filters.inspectionType}
              onChange={handleFilterChange}
            >
              <option value="">全部檢驗類型</option>
              <option value="首件">首件</option>
              <option value="巡檢">巡檢</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              name="marketType"
              value={filters.marketType}
              onChange={handleFilterChange}
            >
              <option value="">全部市場類型</option>
              <option value="內銷">內銷</option>
              <option value="外銷">外銷</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
            >
              <option value="">全部部門</option>
              <option value="塑膠射出課">塑膠射出課</option>
              <option value="射出加工組">射出加工組</option>
              <option value="機械加工課">機械加工課</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>檢驗類型</th>
              <th>市場類型</th>
              <th>部門</th>
              <th
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={handleSortDate}
              >
                日期
                {sortField === 'date'
                  ? sortOrder === 'asc'
                    ? ' ▲'
                    : ' ▼'
                  : ' ▼'}
              </th>
              <th>產品編號</th>
              <th>產品名稱</th>
              <th>數量</th>
              <th>檢驗員</th>
              <th>缺陷分類</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {cases.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  無資料
                </td>
              </tr>
            ) : (
              cases.map((item) => (
                <tr key={item._id}>
                  <td>{item.inspectionType}</td>
                  <td>{item.marketType}</td>
                  <td>{item.department}</td>
                  <td>
                    {item.date ? new Date(item.date).toLocaleDateString() : ''}
                  </td>
                  <td>
                    <Link to={`/cases/${item._id}`}>{item.productNumber}</Link>
                  </td>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.inspector}</td>
                  <td>{item.defectCategory}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(item)}
                    >
                      編輯
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      刪除
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <div className="d-flex justify-content-center">{renderPagination()}</div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingCaseId ? '編輯案件' : '新增案件'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>檢驗類型*</Form.Label>
                  <Form.Select
                    name="inspectionType"
                    value={form.inspectionType}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">請選擇</option>
                    <option value="首件">首件</option>
                    <option value="巡檢">巡檢</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>市場類型*</Form.Label>
                  <Form.Select
                    name="marketType"
                    value={form.marketType}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">請選擇</option>
                    <option value="內銷">內銷</option>
                    <option value="外銷">外銷</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>客戶*</Form.Label>
                  <Form.Control
                    name="customer"
                    value={form.customer}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>部門*</Form.Label>
                  <Form.Select
                    name="department"
                    value={form.department}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">請選擇</option>
                    <option value="塑膠射出課">塑膠射出課</option>
                    <option value="射出加工組">射出加工組</option>
                    <option value="機械加工課">機械加工課</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>日期*</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>時間*</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>產品編號*</Form.Label>
                  <Form.Control
                    name="productNumber"
                    value={form.productNumber}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>產品名稱*</Form.Label>
                  <Form.Control
                    name="productName"
                    value={form.productName}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>數量*</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleFormChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>檢驗員</Form.Label>
                  <Form.Select
                    name="inspector"
                    value={form.inspector}
                    onChange={handleFormChange}
                  >
                    <option value="">請選擇</option>
                    <option value="吳小男">吳小男</option>
                    <option value="謝小宸">謝小宸</option>
                    <option value="黃小瀅">黃小瀅</option>
                    <option value="蔡小函">蔡小函</option>
                    <option value="徐小棉">徐小棉</option>
                    <option value="杜小綾">杜小綾</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>缺陷分類</Form.Label>
                  <Form.Select
                    name="defectCategory"
                    value={form.defectCategory}
                    onChange={handleFormChange}
                  >
                    <option value="">請選擇</option>
                    <option value="無圖面">無圖面</option>
                    <option value="圖物不符">圖物不符</option>
                    <option value="無工單">無工單</option>
                    <option value="無檢驗表單">無檢驗表單</option>
                    <option value="尺寸NG">尺寸NG</option>
                    <option value="外觀NG">外觀NG</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>檢驗工時</Form.Label>
                  <Form.Control
                    type="number"
                    name="inspectionHours"
                    value={form.inspectionHours}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>工單</Form.Label>
                  <Form.Control
                    name="workOrder"
                    value={form.workOrder}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>操作員</Form.Label>
                  <Form.Control
                    name="operator"
                    value={form.operator}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>圖面版本</Form.Label>
                  <Form.Control
                    name="drawingVersion"
                    value={form.drawingVersion}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>缺陷描述</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="defectDescription"
                value={form.defectDescription}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>解決方案</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="solution"
                value={form.solution}
                onChange={handleFormChange}
              />
            </Form.Group>

            <div className="text-end">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="me-2"
              >
                取消
              </Button>
              <Button variant="primary" type="submit" disabled={formLoading}>
                {formLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : editingCaseId ? (
                  '儲存變更'
                ) : (
                  '新增'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CaseList;
