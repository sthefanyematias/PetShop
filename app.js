let CART = "";
let PATH = '/data/products.json'; 

function mostrarFeedback(title, message, type = 'success', actions = [{ text: 'OK', action: 'close' }]) {
    const overlay = document.getElementById('custom-modal-overlay');
    const content = document.getElementById('custom-modal-content');
    
    if (!overlay || !content) {
        console.log(`Modal não encontrado no DOM. Mensagem: ${title} - ${message}`);
        return;
    }

    content.innerHTML = `
        <h3 id="modal-title">${title}</h3>
        <p id="modal-message">${message}</p>
        <div id="modal-actions" class="modal-actions-container"></div>
    `;

    content.style.backgroundColor = type === 'error' ? 'var(--white)' : 'var(--primary-color)';
    content.style.color = type === 'error' ? 'var(--text-color)' : 'var(--white)';
    
    content.querySelector('#modal-title').style.color = type === 'error' ? 'var(--primary-color)' : 'inherit';
    content.querySelector('#modal-message').style.color = type === 'error' ? 'var(--text-color)' : 'inherit';

    const actionsContainer = document.getElementById('modal-actions');
    
    actions.forEach(actionObj => {
        const button = document.createElement('button');
        button.textContent = actionObj.text;

        let btnClass = 'btn modal-btn';
        if (type === 'success') {
            btnClass += ' btn-modal-success-inverted'; 
        } else if (type === 'error') {
            btnClass += ' btn-modal-error-default';
        }
        
        button.className = `${btnClass} ${actionObj.className || ''}`;

        button.onclick = () => {
            overlay.style.display = 'none';
            
            if (actionObj.action === 'close') {
            } else if (actionObj.action === 'login') {
                window.location = '/auth/login.html';
            } else if (actionObj.action === 'signup') {
                window.location = '/auth/signup.html';
            } else if (typeof actionObj.action === 'function') {
                actionObj.action();
            }
        };
        actionsContainer.appendChild(button);
    });

    overlay.style.display = 'flex';
}

function atualizarContadorSacola() {
    const basketSpan = document.getElementById('basket');
    if (sessionStorage.getItem('isAuthenticated')) {
        let currUserId = sessionStorage.getItem('currUserId');
        let currentUserCartKey = 'cart_' + currUserId;
        let cartItems = JSON.parse(localStorage.getItem(currentUserCartKey) || "[]");
        let count = cartItems.reduce((total, item) => total + item.count, 0); 
        
        if (basketSpan) {
            basketSpan.innerHTML = count;
        }
    } else {
        if (basketSpan) basketSpan.innerHTML = 0;
    }
}

function modificarQuantidade(prodId, delta, buttonElement) {
    const controlGroup = buttonElement.closest('.quantity-control-group');
    const inputElement = controlGroup ? controlGroup.querySelector(`#quant-${prodId}`) : null;

    if (!inputElement) return;

    let currentValue = parseInt(inputElement.value);
    let newValue = currentValue + delta;

    if (newValue >= 1) {
        inputElement.value = newValue;
    }
}

function verificarUsuario() {
    const loginBtn = document.getElementById('loginButton');
    const signupBtn = document.getElementById('signupButton');
    const userInfoContainer = document.getElementById('userInfoContainer');
    const saudacaoElement = document.getElementById('saudacaoNome'); 

    if(sessionStorage.getItem('isAuthenticated')) {
        const userName = sessionStorage.getItem('currUserName');

        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userInfoContainer) userInfoContainer.style.display = 'flex';
        
        if (saudacaoElement) {
            saudacaoElement.innerHTML = `
                <span style="color: var(--primary-color); font-weight: normal;">Olá,</span>
                <span style="color: var(--text-color); margin-left: 5px; font-weight: bold;">${userName}</span>
            `;
        }
        
        atualizarContadorSacola();

    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (userInfoContainer) userInfoContainer.style.display = 'none';

        atualizarContadorSacola(); 
        
        loadJSON(PATH);
    };
    exibirTodosProdutos();
}

function loadJSON(PATH) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                localStorage.setItem('products', JSON.stringify(data));
            } else {
                mostrarFeedback('Erro de Rede', 'Não foi possível carregar os produtos. Verifique o caminho.', 'error');
            }
        }
    };
    xhr.open('GET', PATH, true);
    xhr.send();
}

function irParaCarrinho() {
    if(sessionStorage.getItem('isAuthenticated')) {
        window.location = '/cart/cart.html'; 
    } else {
        mostrarFeedback(
            "Quase Lá!", 
            "Você precisa estar logado(a) para acessar sua sacola.", 
            'error', 
            [
                { text: 'Entrar', action: 'login', className: 'btn-entrar-modal' },
                { text: 'Cadastrar', action: 'signup', className: 'btn-cadastrar-modal' }
            ]
        );
    }
}

function exibirTodosProdutos() { renderizarProdutos(); }
function filtrarCaes() { renderizarProdutos('caes'); }
function filtrarGatos() { renderizarProdutos('gatos'); }
function filtrarPassaros() { renderizarProdutos('bird'); }
function filtrarHamsters() { renderizarProdutos('hamster'); }

function renderizarProdutos(cat) {
    let productContainer = document.getElementById('product-container');
    if (!productContainer) return; 
    
    productContainer.innerHTML = "";
    let data = JSON.parse(localStorage.getItem('products') || "[]");

    let filteredData = data.filter(item => { return !cat || item.category === cat; });
    
    if (filteredData.length === 0 && cat) {
           productContainer.innerHTML = `<p style="text-align: center; width: 100%; padding: 30px;">
                                             Nenhum produto encontrado para esta categoria.
                                           </p>`;
        return;
    }


    filteredData.forEach(item => {
        const imageUrl = item.imageURL.startsWith('img/') ? item.imageURL : 'img/' + item.imageURL;
        const priceDisplay = item.price.replace('.', ',');

        productContainer.innerHTML += `
            <div class="product-item">
                <div class="prod-image">
                    <img src="${imageUrl}" alt="${item.name}">
                </div>
                <div class="prod-data" >
                    <span id="prod-title">${item.name}</span>
                    <span id="prod-price">R$ ${priceDisplay}</span>
                    <p id="prod-description">${item.description}</p>
                    
                    <div class="purchase-action-group">
                        
                        <div class="quantity-control-group">
                            <button type="button" class="btn-quant-control minus" onclick="modificarQuantidade('${item.id}', -1, this)">-</button>
                            <input type="text" id="quant-${item.id}" class="quant-input-display" value="1" readonly>
                            <button type="button" class="btn-quant-control plus" onclick="modificarQuantidade('${item.id}', 1, this)">+</button>
                        </div>
                        
                        <button class="btn btn-comprar-alinhado" id="add-to-cart-${item.id}" type="button" 
                            onclick="adicionarAoCarrinho('${item.id}', document.getElementById('quant-${item.id}'))">
                            Comprar
                        </button>
                        
                    </div>
                    
                </div>
            </div>
        `;
    });
}

function adicionarAoCarrinho(prodId, inputElement) {
    const quantidadeDesejada = parseInt(inputElement.value);

    if(sessionStorage.getItem('isAuthenticated')) {
        let currUserId = sessionStorage.getItem('currUserId');
        let currentUserCartKey = 'cart_' + currUserId;
        CART = JSON.parse(localStorage.getItem(currentUserCartKey) || "[]");
        
        let existingItem = CART.find(item => item.id === prodId);

        if(existingItem) {
            existingItem.count += quantidadeDesejada;
        } else {
            CART.push({"id": prodId, "count": quantidadeDesejada});
        }
        
        localStorage.setItem(currentUserCartKey, JSON.stringify(CART));

        const buttonElement = inputElement.closest('.prod-data').querySelector(`#add-to-cart-${prodId}`);
        if (buttonElement) {
            buttonElement.classList.add('clicked-animation');
            setTimeout(() => {
                buttonElement.classList.remove('clicked-animation');
            }, 300);
        }
        
        inputElement.value = 1;

        atualizarContadorSacola(); 

    } else {
        mostrarFeedback(
            "Acesso Necessário", 
            "Você precisa fazer login para adicionar itens à sacola.", 
            'error', 
            [
                { text: 'Entrar', action: 'login', className: 'btn-entrar-modal' },
                { text: 'Cadastrar', action: 'signup', className: 'btn-cadastrar-modal' }
            ]
        );
    }
}

function logout() {
    sessionStorage.clear();
    window.location = '../index.html'
}

function handleNewsletterSubscription(event) {
    event.preventDefault(); 
    
    const emailInput = document.getElementById('newsletter-email-input');
    const email = emailInput.value.trim();

    if (!email) {
        mostrarFeedback(
            "Atenção", 
            "Por favor, insira um endereço de e-mail válido.", 
            'error'
        );
        return;
    }

    let newsletterEmails = JSON.parse(localStorage.getItem('newsletterEmails') || "[]");

    if (newsletterEmails.includes(email)) {
         mostrarFeedback(
            "Já Cadastrado", 
            "Este e-mail já está inscrito em nossa newsletter. Obrigado!", 
            'error' 
        );
        emailInput.value = '';
        return;
    }
    
    newsletterEmails.push(email);
    localStorage.setItem('newsletterEmails', JSON.stringify(newsletterEmails));

    mostrarFeedback(
        "🎉 Cadastro Efetuado!", 
        "Seu e-mail foi cadastrado com sucesso! Você receberá ofertas exclusivas e novidades dos seus Aumigos.", 
        'success', 
        [
            { text: 'Fechar', action: 'close', className: 'btn-fechar-modal' }
        ]
    );

    emailInput.value = ''; 
}