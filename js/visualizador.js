        // Funcionalidad para las miniaturas
        document.querySelectorAll('.miniatura').forEach(miniatura => {
            miniatura.addEventListener('click', () => {
                const imgSrc = miniatura.querySelector('img').src;
                document.querySelector('.imagen-principal img').src = imgSrc;
            });
        });

        // Funcionalidad para los tamaños
        document.querySelectorAll('.opcion-tamano').forEach(opcion => {
            opcion.addEventListener('click', () => {
                document.querySelectorAll('.opcion-tamano').forEach(o => o.classList.remove('activa'));
                opcion.classList.add('activa');
            });
        });

        // Funcionalidad para el checkbox de LED
        document.getElementById('luces-led').addEventListener('change', function() {
            const precioBase = 450000;
            const precioElemento = document.querySelector('.precio');
            const subtotalElemento = document.querySelector('.subtotal span:last-child');
            
            if (this.checked) {
                precioElemento.textContent = '$' + (precioBase - 100000).toLocaleString();
                subtotalElemento.textContent = '$' + (precioBase - 100000).toLocaleString();
            } else {
                precioElemento.textContent = '$' + precioBase.toLocaleString();
                subtotalElemento.textContent = '$' + precioBase.toLocaleString();
            }
        });
