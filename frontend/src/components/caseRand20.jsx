import React from 'react';
import { Button } from 'react-bootstrap';

const CaseRand20 = ({ onAddRandom, loading }) => (
  <Button variant="secondary" onClick={onAddRandom} disabled={loading}>
    {loading ? '產生中...' : '新增隨機20筆資料'}
  </Button>
);

export default CaseRand20;
