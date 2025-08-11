document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const productNameEl = document.getElementById('product-name');
    const productPriceEl = document.getElementById('product-price');
    const productImageEl = document.getElementById('product-image');
    const productDescriptionEl = document.getElementById('product-description');
    const addToCartButton = document.getElementById('add-to-cart-detail');
    const feedbackMessage = document.getElementById('feedback-message');
    const pageLayout = document.querySelector('.product-detail-layout');
    
    const quantityMinusBtn = document.getElementById('quantity-minus');
    const quantityPlusBtn = document.getElementById('quantity-plus');
    const quantityDisplay = document.getElementById('quantity');
    const toneSelect = document.getElementById('tone');

    // --- OBTENER DATOS DEL PRODUCTO DESDE LA URL ---
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productName = params.get('name');
    const productPrice = params.get('price');
    const productImage = params.get('image');
    const productDescription = params.get('description');

    // --- FUNCIÓN PARA FORMATEAR MONEDA ---
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
    };

    // --- POBLAR LA PÁGINA CON LOS DATOS ---
    if (productId && productName && productPrice && productImage) {
        productNameEl.textContent = productName;
        productPriceEl.textContent = formatCurrency(productPrice);
        productImageEl.src = decodeURIComponent(productImage);
        productImageEl.alt = productName;
        productDescriptionEl.textContent = productDescription ? decodeURIComponent(productDescription) : "No hay descripción disponible para este producto.";
        document.title = `${productName} - Makilu & make-up`;
    } else {
        if (pageLayout) {
             pageLayout.innerHTML = '<h2 class="section-title">Error: Producto no encontrado.</h2><p style="text-align:center;">Por favor, vuelve a la tienda e inténtalo de nuevo.</p>';
        }
        return;
    }

    // --- FUNCIONALIDAD DEL SELECTOR DE CANTIDAD (+/-) ---
    quantityPlusBtn.addEventListener('click', () => {
        let currentQuantity = parseInt(quantityDisplay.value, 10);
        quantityDisplay.value = currentQuantity + 1;
    });

    quantityMinusBtn.addEventListener('click', () => {
        let currentQuantity = parseInt(quantityDisplay.value, 10);
        if (currentQuantity > 1) {
            quantityDisplay.value = currentQuantity - 1;
        }
    });

    // --- FUNCIONALIDAD DEL BOTÓN "AÑADIR AL CARRITO" ---
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const storedCart = localStorage.getItem('makiluShoppingCart');
            let cart = storedCart ? JSON.parse(storedCart) : [];

            const quantity = parseInt(quantityDisplay.value, 10);
            const selectedTone = toneSelect.value;
            const finalProductName = selectedTone ? `${productName} (Tono: ${selectedTone})` : productName;

            for (let i = 0; i < quantity; i++) {
                const productToAdd = {
                    id: `${productId}-${selectedTone || 'default'}-${Date.now() + i}`, 
                    name: finalProductName,
                    price: parseFloat(productPrice),
                    image: decodeURIComponent(productImage) 
                };
                cart.push(productToAdd);
            }

            localStorage.setItem('makiluShoppingCart', JSON.stringify(cart));
            
            // Llama a la función global para re-dibujar el carrito
            if (typeof window.renderCart === 'function') {
                window.renderCart(); 
            }

            // Mensaje de confirmación
            addToCartButton.textContent = '¡Añadido!';
            feedbackMessage.textContent = `¡${quantity} producto(s) añadido(s) al carrito!`;
            
            setTimeout(() => {
                addToCartButton.textContent = 'Añadir al Carrito';
                feedbackMessage.textContent = '';
            }, 2500);
        });
    }
});