// 全局錯誤處理
document.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred.',
    });
}, true);

// 表單提交處理
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" 
                      role="status" 
                      aria-hidden="true">
                </span> Processing...`;
        }
    });
});

// 刪除項目功能
document.addEventListener('DOMContentLoaded', function() {
    // 刪除按鈕事件處理
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const itemId = this.getAttribute('data-id');
            
            const { isConfirmed } = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                reverseButtons: true
            });

            if (isConfirmed) {
                try {
                    const response = await fetch(`/items/${itemId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        await Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: result.message,
                            timer: 2000,
                            showConfirmButton: false
                        });
                        window.location.reload();
                    } else {
                        const error = await response.json();
                        throw new Error(error.detail || 'Delete failed');
                    }
                } catch (error) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: error.message,
                    });
                }
            }
        });
    });

    // 顯示閃現消息
    const flashMessage = document.getElementById('flash-message');
    if (flashMessage) {
        const { type, message } = flashMessage.dataset;
        Swal.fire({
            icon: type || 'info',
            title: message || 'Notification',
            timer: 2000,
            showConfirmButton: false
        });
    }
});

// 表單驗證增強
function setupFormValidation() {
    document.querySelectorAll('form[needs-validation]').forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                
                // 找到第一個無效字段
                const invalidField = form.querySelector(':invalid');
                if (invalidField) {
                    invalidField.focus();
                    Swal.fire({
                        icon: 'error',
                        title: 'Validation Error',
                        text: invalidField.validationMessage || 'Please fill in this field correctly',
                    });
                }
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    setupFormValidation();
});