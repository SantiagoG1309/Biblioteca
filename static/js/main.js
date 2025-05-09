// Variables globales y utilidades
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

// Animaciones suaves para elementos
const fadeIn = (element, duration = 400) => {
    element.style.opacity = 0;
    element.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => {
        element.style.opacity = 1;
    });
};

const slideIn = (element, direction = 'left', duration = 400) => {
    const offset = direction === 'left' ? -20 : 20;
    element.style.transform = `translateX(${offset}px)`;
    element.style.opacity = 0;
    element.style.transition = `all ${duration}ms ease`;
    requestAnimationFrame(() => {
        element.style.transform = 'translateX(0)';
        element.style.opacity = 1;
    });
};

// Mostrar mensajes con animación mejorada y estilo elegante
const showMessage = (message, type = 'info') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: var(--dark-text);
        color: white;
        box-shadow: var(--shadow-md);
        z-index: 1050;
        opacity: 0;
        transform: translateY(-10px);
    `;
    alertDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;

    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        requestAnimationFrame(() => {
            setTimeout(() => {
                alertDiv.classList.add('fade-out');
                requestAnimationFrame(() => {
                    setTimeout(() => alertDiv.remove(), 400);
                });
            }, 6000);
        });
    }
};

// Validación visual mejorada de formularios con feedback elegante
const enhanceFormValidation = () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.style.transition = 'all 0.4s ease';
        fadeIn(form);
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.classList.add('focused');
                input.style.transition = 'border-color 0.3s ease';
            });
            input.addEventListener('blur', () => {
                input.classList.remove('focused');
                if (input.required && !input.value.trim()) {
                    input.classList.add('is-invalid');
                    showMessage('Este campo es obligatorio', 'danger');
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            form.addEventListener('submit', (e) => {
                let isValid = true;
                inputs.forEach(i => {
                    if (i.required && !i.value.trim()) {
                        isValid = false;
                        i.classList.add('is-invalid');
                    }
                });
                if (!isValid) e.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = submitBtn.dataset.originalText || 'Enviar';
                        }, 2000);
                    });
                }
            });
        });
    });
};

// Mejoras en tablas con animación
const enhanceTables = () => {
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const link = row.querySelector('a');
            if (link) {
                row.style.cursor = 'pointer';
                row.style.transition = 'background 0.3s ease';
                row.addEventListener('click', (e) => {
                    if (!e.target.matches('a, button')) {
                        link.click();
                    }
                });
                row.addEventListener('mouseover', () => {
                    row.style.background = '#f1f3f5';
                });
                row.addEventListener('mouseout', () => {
                    if (!row.classList.contains('active')) row.style.background = '';
                });
            }
        });

        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (!header.classList.contains('no-sort')) {
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => {
                    sortTable(table, index);
                    headers.forEach(h => h.classList.remove('asc', 'desc'));
                    header.classList.add(header.classList.contains('asc') ? 'desc' : 'asc');
                });
            }
        });
    });
};

// Ordenar tabla con animación
const sortTable = (table, column) => {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAsc = table.querySelector('th').classList.contains('asc');

    rows.sort((a, b) => {
        const aVal = a.cells[column].textContent.trim().toLowerCase();
        const bVal = b.cells[column].textContent.trim().toLowerCase();
        return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });

    rows.forEach((row, i) => {
        row.style.transition = 'all 0.3s ease';
        requestAnimationFrame(() => {
            tbody.appendChild(row);
            if (i === rows.length - 1) row.style.transition = '';
        });
    });
};

// Búsqueda con debounce y animación
const enhanceSearch = () => {
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce((e) => {
            const form = input.closest('form');
            if (form) {
                form.classList.add('searching');
                setTimeout(() => form.submit(), 300);
            }
        }, 500));
        input.addEventListener('focus', () => input.classList.add('focused'));
        input.addEventListener('blur', () => input.classList.remove('focused'));
    });
};

// Activar enlace activo en navegación con animación
const enhanceNavigation = () => {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            link.style.transition = 'all 0.3s ease';
            requestAnimationFrame(() => {
                link.style.color = '#f1c40f';
            });
        }
    });
};

// Manejo de botones de préstamo con feedback
const handlePrestamo = () => {
    const prestamoButtons = document.querySelectorAll('.btn-prestamo');
    prestamoButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const libroId = button.dataset.libroId;
            button.classList.add('processing');
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Solicitando...';

            try {
                const response = await fetch(`/prestamos/solicitar/${libroId}/`);
                if (response.ok) {
                    showMessage('<i class="fas fa-check-circle"></i> Solicitud enviada con éxito', 'success');
                    button.disabled = true;
                    button.innerHTML = '<i class="fas fa-hourglass-half"></i> Solicitado';
                    button.classList.add('btn-success');
                    button.classList.remove('btn-primary', 'processing');
                } else {
                    showMessage('<i class="fas fa-exclamation-triangle"></i> Error al solicitar', 'danger');
                }
            } catch (error) {
                showMessage('<i class="fas fa-wifi-slash"></i> Problema de conexión', 'danger');
            }

            requestAnimationFrame(() => {
                setTimeout(() => {
                    button.classList.remove('processing');
                }, 500);
            });
        });
    });
};

// Inicialización con detección de tamaño de pantalla
document.addEventListener('DOMContentLoaded', () => {
    enhanceFormValidation();
    enhanceTables();
    enhanceSearch();
    enhanceNavigation();
    handlePrestamo();

    const messages = document.querySelectorAll('.messages .alert');
    messages.forEach(message => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                message.classList.add('fade-out');
                requestAnimationFrame(() => {
                    setTimeout(() => message.remove(), 400);
                });
            }, 6000);
        });
    });

    // Ajustes responsivos dinámicos
    const handleResize = () => {
        const width = window.innerWidth;
        if (width < 768) {
            document.querySelectorAll('.card').forEach(card => {
                card.style.height = 'auto';
            });
        }
    };
    window.addEventListener('resize', debounce(handleResize, 200));
    handleResize();
});