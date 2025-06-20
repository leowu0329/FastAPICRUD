import { FaReact, FaGithub } from 'react-icons/fa';
import { SiVite } from 'react-icons/si';
import { BsBootstrap } from 'react-icons/bs';
import './index.css';
import Swal from 'sweetalert2';

function App() {
  // 基本提示框
  const showBasicAlert = () => {
    Swal.fire({
      title: '基本提示框',
      text: '這是一個基本的 SweetAlert2 提示框',
      icon: 'info',
    });
  };

  // 成功提示框
  const showSuccessAlert = () => {
    Swal.fire({
      title: '操作成功！',
      text: '您的操作已經完成',
      icon: 'success',
      confirmButtonText: '確定',
    });
  };

  // 確認對話框
  const showConfirmDialog = () => {
    Swal.fire({
      title: '確認刪除？',
      text: '此操作無法復原！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '是的，刪除它！',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('已刪除！', '您的檔案已經被刪除。', 'success');
      }
    });
  };

  // 自定義樣式提示框
  const showCustomAlert = () => {
    Swal.fire({
      title: '自定義樣式',
      text: '這是一個自定義樣式的提示框',
      icon: 'info',
      customClass: {
        popup: 'roboto',
        title: 'text-gradient',
      },
      background: '#fff',
      backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `,
    });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* 左側：Noto Sans TC 字體展示 */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="card-title mb-4 text-gradient">
                Noto Sans TC 字體展示
              </h2>
              <div className="mb-3">
                <h3 className="font-weight-regular">Regular 400</h3>
                <p>這是 Noto Sans TC 的 Regular 字重，適合一般內文使用。</p>
              </div>
              <div className="mb-3">
                <h3 className="font-weight-medium">Medium 500</h3>
                <p>這是 Noto Sans TC 的 Medium 字重，適合強調文字使用。</p>
              </div>
              <div className="mb-3">
                <h3 className="font-weight-bold">Bold 700</h3>
                <p>這是 Noto Sans TC 的 Bold 字重，適合標題使用。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 右側：Roboto 字體展示 */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="card-title mb-4 text-gradient roboto">
                Roboto Font Showcase
              </h2>
              <div className="mb-3 roboto">
                <h3 className="font-weight-regular">Regular 400</h3>
                <p>This is Roboto Regular weight, perfect for body text.</p>
              </div>
              <div className="mb-3 roboto">
                <h3 className="font-weight-medium">Medium 500</h3>
                <p>This is Roboto Medium weight, great for emphasis.</p>
              </div>
              <div className="mb-3 roboto">
                <h3 className="font-weight-bold">Bold 700</h3>
                <p>This is Roboto Bold weight, ideal for headings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SweetAlert2 測試按鈕 */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4 text-gradient">
                SweetAlert2 測試
              </h2>
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-info" onClick={showBasicAlert}>
                  基本提示框
                </button>
                <button className="btn btn-success" onClick={showSuccessAlert}>
                  成功提示框
                </button>
                <button className="btn btn-warning" onClick={showConfirmDialog}>
                  確認對話框
                </button>
                <button className="btn btn-primary" onClick={showCustomAlert}>
                  自定義樣式
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部：圖標展示 */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <div className="d-flex justify-content-center gap-3 mb-3">
                <FaReact size={40} color="#61DAFB" />
                <SiVite size={40} color="#646CFF" />
                <BsBootstrap size={40} color="#7952B3" />
              </div>
              <h1 className="card-title text-gradient">Hello World</h1>
              <p className="card-text">Welcome to React + Vite + Bootstrap</p>
              <button className="btn btn-primary">
                <FaGithub className="me-2" />
                Click Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
