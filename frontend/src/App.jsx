import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import CaseList from './pages/caseList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/case-list" replace />} />
        <Route path="/case-list" element={<CaseList />} />
      </Routes>
    </Router>
  );
};

export default App;
