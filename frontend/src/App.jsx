import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import CaseList from './pages/caseList';
import CaseDetail from './pages/caseDetail';
import MyNavbar from './components/Navbar';
import CaseModal from './components/CaseModal';
import Swal from 'sweetalert2';

function App() {
  // 控制新增案件 Modal
  const [showModal, setShowModal] = useState(false);
  // 控制隨機資料 loading
  const [randomLoading, setRandomLoading] = useState(false);
  // 讓 CaseList 重新載入的 key
  const [reloadKey, setReloadKey] = useState(0);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  // 讓子元件呼叫開啟 Modal
  const handleShowModal = () => {
    setEditingCase(null);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  // 新增或編輯案件
  const handleModalSubmit = async (form) => {
    setModalLoading(true);
    try {
      const url = editingCase ? `/api/cases/${editingCase._id}` : '/api/cases';
      const method = editingCase ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: editingCase ? '更新成功!' : '新增成功!',
          timer: 1500,
          showConfirmButton: false,
        });
        setShowModal(false);
        setReloadKey((k) => k + 1);
      } else {
        throw new Error(
          data.message || (editingCase ? '更新失敗' : '新增失敗'),
        );
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: editingCase ? '更新失敗' : '新增失敗',
        text: err.message,
      });
    } finally {
      setModalLoading(false);
    }
  };

  // 編輯案件
  const handleEditCase = (item) => {
    setEditingCase(item);
    setShowModal(true);
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
        setReloadKey((k) => k + 1);
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
    <Router>
      <MyNavbar
        onAddCase={handleShowModal}
        onAddRandom={handleAddRandom}
        randomLoading={randomLoading}
      />
      <CaseModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        editingCase={editingCase}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/case-list" replace />} />
        <Route
          path="/case-list"
          element={
            <CaseList reloadKey={reloadKey} onEditCase={handleEditCase} />
          }
        />
        <Route path="/cases/:id" element={<CaseDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
