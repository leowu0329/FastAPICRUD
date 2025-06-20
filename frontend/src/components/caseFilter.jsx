import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const CaseFilter = ({ filters, onChange }) => (
  <>
    <Col md={3}>
      <Form.Select
        name="inspectionType"
        value={filters.inspectionType}
        onChange={onChange}
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
        onChange={onChange}
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
        onChange={onChange}
      >
        <option value="">全部部門</option>
        <option value="塑膠射出課">塑膠射出課</option>
        <option value="射出加工組">射出加工組</option>
        <option value="機械加工課">機械加工課</option>
      </Form.Select>
    </Col>
  </>
);

export default CaseFilter;
