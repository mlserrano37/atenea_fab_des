// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // ===== Tema claro/oscuro =====
    const htmlEl = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlEl.dataset.theme = savedTheme;

    // Cambiar el tema al hacer clic en el botón
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.dataset.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlEl.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
    });

    // ===== Menú móvil =====
    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');

    // Abrir/cerrar menú móvil
    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !expanded);
        mainMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainMenu.classList.remove('active');
            }
        });
    });

    // ===== Animaciones al hacer scroll =====
    // Opciones para el Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Crear el observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                // Dejar de observar después de que se ha mostrado
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // ===== Validación de formulario =====
    const contactForm = document.querySelector('#contacto-form');

    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea, select');

        // Validar cada campo cuando pierde el foco
        formInputs.forEach(input => {
            input.addEventListener('blur', (event) => {
                validateInput(event.target);
            });
        });

        // Validar todo el formulario al enviar
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            formInputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Simulación de envío del formulario
                showFormMessage('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();

                // Quitar clases de validación
                formInputs.forEach(input => {
                    input.classList.remove('valid');
                });
            } else {
                showFormMessage('Por favor, completa correctamente todos los campos obligatorios.', 'error');
            }
        });
    }

    // Función para validar un campo de formulario
    function validateInput(input) {
        const value = input.value.trim();

        // Validar campos obligatorios
        if (input.required && value === '') {
            setInputStatus(input, false, 'Este campo es obligatorio');
            return false;
        }

        // Validar email
        if (input.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setInputStatus(input, false, 'Por favor, introduce un email válido');
                return false;
            }
        }

        // Si pasa todas las validaciones
        setInputStatus(input, true, '');
        return true;
    }

    // Función para establecer el estado visual de un campo
    function setInputStatus(input, isValid, message) {
        const parent = input.parentElement;
        const feedback = parent.querySelector('small');

        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');

            // Restaurar el mensaje de ayuda original
            if (input.hasAttribute('aria-describedby')) {
                const helpId = input.getAttribute('aria-describedby');
                const helpEl = document.getElementById(helpId);
                if (helpEl) {
                    feedback.textContent = helpEl.textContent;
                }
            }
        } else {
            input.classList.remove('valid');
            input.classList.add('error');
            feedback.textContent = message;
        }
    }

    // Función para mostrar mensajes de formulario
    function showFormMessage(message, type) {
        // Eliminar mensajes anteriores
        const existingMessages = contactForm.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Crear nuevo mensaje
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;

        // Insertar al inicio del formulario
        const fieldset = contactForm.querySelector('fieldset');
        fieldset.insertBefore(messageEl, fieldset.firstChild);

        // Desaparecer después de 5 segundos
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    // ===== Interacción con detalles =====
    const allDetails = document.querySelectorAll('details');

    // Agregar transición suave al abrir/cerrar detalles
    allDetails.forEach(detail => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                const content = detail.querySelector('div');
                content.style.maxHeight = '0';

                // Forzar un reflow
                content.offsetHeight;

                // Animar apertura
                content.style.transition = 'max-height 0.3s ease-out';
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});