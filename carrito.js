document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.querySelector('.close-cart-button');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const cartCounterBadge = document.getElementById('cart-counter');
    const checkoutButton = document.querySelector('.checkout-btn');

    // --- ESTADO DEL CARRITO ---
    let cart = [];

    // --- FUNCIONES ---

    const saveCartToStorage = () => {
        localStorage.setItem('makiluShoppingCart', JSON.stringify(cart));
    };

    const loadCartFromStorage = () => {
        const storedCart = localStorage.getItem('makiluShoppingCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        } else {
            cart = [];
        }
    };

    const toggleCartModal = () => {
        if (cartModal) {
            cartModal.classList.toggle('is-open');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    // "Dibuja" los productos dentro del modal del carrito
    const renderCart = () => {
        // !! CORRECCIÓN CLAVE: Cargar siempre los datos más recientes de localStorage !!
        loadCartFromStorage();

        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center;">Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">${formatCurrency(item.price)}</p>
                    </div>
                    <button class="cart-item-remove-btn" data-id="${item.id}">✖</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
                totalPrice += parseFloat(item.price);
            });
        }
        
        if(cartTotalPriceElement) cartTotalPriceElement.textContent = formatCurrency(totalPrice);
        if(cartCounterBadge) cartCounterBadge.textContent = cart.length;
    };
    
    // Elimina un producto del carrito
    const removeFromCart = (e) => {
        if (e.target.classList.contains('cart-item-remove-btn')) {
            const productId = e.target.dataset.id;
            cart = cart.filter(item => item.id !== productId);
            saveCartToStorage();
            renderCart();
        }
    };

    // Redirige a la página de checkout
    const checkout = (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Tu carrito está vacío. ¡Añade productos para continuar!');
            return;
        }
        window.location.href = 'checkout.html';
    };

    // --- EVENT LISTENERS (ESCUCHADORES DE EVENTOS) ---

    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            renderCart(); // Asegurarse de que esté actualizado antes de abrir
            toggleCartModal();
        });
    }

    if (closeCartButton) {
        closeCartButton.addEventListener('click', toggleCartModal);
    }
    
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                toggleCartModal();
            }
        });
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', removeFromCart);
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }

    // --- INICIALIZACIÓN ---
    renderCart(); // Carga inicial
    
    // --- EXPOSICIÓN GLOBAL ---
    // Hacemos que la función renderCart esté disponible globalmente
    // para que otros scripts (como producto-detalle.js) puedan llamarla.
    window.renderCart = renderCart;
});