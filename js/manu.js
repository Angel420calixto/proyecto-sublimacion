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
        this.menuBtn = document.getElementById('boton-menu-mobile');
        this.menu = document.getElementById('menu-principal');
        this.overlay = document.getElementById('menu-overlay');

        if (!this.menuBtn || !this.menu) {
            console.warn('⚠️ Elementos del menú móvil no encontrados');
            return;
        }

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

        // Cerrar menú al hacer clic en enlaces del menú principal
        const enlacesMenu = this.menu.querySelectorAll('a');
        enlacesMenu.forEach(enlace => {
            enlace.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.cerrarMenu();
                }
            });
        });

        // Cerrar menú al hacer clic fuera en móvil
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                this.menu.classList.contains('activo') &&
                !this.menu.contains(e.target) && 
                e.target !== this.menuBtn) {
                this.cerrarMenu();
            }
        });
    }

    toggleMenu() {
        const estaActivo = this.menu.classList.contains('activo');
        
        if (estaActivo) {
            this.cerrarMenu();
        } else {
            this.abrirMenu();
        }
        
        // Actualizar atributo ARIA
        this.menuBtn.setAttribute('aria-expanded', !estaActivo);
    }

    abrirMenu() {
        this.menu.classList.add('activo');
        if (this.overlay) {
            this.overlay.classList.add('activo');
        }
        this.body.classList.add('menu-abierto');
    }

    cerrarMenu() {
        this.menu.classList.remove('activo');
        if (this.overlay) {
            this.overlay.classList.remove('activo');
        }
        this.body.classList.remove('menu-aberto');
        
        // Cerrar submenú si está abierto
        const submenuActivo = document.querySelector('.menu-con-desplegable.activo');
        if (submenuActivo) {
            submenuActivo.classList.remove('activo');
        }
        
        // Actualizar atributo ARIA
        this.menuBtn.setAttribute('aria-expanded', 'false');
    }

    // ===========================================
    // 2. SUBMENÚ MÓVIL
    // ===========================================
    setupSubmenuMobile() {
        const menuDesplegable = document.querySelector('.menu-con-desplegable');
        if (!menuDesplegable) {
            console.warn('⚠️ Menú desplegable no encontrado');
            return;
        }

        const enlaceDesplegable = menuDesplegable.querySelector('.enlace-menu-desplegable');
        if (!enlaceDesplegable) return;

        // Evento para abrir/cerrar submenú en móvil
        enlaceDesplegable.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const estaActivo = menuDesplegable.classList.contains('activo');
                
                // Cerrar otros submenús si están abiertos
                document.querySelectorAll('.menu-con-desplegable.activo').forEach(item => {
                    if (item !== menuDesplegable) {
                        item.classList.remove('activo');
                    }
                });
                
                // Toggle del submenú actual
                menuDesplegable.classList.toggle('activo');
                
                // Actualizar atributo ARIA
                enlaceDesplegable.setAttribute('aria-expanded', !estaActivo);
            }
        });

        // Cerrar submenú al hacer clic en enlaces
        const submenu = menuDesplegable.querySelector('.submenu');
        if (submenu) {
            submenu.querySelectorAll('a').forEach(enlace => {
                enlace.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        this.cerrarMenu();
                    }
                });
            });
        }
    }

    // ===========================================
    // 3. BOTONES "VER MÁS"
    // ===========================================
    setupVerMasButtons() {
        // Botón específico para Anime Popular
        const botonPopular = document.getElementById('boton-expandir-popular');
        const gridPopular = document.getElementById('grid-popular');
        
        if (botonPopular && gridPopular) {
            botonPopular.addEventListener('click', () => {
                const estaExpandido = gridPopular.classList.toggle('expandido');
                botonPopular.textContent = estaExpandido ? 'Ver menos' : 'Ver más';
            });
        }

        // Botones generales con data-target
        const botonesVerMas = document.querySelectorAll('.boton-ver-mas[data-target]');
        botonesVerMas.forEach(boton => {
            boton.addEventListener('click', () => {
                const targetId = boton.getAttribute('data-target');
                const galeria = document.getElementById(targetId);
                
                if (galeria) {
                    const estaExpandido = galeria.classList.toggle('expandido');
                    boton.textContent = estaExpandido ? 'Ver menos' : 'Ver más';
                }
            });
        });
    }

    // ===========================================
    // 4. MODAL DE IMÁGENES
    // ===========================================
    setupModalImagenes() {
        this.modal = document.getElementById('modal-imagen');
        this.imagenAmpliada = document.getElementById('imagen-ampliada');
        this.modalTitulo = document.getElementById('modal-titulo');
        this.modalMedida = document.getElementById('modal-medida');
        this.cerrarModal = document.querySelector('.cerrar-modal');

        if (!this.modal) {
            console.warn('⚠️ Modal no encontrado');
            return;
        }

        this.setupEventosImagenes();
        this.setupCierreModal();
    }

    setupEventosImagenes() {
        // Delegación de eventos para imágenes de productos
        document.addEventListener('click', (e) => {
            // Verificar si se hizo clic en una imagen de producto
            const imagen = e.target.closest('.imagen-producto');
            if (imagen && !this.isModalOpen) {
                e.preventDefault();
                this.abrirModal(imagen);
                return;
            }
            
            // Verificar si se hizo clic en un artículo completo
            const articulo = e.target.closest('.item-popular, .producto-item');
            if (articulo && !this.isModalOpen) {
                e.preventDefault();
                const imagen = articulo.querySelector('.imagen-producto');
                if (imagen) {
                    this.abrirModal(imagen);
                }
            }
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
    }

    abrirModal(imagenElemento) {
        if (this.isModalOpen) return;
        this.isModalOpen = true;

        // Obtener datos de la imagen
        const src = imagenElemento.src;
        const titulo = imagenElemento.getAttribute('data-titulo') || 'Producto';
        const medida = imagenElemento.getAttribute('data-medida') || 'No especificada';

        // Actualizar contenido del modal
        this.imagenAmpliada.src = src;
        this.imagenAmpliada.alt = titulo;
        this.modalTitulo.textContent = titulo;
        this.modalMedida.textContent = `Medida: ${medida}`;

        // Mostrar modal
        this.modal.classList.add('mostrar');
        this.body.style.overflow = 'hidden';
    }

    cerrarModalFunc() {
        if (!this.modal.classList.contains('mostrar')) return;
        
        this.modal.classList.remove('mostrar');
        this.body.style.overflow = '';
        this.isModalOpen = false;
        
        // Limpiar imagen después de cerrar
        setTimeout(() => {
            this.imagenAmpliada.src = '';
        }, 300);
    }

    // ===========================================
    // 5. SCROLL SUAVE
    // ===========================================
    setupScrollSuave() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            
            if (anchor) {
                const href = anchor.getAttribute('href');
                
                if (href !== '#' && href !== '') {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Cerrar menú móvil si está abierto
                        if (this.menu && this.menu.classList.contains('activo')) {
                            this.cerrarMenu();
                        }
                        
                        // Scroll suave
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    }

    // ===========================================
    // 6. REDIMENSIONAMIENTO
    // ===========================================
    setupRedimensionamiento() {
        window.addEventListener('resize', () => {
            // Cerrar menú móvil al cambiar a desktop
            if (window.innerWidth > 768) {
                if (this.menu && this.menu.classList.contains('activo')) {
                    this.cerrarMenu();
                }
                
                // Cerrar submenús
                document.querySelectorAll('.menu-con-desplegable.activo').forEach(item => {
                    item.classList.remove('activo');
                });
            }
        });
    }
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    try {
        const animetal = new Animetal();
        console.log('🎉 ANIMETAL - Inicializado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar ANIMETAL:', error);
    }
});

// Manejar errores de carga de imágenes
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn(`⚠️ Error al cargar imagen: ${e.target.src}`);
        e.target.style.opacity = '0.5';
    }
}, true);