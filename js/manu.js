// manu.js - VERSIÓN DEFINITIVA - SUBMENÚ FUNCIONAL

class Animetal {
    constructor() {
        this.body = document.body;
        this.isModalOpen = false;
        this.init();
    }

    init() {
        console.log('🚀 ANIMETAL - Inicializando...');
        this.setupMenuMobile();
        this.setupSubmenuMobile();
        this.setupVerMasButtons();
        this.setupModalImagenes();
        this.setupScrollSuave();
        this.setupRedimensionamiento();
        console.log('✅ ANIMETAL - Configuración completa');
    }

    // ===========================================
    // 1. MENÚ MÓVIL
    // ===========================================
    setupMenuMobile() {
        this.menuBtn = document.querySelector('.boton-menu-mobile');
        this.menu = document.querySelector('.menu-principal');
        this.overlay = document.querySelector('.menu-overlay');

        if (!this.menuBtn || !this.menu) return;

        // Evento para abrir/cerrar menú
        this.menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Evento para cerrar con overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.cerrarMenu();
            });
        }

        // Cerrar menú al hacer clic en enlaces del menú principal (no submenú)
        const enlacesPrincipales = this.menu.querySelectorAll('.enlace-menu:not(.enlace-menu-desplegable)');
        enlacesPrincipales.forEach(enlace => {
            enlace.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.cerrarMenu();
                }
            });
        });
    }

    toggleMenu() {
        if (this.menu.classList.contains('activo')) {
            this.cerrarMenu();
        } else {
            this.abrirMenu();
        }
    }

    abrirMenu() {
        this.menu.classList.add('activo');
        if (this.overlay) {
            this.overlay.style.display = 'block';
            setTimeout(() => this.overlay.classList.add('activo'), 10);
        }
        this.body.classList.add('menu-abierto');
    }

    cerrarMenu() {
        this.menu.classList.remove('activo');
        if (this.overlay) {
            this.overlay.classList.remove('activo');
            setTimeout(() => this.overlay.style.display = 'none', 300);
        }
        this.body.classList.remove('menu-abierto');
        
        // Cerrar submenú si está abierto
        const submenuActivo = document.querySelector('.menu-con-desplegable.activo');
        if (submenuActivo) submenuActivo.classList.remove('activo');
    }

    // ===========================================
    // 2. SUBMENÚ MÓVIL - VERSIÓN SIMPLIFICADA
    // ===========================================
    setupSubmenuMobile() {
        const menuDesplegable = document.querySelector('.menu-con-desplegable');
        if (!menuDesplegable) return;

        const enlaceDesplegable = menuDesplegable.querySelector('.enlace-menu-desplegable');
        if (!enlaceDesplegable) return;

        // SOLUCIÓN: Evento simple sin propagación compleja
        enlaceDesplegable.addEventListener('click', (e) => {
            // Solo en móvil
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                // Toggle simple del submenú
                const estaActivo = menuDesplegable.classList.contains('activo');
                menuDesplegable.classList.toggle('activo');
                
                console.log(`Submenú ${estaActivo ? 'cerrado' : 'abierto'}`);
                
                // NO cerrar el menú principal cuando se abre el submenú
                e.stopPropagation();
            }
        });

        // Permitir clics en enlaces del submenú
        const submenu = menuDesplegable.querySelector('.submenu');
        if (submenu) {
            submenu.querySelectorAll('a').forEach(enlace => {
                enlace.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        // Cerrar ambos menús al seleccionar opción
                        this.cerrarMenu();
                    }
                });
            });
        }

        // Cerrar submenú al hacer clic fuera (pero dentro del menú principal)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                menuDesplegable.classList.contains('activo') &&
                !menuDesplegable.contains(e.target)) {
                menuDesplegable.classList.remove('activo');
            }
        });
    }

    // ===========================================
    // 3. BOTONES "VER MÁS"
    // ===========================================
    setupVerMasButtons() {
        const botonPopular = document.getElementById('boton-expandir-popular');
        const gridPopular = document.getElementById('grid-popular');
        
        if (botonPopular && gridPopular) {
            botonPopular.addEventListener('click', () => {
                this.toggleSeccion(gridPopular, botonPopular);
            });
        }

        const botonesVerMas = document.querySelectorAll('.boton-ver-mas[data-target]');
        botonesVerMas.forEach(boton => {
            boton.addEventListener('click', () => {
                const target = boton.getAttribute('data-target');
                const galeria = document.getElementById(`galeria-${target}`);
                if (galeria) this.toggleSeccion(galeria, boton);
            });
        });
    }

    toggleSeccion(contenedor, boton) {
        const estaExpandido = contenedor.classList.toggle('expandido');
        boton.textContent = estaExpandido ? 'Ver menos' : 'Ver más';
    }

    // ===========================================
    // 4. MODAL DE IMÁGENES
    // ===========================================
    setupModalImagenes() {
        this.modal = document.getElementById('modal-imagen');
        this.imagenAmpliada = document.getElementById('imagen-ampliada');
        this.modalTitulo = document.getElementById('modal-titulo');
        this.modalMedida = document.getElementById('modal-medida');
        this.modalPrecio = document.getElementById('modal-precio');
        this.cerrarModal = document.querySelector('.cerrar-modal');
        this.botonSeleccionar = document.getElementById('boton-seleccionar');

        if (!this.modal) return;

        this.setupEventosImagenes();
        this.setupCierreModal();
    }

    setupEventosImagenes() {
        const imagenes = document.querySelectorAll('.imagen-producto');
        imagenes.forEach(imagen => {
            imagen.style.cursor = 'pointer';
            imagen.addEventListener('click', (e) => {
                e.preventDefault();
                this.abrirModal(imagen);
            });
        });

        const articulos = document.querySelectorAll('.item-popular, .producto-item');
        articulos.forEach(articulo => {
            articulo.style.cursor = 'pointer';
            articulo.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
                const imagen = articulo.querySelector('.imagen-producto');
                if (imagen) {
                    e.preventDefault();
                    this.abrirModal(imagen);
                }
            });
        });
    }

    setupCierreModal() {
        if (this.cerrarModal) {
            this.cerrarModal.addEventListener('click', () => this.cerrarModalFunc());
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.cerrarModalFunc();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('mostrar')) {
                this.cerrarModalFunc();
            }
        });

        if (this.botonSeleccionar) {
            this.botonSeleccionar.addEventListener('click', () => {
                const titulo = this.modalTitulo.textContent;
                const precio = this.modalPrecio.textContent;
                alert(`✅ Producto seleccionado:\n\n${titulo}\n${precio}\n\nAgregado a tu carrito.`);
                this.cerrarModalFunc();
            });
        }
    }

    abrirModal(imagenElemento) {
        if (this.isModalOpen) return;
        this.isModalOpen = true;

        this.imagenAmpliada.src = imagenElemento.src;
        this.imagenAmpliada.alt = imagenElemento.getAttribute('data-titulo') || 'Producto';
        this.modalTitulo.textContent = imagenElemento.getAttribute('data-titulo') || 'Producto sin título';
        this.modalMedida.textContent = `Medida: ${imagenElemento.getAttribute('data-medida') || 'No especificada'}`;
        this.modalPrecio.textContent = imagenElemento.getAttribute('data-precio') || '$0.00';

        this.modal.classList.add('mostrar');
        this.body.style.overflow = 'hidden';
    }

    cerrarModalFunc() {
        if (!this.modal.classList.contains('mostrar')) return;
        this.modal.classList.remove('mostrar');
        this.body.style.overflow = '';
        this.isModalOpen = false;
    }

    // ===========================================
    // 5. SCROLL SUAVE
    // ===========================================
    setupScrollSuave() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href !== '') {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        if (this.menu && this.menu.classList.contains('activo')) {
                            this.cerrarMenu();
                        }
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ===========================================
    // 6. REDIMENSIONAMIENTO
    // ===========================================
    setupRedimensionamiento() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                if (this.menu && this.menu.classList.contains('activo')) {
                    this.cerrarMenu();
                }
                const submenuActivo = document.querySelector('.menu-con-desplegable.activo');
                if (submenuActivo) submenuActivo.classList.remove('activo');
            }
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new Animetal();
});