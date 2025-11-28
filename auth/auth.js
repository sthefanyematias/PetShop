
/**
 * @param {string} title
 * @param {string} message
 * @param {string} type
 * @param {Array<Object>} actions
 */

function mostrarFeedback(title, message, type = 'success', actions = [{ text: 'OK', action: 'close' }]) {
    const overlay = document.getElementById('custom-modal-overlay');
    const content = document.getElementById('custom-modal-content');

    if (!overlay || !content) {
        window.alert(message);
        return;
    }

    content.innerHTML = `
        <h3 id="modal-title">${title}</h3>
        <p id="modal-message">${message}</p>
        <div id="modal-actions" class="modal-actions-container"></div>
    `;

    content.style.backgroundColor = type === 'error' ? 'var(--white)' : 'var(--primary-color)';
    content.style.color = type === 'error' ? 'var(--text-color)' : 'var(--white)';
    content.querySelector('#modal-title').style.color = type === 'error' ? '#f44336' : 'inherit';
    content.querySelector('#modal-message').style.color = type === 'error' ? 'var(--text-color)' : 'inherit';
    const actionsContainer = document.getElementById('modal-actions');

    actions.forEach(actionObj => {
        const button = document.createElement('button');
        button.textContent = actionObj.text;
        button.className = `btn modal-btn ${actionObj.className || ''}`;
        button.onclick = () => {
            overlay.style.display = 'none';

            if (actionObj.action === 'login') {
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

class User {
    constructor(id, name, email, password, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}

function realizarCadastro() {
    let id = Math.floor(Math.random() * 1000000);
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let name = firstName + " " + lastName;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let role = 'user';

    let newUser = new User(id, name, email, password, role);
    let userCart = "cart_" + newUser.id;

    let users = JSON.parse(localStorage.getItem('Users') || "[]");

    if (users.some(u => u.email === email)) {
        mostrarFeedback(
            "Erro de Cadastro",
            "Este e-mail já está cadastrado. Tente fazer login.",
            'error',
            [{ text: 'Fazer Login', action: 'login' }]
        );
        return;
    }

    users.push(newUser);
    localStorage.setItem('Users', JSON.stringify(users));
    localStorage.setItem(userCart, JSON.stringify([]));
    sessionStorage.setItem('currUserName', firstName);
    sessionStorage.setItem('currUserId', id);
    sessionStorage.setItem('currUserEmail', email);
    sessionStorage.setItem('isAuthenticated', true);

    mostrarFeedback("Bem-vindo!", "Cadastro realizado com sucesso!.");
    setTimeout(() => {
        window.location = '/';
    }, 1000);
}

function realizarLogin() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let users = JSON.parse(localStorage.getItem('Users') || "[]");
    let user = null;
    let isAuthUser = false;

    for (let i = 0; i < users.length; i++) {
        user = users[i];
        if (user.email === email && user.password === password) {
            isAuthUser = true;
            break;
        }
    }

    if (isAuthUser) {
        sessionStorage.setItem('currUserName', user.name.split(' ')[0]);
        sessionStorage.setItem('currUserId', user.id);
        sessionStorage.setItem('currUserEmail', user.email);
        sessionStorage.setItem('isAuthenticated', true);

        mostrarFeedback("Sucesso!", `Bem-vindo de volta, ${user.name.split(' ')[0]}!`, 'success');
        setTimeout(() => {
            window.location = '/'
        }, 1000);

    } else {
        mostrarFeedback(
            "Erro de Acesso",
            "Usuário não cadastrado, e-mail ou senha inválidos. Tente novamente.",
            'error',
            [{ text: 'OK', action: 'close' }]
        );
    }
}