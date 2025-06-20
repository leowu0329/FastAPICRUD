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
  Spinner,
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import CaseSearch from '../components/caseSearch';
import CaseFilter from '../components/caseFilter';
import CasePagination from '../components/casePagination';

const API_URL = import.meta.env.VITE_API_URL;

const FILTERS = {
  inspectionType: '',
  marketType: '',
  department: '',
  search: '',
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const CaseList = ({ reloadKey, onEditCase }) => {
  const [cases, setCases] = useState([]);
  const [filters, setFilters] = useState(FILTERS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const fetchCases = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page,
      limit: pageSize,
      sortField,
      sortOrder,
    });

    if (filters.inspectionType)
      params.append('inspectionType', filters.inspectionType);
    if (filters.marketType) params.append('marketType', filters.marketType);
    if (filters.department) params.append('department', filters.department);
    if (filters.search) params.append('search', filters.search);

    try {
      const res = await fetch(`${API_URL}/api/cases?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setCases(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalCount(data.pagination?.total || 0);
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
  }, [page, sortField, sortOrder, filters, pageSize, reloadKey]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
          const res = await fetch(`${API_URL}/api/cases/${caseId}`, {
            method: 'DELETE',
          });
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

  return (
    <Container fluid className="my-4">
      <div className="mb-3 p-3 border rounded">
        <Row className="g-3">
          <Col md={3}>
            <CaseSearch value={filters.search} onChange={handleFilterChange} />
          </Col>
          <CaseFilter filters={filters} onChange={handleFilterChange} />
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
                    {onEditCase && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => onEditCase(item)}
                      >
                        編輯
                      </Button>
                    )}
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

      <CasePagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        totalCount={totalCount}
        PAGE_SIZE_OPTIONS={PAGE_SIZE_OPTIONS}
        renderPagination={renderPagination}
      />
    </Container>
  );
};

export default CaseList;
