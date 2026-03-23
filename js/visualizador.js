 // Menú móvil
    const botonMenu = document.getElementById('boton-menu-mobile');
    const menuPrincipal = document.getElementById('menu-principal');
    const categoriasDropdown = document.getElementById('categorias-dropdown');

    if (botonMenu) {
        botonMenu.addEventListener('click', () => {
            menuPrincipal.classList.toggle('activo');
            const expanded = menuPrincipal.classList.contains('activo');
            botonMenu.setAttribute('aria-expanded', expanded);
            if (categoriasDropdown && !expanded) {
                categoriasDropdown.classList.remove('activo');
            }
        });
    }

    document.querySelectorAll('.enlace-menu, .submenu a').forEach(link => {
        link.addEventListener('click', () => {
            menuPrincipal.classList.remove('activo');
            botonMenu.setAttribute('aria-expanded', 'false');
            if (categoriasDropdown) {
                categoriasDropdown.classList.remove('activo');
            }
        });
    });

    // Desplegable móvil
    if (categoriasDropdown) {
        const desplegableDiv = categoriasDropdown.querySelector('.enlace-menu-desplegable');
        desplegableDiv.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                categoriasDropdown.classList.toggle('activo');
            }
        });
    }

    function cambiarImagen(src) {
        const imgPrincipal = document.getElementById('imagen-principal');
        if (imgPrincipal) imgPrincipal.src = src;
    }

    function seleccionarProducto(nombre, precioTexto) {
        const titulo = document.querySelector('.info-producto h1');
        const subtituloElem = document.querySelector('.subtitulo');
        const precioElem = document.getElementById('precio-mostrado');
        if (titulo) titulo.innerText = nombre;
        if (subtituloElem) subtituloElem.innerText = 'METAL ART PRINT • EDICIÓN ESPECIAL';
        if (precioElem && precioTexto) precioElem.innerText = precioTexto;
        document.querySelector('.producto').scrollIntoView({ behavior: 'smooth' });
    }

    function obtenerPrecioPorTamano() {
        const selectTamano = document.getElementById('tamano-select');
        const selectedOption = selectTamano.options[selectTamano.selectedIndex];
        return parseInt(selectedOption.getAttribute('data-precio'));
    }

    function formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(precio);
    }

    function actualizarPrecio() {
        const precioElem = document.getElementById('precio-mostrado');
        if (precioElem) {
            precioElem.textContent = formatearPrecio(obtenerPrecioPorTamano());
        }
    }

    document.getElementById('tamano-select').addEventListener('change', actualizarPrecio);
    document.getElementById('btn-whatsapp').addEventListener('click', () => {
        const titulo = document.querySelector('.info-producto h1').innerText;
        const subtitulo = document.querySelector('.subtitulo').innerText;
        const tamanoSelect = document.getElementById('tamano-select');
        const tamanoTexto = tamanoSelect.options[tamanoSelect.selectedIndex].text;
        const soporte = document.getElementById('soporte-select').value;
        const cantidad = parseInt(document.getElementById('cantidad-input').value) || 1;
        const total = obtenerPrecioPorTamano() * cantidad;
        const mensaje = `¡Hola! Me interesa encargar el siguiente Metal Art Print:%0A%0A` +
            `🖼️ *Producto:* ${titulo}%0A` +
            `✨ *Serie:* ${subtitulo}%0A` +
            `📏 *Tamaño:* ${tamanoTexto}%0A` +
            `🖌️ *Soporte:* ${soporte}%0A` +
            `🔢 *Cantidad:* ${cantidad}%0A` +
            `💰 *Total:* ${formatearPrecio(total)}%0A%0A` +
            `Quedo atento a su respuesta. ¡Gracias!`;
        window.open(`https://wa.me/56982045756?text=${mensaje}`, '_blank');
    });

    actualizarPrecio();