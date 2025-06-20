import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';

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

const CaseModal = ({ show, onClose, onSubmit, loading, editingCase }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingCase) {
      const date = editingCase.date
        ? new Date(editingCase.date).toISOString().split('T')[0]
        : '';
      setForm({ ...initialState, ...editingCase, date });
    } else {
      setForm(initialState);
    }
  }, [editingCase, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editingCase ? '編輯案件' : '新增案件'}</Modal.Title>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>操作員</Form.Label>
                <Form.Control
                  name="operator"
                  value={form.operator}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>圖面版本</Form.Label>
                <Form.Control
                  name="drawingVersion"
                  value={form.drawingVersion}
                  onChange={handleChange}
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
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>解決方案</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="solution"
              value={form.solution}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              取消
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : editingCase ? (
                '儲存變更'
              ) : (
                '新增'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CaseModal;
