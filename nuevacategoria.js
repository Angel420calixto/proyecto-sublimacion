// js/nuevo-catalogo.js - JavaScript adaptado para el nuevo catálogo

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- Elementos del DOM con clases renombradas ---
    const menuButton = document.getElementById('nc-boton-menu-mobile');
    const menuPrincipal = document.getElementById('nc-menu-principal');
    const menuOverlay = document.getElementById('nc-menu-overlay');
    const body = document.body;
    const dropdownButtons = document.querySelectorAll('.nc-menu-con-desplegable');
    const modal = document.getElementById('nc-modal-imagen');
    const modalImg = document.getElementById('nc-imagen-ampliada');
    const modalTitulo = document.getElementById('nc-modal-titulo');
    const modalMedida = document.getElementById('nc-modal-medida');
    const whatsappLink = document.getElementById('nc-whatsapp-link');
    const closeModal = document.querySelector('.nc-cerrar-modal');
    const verMasButtons = document.querySelectorAll('.nc-boton-ver-mas');
    const popularGrid = document.getElementById('nc-grid-popular');
    const expandButton = document.getElementById('nc-boton-expandir-popular');

    // --- Función para abrir el modal ---
    function abrirModal(imgElement) {
        if (!modal || !imgElement) return;

        const titulo = imgElement.dataset.titulo || 'Producto';
        const medida = imgElement.dataset.medida || 'Medida no disponible';
        const src = imgElement.src;

        modalImg.src = src;
        modalTitulo.textContent = titulo;
        modalMedida.textContent = `Medida: ${medida}`;

        // Actualizar enlace de WhatsApp
        if (whatsappLink) {
            let mensaje = `¡Hola! Quiero encargar este producto:\n\n`;
            mensaje += `• Producto: ${titulo}\n`;
            mensaje += `• Medida: ${medida}\n`;
            mensaje += `• Diseño seleccionado del catálogo\n\n`;
            mensaje += `¿Podrías ayudarme con el pedido?`;

            whatsappLink.href = `https://wa.me/56982045756?text=${encodeURIComponent(mensaje)}`;
        }

        modal.classList.add('mostrar');
        body.style.overflow = 'hidden';
    }

    // --- Asignar evento de clic a todas las imágenes de productos ---
    document.querySelectorAll('.nc-imagen-producto').forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            abrirModal(this);
        });
    });

    // --- Cerrar modal ---
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('mostrar');
            body.style.overflow = '';
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.classList.remove('mostrar');
                body.style.overflow = '';
            }
        });
    }

    // --- Menú móvil ---
    if (menuButton && menuPrincipal && menuOverlay) {
        const toggleMenu = (show) => {
            if (show) {
                menuPrincipal.classList.add('activo');
                menuOverlay.classList.add('activo');
                body.classList.add('nc-menu-abierto');
                menuButton.setAttribute('aria-expanded', 'true');
            } else {
                menuPrincipal.classList.remove('activo');
                menuOverlay.classList.remove('activo');
                body.classList.remove('nc-menu-abierto');
                menuButton.setAttribute('aria-expanded', 'false');

                // Cerrar también los desplegables
                dropdownButtons.forEach(btn => {
                    btn.classList.remove('activo');
                });
            }
        };

        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menuPrincipal.classList.contains('activo');
            toggleMenu(!isOpen);
        });

        menuOverlay.addEventListener('click', () => {
            toggleMenu(false);
        });
    }

    // --- Manejo de menús desplegables en móvil ---
    if (window.innerWidth <= 768) {
        dropdownButtons.forEach(button => {
            const btnElement = button.querySelector('.nc-enlace-menu-desplegable');
            if (btnElement) {
                btnElement.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    button.classList.toggle('activo');
                });
            }
        });
    }

    // --- Botones "Ver más" ---
    verMasButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            if (targetId) {
                const targetGrid = document.getElementById(targetId);
                if (targetGrid) {
                    targetGrid.classList.toggle('nc-expandido');
                    this.textContent = targetGrid.classList.contains('nc-expandido') ? 'Ver menos' : 'Ver más';
                }
            }
        });
    });

    // --- Botón específico para la sección Cyberpunk (si existe) ---
    if (expandButton && popularGrid) {
        expandButton.addEventListener('click', function() {
            popularGrid.classList.toggle('nc-expandido');
            this.textContent = popularGrid.classList.contains('nc-expandido') ? 'Ver menos' : 'Ver más';
        });
    }
});