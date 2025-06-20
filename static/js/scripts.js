// 全局錯誤處理
window.addEventListener('error', function(event) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred.',
    });
});

// 表單提交處理
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
        }
    });
});