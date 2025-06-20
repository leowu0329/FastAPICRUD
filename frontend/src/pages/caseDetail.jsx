import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

const CaseDetail = () => {
  const { id } = useParams();
  const [caseDetail, setCaseDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCaseDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/cases/${id}`);
        const data = await res.json();
        if (res.ok) {
          setCaseDetail(data.data);
        } else {
          throw new Error(data.message || '無法獲取案件詳細資料');
        }
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: 'error',
          title: '載入失敗',
          text: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetail();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!caseDetail) {
    return (
      <Container className="my-5">
        <Alert variant="warning">找不到案件資料。</Alert>
      </Container>
    );
  }

  const renderDetailField = (label, value) => (
    <p>
      <strong>{label}:</strong> {value || 'N/A'}
    </p>
  );

  return (
    <Container className="my-4">
      <Card>
        <Card.Header as="h4">案件詳細資料</Card.Header>
        <Card.Body>
          <Card.Title>{caseDetail.productName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {caseDetail.productNumber}
          </Card.Subtitle>
          <hr />
          {renderDetailField('檢驗類型', caseDetail.inspectionType)}
          {renderDetailField('市場類型', caseDetail.marketType)}
          {renderDetailField('客戶', caseDetail.customer)}
          {renderDetailField('部門', caseDetail.department)}
          {renderDetailField(
            '日期',
            caseDetail.date
              ? new Date(caseDetail.date).toLocaleDateString()
              : '',
          )}
          {renderDetailField('時間', caseDetail.time)}
          {renderDetailField('工單', caseDetail.workOrder)}
          {renderDetailField('操作員', caseDetail.operator)}
          {renderDetailField('圖面版本', caseDetail.drawingVersion)}
          {renderDetailField('數量', caseDetail.quantity)}
          {renderDetailField('檢驗員', caseDetail.inspector)}
          {renderDetailField('缺陷分類', caseDetail.defectCategory)}
          {renderDetailField('缺陷描述', caseDetail.defectDescription)}
          {renderDetailField('解決方案', caseDetail.solution)}
          {renderDetailField('檢驗工時', caseDetail.inspectionHours)}
          <hr />
          <Link to="/case-list">
            <Button variant="primary">返回列表</Button>
          </Link>
        </Card.Body>
        <Card.Footer className="text-muted">
          建立時間: {new Date(caseDetail.createdAt).toLocaleString()} |
          更新時間: {new Date(caseDetail.updatedAt).toLocaleString()}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default CaseDetail;
