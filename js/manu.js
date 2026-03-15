// manu.js - VERSIÓN CORREGIDA: menú funcional, imagen sin opacidad

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
        this.setupWhatsAppLinks();
        console.log('✅ ANIMETAL - Configuración completa');
    }

    // ===========================================
    // 1. MENÚ MÓVIL - CORREGIDO
    // ===========================================
    setupMenuMobile() {
        this.menuBtn = document.getElementById('boton-menu-mobile');
        this.menu = document.getElementById('menu-principal');
        this.overlay = document.getElementById('menu-overlay');

        if (!this.menuBtn || !this.menu) {
            console.warn('⚠️ Elementos del menú móvil no encontrados');
            return;
        }

        // Eliminar event listeners duplicados usando nueva función
        const newMenuBtn = this.menuBtn.cloneNode(true);
        this.menuBtn.parentNode.replaceChild(newMenuBtn, this.menuBtn);
        this.menuBtn = newMenuBtn;

        this.menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMenu();
        });

        if (this.overlay) {
            const newOverlay = this.overlay.cloneNode(true);
            this.overlay.parentNode.replaceChild(newOverlay, this.overlay);
            this.overlay = newOverlay;
            
            this.overlay.addEventListener('click', () => {
                this.cerrarMenu();
            });
        }

        // Delegación de eventos para enlaces del menú
        this.menu.addEventListener('click', (e) => {
            const enlace = e.target.closest('a');
            if (enlace && window.innerWidth <= 768) {
                setTimeout(() => this.cerrarMenu(), 150);
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
        
        this.menuBtn.setAttribute('aria-expanded', !estaActivo);
    }

    abrirMenu() {
        this.menu.classList.add('activo');
        if (this.overlay) this.overlay.classList.add('activo');
        this.body.classList.add('menu-abierto');
    }

    cerrarMenu() {
        this.menu.classList.remove('activo');
        if (this.overlay) this.overlay.classList.remove('activo');
        this.body.classList.remove('menu-abierto');
        
        // Cerrar TODOS los submenús
        document.querySelectorAll('.menu-con-desplegable.activo').forEach(item => {
            item.classList.remove('activo');
        });
        
        this.menuBtn.setAttribute('aria-expanded', 'false');
    }

    // ===========================================
    // 2. SUBMENÚ MÓVIL - CORREGIDO (TODOS LOS SUBMENÚS)
    // ===========================================
    setupSubmenuMobile() {
        const menusDesplegables = document.querySelectorAll('.menu-con-desplegable');
        
        if (menusDesplegables.length === 0) {
            console.warn('⚠️ Menús desplegables no encontrados');
            return;
        }

        menusDesplegables.forEach(menu => {
            const enlaceDesplegable = menu.querySelector('.enlace-menu-desplegable');
            if (!enlaceDesplegable) return;

            // Eliminar listeners anteriores
            const newEnlace = enlaceDesplegable.cloneNode(true);
            enlaceDesplegable.parentNode.replaceChild(newEnlace, enlaceDesplegable);

            newEnlace.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const estaActivo = menu.classList.contains('activo');
                    
                    // Cerrar otros submenús
                    menusDesplegables.forEach(item => {
                        if (item !== menu) {
                            item.classList.remove('activo');
                            const itemEnlace = item.querySelector('.enlace-menu-desplegable');
                            if (itemEnlace) itemEnlace.setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    // Toggle del actual
                    menu.classList.toggle('activo');
                    newEnlace.setAttribute('aria-expanded', !estaActivo);
                }
            });

            // Enlaces del submenú
            const submenu = menu.querySelector('.submenu');
            if (submenu) {
                submenu.querySelectorAll('a').forEach(enlace => {
                    enlace.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (window.innerWidth <= 768) {
                            setTimeout(() => this.cerrarMenu(), 100);
                        }
                    });
                });
            }
        });
    }

    // ===========================================
    // 3. BOTONES "VER MÁS" - SIN CAMBIOS
    // ===========================================
    setupVerMasButtons() {
        const botonPopular = document.getElementById('boton-expandir-popular');
        const gridPopular = document.getElementById('grid-popular');
        
        if (botonPopular && gridPopular) {
            botonPopular.addEventListener('click', () => {
                const estaExpandido = gridPopular.classList.toggle('expandido');
                botonPopular.textContent = estaExpandido ? 'Ver menos' : 'Ver más';
            });
        }

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
    // 4. MODAL DE IMÁGENES - CORREGIDO (PRECIO Y SIN OPACIDAD)
    // ===========================================
    setupModalImagenes() {
        this.modal = document.getElementById('modal-imagen');
        this.imagenAmpliada = document.getElementById('imagen-ampliada');
        this.modalTitulo = document.getElementById('modal-titulo');
        this.modalMedida = document.getElementById('modal-medida');
        this.modalPrecio = document.getElementById('modal-precio');
        this.whatsappLink = document.getElementById('whatsapp-link');
        this.cerrarModal = document.querySelector('.cerrar-modal');

        if (!this.modal) {
            console.warn('⚠️ Modal no encontrado');
            return;
        }

        this.setupEventosImagenes();
        this.setupCierreModal();
    }

    setupEventosImagenes() {
        // Usar event delegation para evitar duplicados
        document.addEventListener('click', (e) => {
            // Solo en móvil evitar doble ejecución
            if (window.innerWidth <= 768 && e.target.closest('.boton-menu-mobile')) return;
            
            const imagen = e.target.closest('.imagen-producto');
            if (imagen && !this.isModalOpen) {
                e.preventDefault();
                e.stopPropagation();
                this.abrirModal(imagen);
                return;
            }
            
            const articulo = e.target.closest('.item-popular, .producto-item');
            if (articulo && !this.isModalOpen) {
                e.preventDefault();
                e.stopPropagation();
                const imagen = articulo.querySelector('.imagen-producto');
                if (imagen) this.abrirModal(imagen);
            }
        });
    }

    setupCierreModal() {
        if (this.cerrarModal) {
            const newCerrar = this.cerrarModal.cloneNode(true);
            this.cerrarModal.parentNode.replaceChild(newCerrar, this.cerrarModal);
            this.cerrarModal = newCerrar;
            
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

        const src = imagenElemento.src;
        const titulo = imagenElemento.getAttribute('data-titulo') || 'Producto';
        const medida = imagenElemento.getAttribute('data-medida') || '20x22 cm';
        const precio = imagenElemento.getAttribute('data-precio') || '$12.990';

        this.imagenAmpliada.src = src;
        this.imagenAmpliada.alt = titulo;
        this.modalTitulo.textContent = titulo;
        
        if (this.modalMedida) {
            this.modalMedida.textContent = `Medida: ${medida}`;
        }
        
        if (this.modalPrecio) {
            this.modalPrecio.textContent = `Precio: ${precio} CLP`;
        }

        if (this.whatsappLink) {
            const mensaje = `¡Hola! Quiero encargar este producto:%0A%0A• Producto: ${encodeURIComponent(titulo)}%0A• Medida: ${encodeURIComponent(medida)}%0A• Precio: ${encodeURIComponent(precio)}%0A%0ADiseño seleccionado del catálogo%0A%0A¿Podrías ayudarme con el pedido?`;
            this.whatsappLink.href = `https://wa.me/56982045756?text=${mensaje}`;
        }

        this.modal.classList.add('mostrar');
        this.body.style.overflow = 'hidden';
        this.modal.offsetHeight;
    }

    cerrarModalFunc() {
        if (!this.modal.classList.contains('mostrar')) return;
        
        this.modal.classList.remove('mostrar');
        this.body.style.overflow = '';
        this.isModalOpen = false;
        
        setTimeout(() => {
            this.imagenAmpliada.src = '';
        }, 300);
    }

    // ===========================================
    // 5. ENLACES DE WHATSAPP - SIN CAMBIOS
    // ===========================================
    setupWhatsAppLinks() {
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        
        whatsappLinks.forEach(link => {
            if (link.classList.contains('whatsapp-button')) return;
            
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // ===========================================
    // 6. SCROLL SUAVE - SIN CAMBIOS
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
                        if (this.menu && this.menu.classList.contains('activo')) {
                            this.cerrarMenu();
                        }
                        
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
    // 7. REDIMENSIONAMIENTO - SIN CAMBIOS
    // ===========================================
    setupRedimensionamiento() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768) {
                    if (this.menu && this.menu.classList.contains('activo')) {
                        this.cerrarMenu();
                    }
                    
                    document.querySelectorAll('.menu-con-desplegable.activo').forEach(item => {
                        item.classList.remove('activo');
                    });
                }
            }, 250);
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    try {
        const animetal = new Animetal();
        console.log('🎉 ANIMETAL - Inicializado correctamente');
        
        setTimeout(() => {
            document.body.classList.add('cargado');
        }, 100);
    } catch (error) {
        console.error('❌ Error al inicializar ANIMETAL:', error);
    }
});

// ===========================================
// MANEJADOR DE ERRORES DE IMAGEN - CORREGIDO (SIN OPACIDAD GLOBAL)
// ===========================================
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn(`⚠️ Error al cargar imagen: ${e.target.src}`);
        
        // SOLO aplicar a imágenes que fallaron, no a todas
        if (e.target.classList.contains('imagen-producto') && !e.target.src.includes('svg')) {
            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231a1a2e"/><text x="150" y="100" font-family="Arial" font-size="16" fill="%23b8b8d1" text-anchor="middle">Imagen no disponible</text></svg>';
        }
    }
}, true);

// ===========================================
// RENDIMIENTO EN SCROLL - SIN CAMBIOS
// ===========================================
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            document.body.classList.add('scrolling');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
            
            setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 100);
        }, 10);
    }
});