import React from 'react';
import { Form } from 'react-bootstrap';

const CasePagination = ({
  page,
  totalPages,
  pageSize,
  setPage,
  setPageSize,
  totalCount,
  PAGE_SIZE_OPTIONS,
  renderPagination,
}) => (
  <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
    <Form.Select
      style={{ width: 100 }}
      className="me-2"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setPage(1);
      }}
    >
      {PAGE_SIZE_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          每頁{opt}筆
        </option>
      ))}
    </Form.Select>
    {renderPagination()}
    <div className="ms-3 text-secondary">
      {totalCount > 0 && (
        <span>
          第 {(page - 1) * pageSize + 1}~{Math.min(page * pageSize, totalCount)}{' '}
          筆，共 {totalCount} 筆
        </span>
      )}
    </div>
  </div>
);

export default CasePagination;
