function renderizarHeaderCheckout() {
    if (sessionStorage.getItem('isAuthenticated')) {
        const userName = sessionStorage.getItem('currUserName');
        const saudacaoElement = document.getElementById('saudacaoNome');
        const basketSpan = document.getElementById('basket');
        const userInfoContainer = document.getElementById('userInfoContainer');

        if (userInfoContainer) userInfoContainer.style.display = 'flex';

        if (saudacaoElement && userName) {
            saudacaoElement.innerHTML = `
                <span style="color: var(--primary-color); font-weight: normal;">Olá,</span>
                <span style="color: var(--text-color); margin-left: 5px; font-weight: bold;">${userName}</span>
            `;
        }

        let currUserId = sessionStorage.getItem('currUserId');
        let currentUserCartKey = 'cart_' + currUserId;
        let cart = JSON.parse(localStorage.getItem(currentUserCartKey) || "[]");
        let count = cart.reduce((total, item) => total + item.count, 0); 
        
        if (basketSpan) {
            basketSpan.innerHTML = count;
        }

    } else {
        window.location = "../auth/login.html";
    }
}

function renderizarCheckout() {
    let data = JSON.parse(localStorage.getItem('products') || "[]");
    let currUserId = sessionStorage.getItem('currUserId');
    let currentUserCartKey = 'cart_' + currUserId;
    let cart = JSON.parse(localStorage.getItem(currentUserCartKey) || "[]");
    let itemsListContainer = document.getElementById('checkout-items-list');
    let totalElement = document.getElementById('total-final-display');

    if (!totalElement || !itemsListContainer) return;

    if (cart.length > 0) {
        let total = 0;
        itemsListContainer.innerHTML = "";
        
        cart.forEach(cartItem => {
            const produto = data.find(p => p.id === cartItem.id);
            if (produto) {
                const itemPrice = parseFloat(produto.price);
                const itemQuantity = cartItem.count;
                const itemTotal = (itemPrice * itemQuantity);
                total += itemTotal;

                const priceDisplay = itemPrice.toFixed(2).replace('.', ',');
                const itemTotalDisplay = itemTotal.toFixed(2).replace('.', ',');

                itemsListContainer.innerHTML += `
                    <div class="cart-product-item checkout-item-style">
                        <div class="cart-prod-image">
                            <img src="../${produto.imageURL}" alt="${produto.name}">
                        </div>
                        <div class="cart-prod-data checkout-data-layout">
                            <span id="cart-prod-title">${produto.name}</span>
                            
                            <span class="item-price-quantity-checkout">
                                R$ ${priceDisplay} x ${itemQuantity}
                            </span>
                        </div>
                        
                        <div class="item-total-price">
                            R$ ${itemTotalDisplay}
                        </div>
                    </div>
                `;
            }
        });

        totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
    } else {
        document.getElementById('confirmPurchase').style.display = 'none';
        
        document.querySelector('.checkout-summary-final').style.display = 'none';
        
        itemsListContainer.innerHTML = `
            <p style="text-align: center; color: var(--text-color); padding: 20px;">
                Seu carrinho está vazio. Adicione produtos na sacola!
            </p>`;
    }
}

function confirmarCompra() {
    let currUserId = sessionStorage.getItem('currUserId');
    let currentUserCartKey = 'cart_' + currUserId;
    
    localStorage.setItem(currentUserCartKey, JSON.stringify([]));
    
    mostrarFeedback("Compra Finalizada!", "Obrigado por sua compra!", 'success');
    
    setTimeout(() => {
        window.location = '/index.html';
    }, 1500); 
}