import React from 'react';
import { Form } from 'react-bootstrap';

const CaseSearch = ({ value, onChange }) => (
  <Form.Control
    type="text"
    name="search"
    placeholder="搜尋關鍵字..."
    value={value}
    onChange={onChange}
  />
);

export default CaseSearch;
