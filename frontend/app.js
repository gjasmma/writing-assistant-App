// Register event listeners for login and signup
document.getElementById('loginButton').addEventListener('click', loginUser);
document.getElementById('registerButton').addEventListener('click', registerUser);
document.getElementById('toggleToSignup').addEventListener('click', toggleToSignup);
document.getElementById('toggleToLogin').addEventListener('click', toggleToLogin);
const saveButton = document.getElementById('saveButton');
const textArea = document.getElementById('textInput');
const logoutButton = document.getElementById('logoutButton');

// Check if the user is logged in on page load
checkIfLoggedIn();

// Handle login
async function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            checkIfLoggedIn();  // Update UI after login
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

// Handle registration
async function registerUser() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! You can now log in.');
            toggleToLogin();  // Switch to login form
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
}

// Toggle to SignUp form
function toggleToSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

// Toggle to Login form
function toggleToLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Check if the user is logged in (token in localStorage)
function checkIfLoggedIn() {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('loginForm').style.display = 'none';  // Hide login form
        document.getElementById('signupForm').style.display = 'none';  // Hide sign up form
        document.getElementById('loggedInStatus').innerText = 'You are logged in!';
        document.getElementById('logoutButton').style.display = 'block'; // Show logout button
        document.getElementById('saveButton').style.display = 'block'; // Show save button
    } else {
        document.getElementById('loggedInStatus').innerText = 'Please log in.';
        document.getElementById('logoutButton').style.display = 'none'; // Hide logout button
        document.getElementById('saveButton').style.display = 'none'; // Hide save button
    }
}

// Send text for grammar/style improvements
const response = await fetch('http://localhost:5000/api/improve-text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({ text })
});

const data = await response.json();
if (response.ok) {
  console.log('Improved text:', data.improvedText);
  console.log('Suggestions:', data.suggestions);
} else {
  alert('Failed to improve text');
}


// Handle logout process
function logoutUser() {
    localStorage.removeItem('token');
    alert('You have logged out!');
    checkIfLoggedIn();  // Update UI after logout
}

// Add event listener for logout
logoutButton.addEventListener('click', logoutUser);