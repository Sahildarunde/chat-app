let socket;
let username;

function toggleForm() {
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const toggleButton = document.getElementById('toggle-form');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        toggleButton.textContent = 'Go to Register';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        toggleButton.textContent = 'Go to Login';
    }
}

function login() {
    const loginUsername = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: loginUsername, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Login failed');
        }
    })
    .then(data => {
        if (data.token) {
            username = loginUsername;
            document.getElementById('login').style.display = 'none';
            document.getElementById('register').style.display = 'none';
            document.getElementById('chat').style.display = 'block';
            document.getElementById('logout').style.display = 'block';
            document.getElementById('toggle-form').style.display = 'none';
            connectWebSocket(data.token, username);
        } else {
            alert('Login failed');
        }
    })
    .catch(error => alert(error.message));
}

function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Registration failed');
        }
    })
    .then(data => {
        if (data.message === 'User registered successfully') {
            alert('Registration successful! Please log in.');
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-email').value = '';
        } else {
            alert('Registration failed');
        }
    })
    .catch(error => alert(error.message));
}

function connectWebSocket(token, username) {
    socket = new WebSocket(`ws://localhost:3000?token=${token}`);
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        displayMessage(message);
    };
}

function sendMessage() {
    const message = document.getElementById('message').value;
    socket.send(JSON.stringify({ message, username }));
    document.getElementById('message').value = '';
}

function displayMessage(message) {
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', message.username === username ? 'sent' : 'received');

    const headerElement = document.createElement('div');
    headerElement.classList.add('message-header');

    const profileElement = document.createElement('span');
    profileElement.classList.add('profile');
    const imgElement = document.createElement('img');
    imgElement.src = './images/picture.jpeg';
    profileElement.appendChild(imgElement);

    const activeElement = document.createElement('span');
    activeElement.classList.add('active');

    const usernameElement = document.createElement('span');
    usernameElement.classList.add('username');
    usernameElement.textContent = message.username;

    const timestampElement = document.createElement('span');
    timestampElement.classList.add('timestamp');
    timestampElement.textContent = message.timestamp;

    headerElement.appendChild(profileElement);
    headerElement.appendChild(usernameElement);
    headerElement.appendChild(activeElement);
    headerElement.appendChild(timestampElement);


    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content');
    contentElement.textContent = message.message;

    messageElement.appendChild(headerElement);
    messageElement.appendChild(contentElement);
    messages.appendChild(messageElement);

    messages.scrollTop = messages.scrollHeight;
}

function logout() {
    socket.close();
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'none';
    document.getElementById('chat').style.display = 'none';
    document.getElementById('logout').style.display = 'none';
    document.getElementById('toggle-form').style.display = 'block';
    username = null;
}
