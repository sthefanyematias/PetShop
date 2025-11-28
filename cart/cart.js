function renderizarHeader() {
    const basketSpan = document.getElementById('basket');
    if (sessionStorage.getItem('isAuthenticated')) {
        const userName = sessionStorage.getItem('currUserName');
        const saudacaoElement = document.getElementById('saudacaoNome');
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
        let cartItems = JSON.parse(localStorage.getItem(currentUserCartKey) || "[]");
        let count = cartItems.reduce((total, item) => total + item.count, 0); 
        
        if (basketSpan) {
            basketSpan.innerHTML = count;
        }

    } else {
        window.location = "../auth/login.html";
    }
}

document.addEventListener('DOMContentLoaded', renderizarHeader);
document.addEventListener('DOMContentLoaded', renderizarCarrinho);

function renderizarCarrinho() {
    let cartContainer = document.getElementById('cart-container');
    let totalSummaryCard = document.getElementById('total-summary-card');
    let totalElement = document.getElementById('total-geral');
    let pageTitle = document.querySelector('main.container h2'); 
    
    if (!cartContainer || !totalElement) return;

    cartContainer.innerHTML = "";
    let data = JSON.parse(localStorage.getItem('products') || "[]");
    let totalGeral = 0;

    totalElement.textContent = "R$ 0,00";


    if (sessionStorage.getItem('isAuthenticated')) {
        let currUserId = sessionStorage.getItem('currUserId');
        let currentUserCartKey = 'cart_' + currUserId;
        let cart = JSON.parse(localStorage.getItem(currentUserCartKey) || "[]");

        if (cart.length === 0) {
             if (pageTitle) pageTitle.style.display = 'none';
             if (document.querySelector('.bottom-cta')) document.querySelector('.bottom-cta').style.display = 'none';

             cartContainer.innerHTML = `
                 <div class="empty-cart-card">
                     <h3 class="empty-cart-title" style="color: var(--primary-color);">Adicione produtos à sua sacola</h3>
                     <p class="empty-cart-text">
                         Que tal explorar nossas categorias ou buscar os produtos que seu pet precisa?
                     </p>
                     <span class="btn cta empty-cart-btn-wrapper">
                         <a href="/index.html" class="btn empty-cart-btn" style="background-color: var(--secondary-color);">Buscar produtos</a>
                     </span>
                 </div>
             `;
             if (totalSummaryCard) totalSummaryCard.style.display = 'block'; 
             return;
        } else {
             if (pageTitle) pageTitle.style.display = 'block';
             if (document.querySelector('.bottom-cta')) document.querySelector('.bottom-cta').style.display = 'inline-flex';
        }

        let cartArr = cart.map(item => {
            const produto = data.find(p => p.id === item.id);
            if (produto) {
                return { ...produto, quantity: item.count, price: parseFloat(produto.price) };
            }
            return null;
        }).filter(item => item !== null);

        cartArr.forEach((item, index) => {
            const itemTotal = (item.price * item.quantity);
            totalGeral += itemTotal; 
            
            const priceDisplay = item.price.toFixed(2).replace('.', ',');

            cartContainer.innerHTML += `
            <div class="cart-product-item">
                <div class="cart-prod-image">
                    <img src="../${item.imageURL}" alt="${item.name}">
                </div>
                <div class="cart-prod-data" >
                    <span id="cart-prod-title">${item.name}</span>
                    <span id="cart-prod-price">R$ ${priceDisplay}</span>
                    <span class="edit-quant">
                        <button class="edit-count-btn" onClick="removerPorUm('${index}')"><i class="material-icons">remove</i></button>
                        <input type="text" name="quantity" id="quantity" class="quant-input" value="${item.quantity}" readonly>
                        <button class="edit-count-btn" onClick="adicionarPorUm('${index}')"><i class="material-icons">add</i></button>
                    </span>
                </div>
                <form action="javascript:removerDoCarrinho('${index}')" class="remove-cart-btn">
                    <button class="delete-btn" id="remove-from-cart" type="submit"><i class="material-icons">delete</i></button>
                </form>
            </div>
            `;
        });
        
        if (totalSummaryCard) {
            totalSummaryCard.style.display = 'block';
            totalElement.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
        }
    } 
}

function limparCarrinho() {
    if (sessionStorage.getItem('isAuthenticated')) {
        const currUserId = sessionStorage.getItem('currUserId');
        const currentUserCartKey = 'cart_' + currUserId;
 
        localStorage.setItem(currentUserCartKey, JSON.stringify([]));

        renderizarCarrinho();
        renderizarHeader();
    }
}

function removerPorUm(index) {
    let currUserId = sessionStorage.getItem('currUserId');
    let currentUserCartKey = 'cart_' + currUserId;
    let cart = JSON.parse(localStorage.getItem(currentUserCartKey) || "[]");

    const itemIndex = parseInt(index); 
    
    if (cart[itemIndex].count === 1) {
        cart.splice(itemIndex, 1);
    } else {
        cart[itemIndex].count--;
    }
    
    localStorage.setItem(currentUserCartKey, JSON.stringify(cart));
    
    renderizarCarrinho(); 
    renderizarHeader();
}

function adicionarPorUm(index) {
    let currUserId = sessionStorage.getItem('currUserId');
    let currentUserCartKey = 'cart_' + currUserId;
    let cart = JSON.parse(localStorage.getItem(currentUserCartKey) || "[]");
    const itemIndex = parseInt(index);
    
    cart[itemIndex].count++;
    localStorage.setItem(currentUserCartKey, JSON.stringify(cart));

    renderizarCarrinho();
    renderizarHeader();
}

function removerDoCarrinho(index) {
    let currUserId = sessionStorage.getItem('currUserId');
    let currentUserCartKey = 'cart_' + currUserId;
    let cart = JSON.parse(localStorage.getItem(currentUserCartKey) || "[]");
    const itemIndex = parseInt(index);

    cart.splice(itemIndex, 1);
    localStorage.setItem(currentUserCartKey, JSON.stringify(cart));
    
    renderizarCarrinho(); 
    renderizarHeader();
}

function logout() {
    sessionStorage.clear();
    window.location = '../index.html'; 
}