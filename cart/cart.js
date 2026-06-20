
function getCartKey() {
    if (sessionStorage.getItem('isAuthenticated')) {
        return 'cart_' + sessionStorage.getItem('currUserId');
    }
    return 'cart_guest';
}

function renderizarHeader() {
    const basketSpan = document.getElementById('basket');
    const userInfoContainer = document.getElementById('userInfoContainer');
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const cartKey = getCartKey();
    let cartItems = JSON.parse(localStorage.getItem(cartKey) || "[]");
    let count = cartItems.reduce((total, item) => total + item.count, 0);
    if (basketSpan) basketSpan.innerHTML = count;

    if (sessionStorage.getItem('isAuthenticated')) {
        const userName = sessionStorage.getItem('currUserName');
        const saudacaoElement = document.getElementById('saudacaoNome');

        if (userInfoContainer) userInfoContainer.style.display = 'flex';
        if (loginButton) loginButton.style.display = 'none';
        if (signupButton) signupButton.style.display = 'none';

        if (saudacaoElement && userName) {
            saudacaoElement.innerHTML = `
                <span style="color: var(--primary-color); font-weight: normal;">Olá,</span>
                <span style="color: var(--text-color); margin-left: 5px; font-weight: bold;">${userName}</span>
            `;
        }
    } else {
        if (userInfoContainer) userInfoContainer.style.display = 'none';
        if (loginButton) loginButton.style.display = 'block';
        if (signupButton) signupButton.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderizarHeader();
    renderizarCarrinho();
});

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

    const cartKey = getCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

    if (cart.length === 0) {
        if (pageTitle) pageTitle.style.display = 'none';
        if (document.querySelector('.bottom-cta')) document.querySelector('.bottom-cta').style.display = 'none';
        if (totalSummaryCard) totalSummaryCard.style.display = 'none';

        cartContainer.innerHTML = `
            <div class="empty-cart-card">
                <h3 class="empty-cart-title">Sua sacola está vazia</h3>
                <p class="empty-cart-text">Explore nossos produtos e adicione o que seu pet precisa!</p>
                <a href="/index.html#produtos" class="btn empty-cart-btn" style="background-color: var(--secondary-color); display: inline-block; margin-top: 10px;">Ver produtos</a>
            </div>
        `;
        return;
    }

    if (pageTitle) pageTitle.style.display = 'block';
    if (document.querySelector('.bottom-cta')) document.querySelector('.bottom-cta').style.display = 'flex';

    let cartArr = cart.map(item => {
        const produto = data.find(p => p.id === item.id);
        if (produto) {
            return { ...produto, quantity: item.count, price: parseFloat(produto.price) };
        }
        return null;
    }).filter(item => item !== null);

    cartArr.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalGeral += itemTotal;

        const priceDisplay = item.price.toFixed(2).replace('.', ',');

        cartContainer.innerHTML += `
        <div class="cart-product-item">
            <div class="cart-prod-image">
                <img src="../${item.imageURL}" alt="${item.name}">
            </div>
            <div class="cart-prod-data">
                <span id="cart-prod-title">${item.name}</span>
                <span id="cart-prod-price">R$ ${priceDisplay}</span>
                <span class="edit-quant">
                    <button class="edit-count-btn" onclick="removerPorUm(${index})"><i class="material-icons">remove</i></button>
                    <input type="text" class="quant-input" value="${item.quantity}" readonly>
                    <button class="edit-count-btn" onclick="adicionarPorUm(${index})"><i class="material-icons">add</i></button>
                </span>
            </div>
            <form action="javascript:removerDoCarrinho(${index})" class="remove-cart-btn">
                <button class="delete-btn" type="submit"><i class="material-icons">delete</i></button>
            </form>
        </div>
        `;
    });

    if (totalSummaryCard) {
        totalSummaryCard.style.display = 'block';
        totalElement.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    }
}

function limparCarrinho() {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify([]));
    renderizarCarrinho();
    renderizarHeader();
}

function removerPorUm(index) {
    const cartKey = getCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const itemIndex = parseInt(index);

    if (cart[itemIndex].count === 1) {
        cart.splice(itemIndex, 1);
    } else {
        cart[itemIndex].count--;
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderizarCarrinho();
    renderizarHeader();
}

function adicionarPorUm(index) {
    const cartKey = getCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const itemIndex = parseInt(index);

    cart[itemIndex].count++;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderizarCarrinho();
    renderizarHeader();
}

function removerDoCarrinho(index) {
    const cartKey = getCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const itemIndex = parseInt(index);

    cart.splice(itemIndex, 1);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderizarCarrinho();
    renderizarHeader();
}

function finalizarCompra() {
    if (sessionStorage.getItem('isAuthenticated')) {
        window.location = '/checkout/checkout.html';
    } else {
        window.location = '/auth/login.html';
    }
}

function logout() {
    sessionStorage.clear();
    window.location = '../index.html';
}
