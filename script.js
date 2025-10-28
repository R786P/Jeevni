// Supabase Initialization
const supabaseUrl = 'YOUR_SUPABASE_URL_HERE';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log('Supabase initialized');

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const patientList = document.getElementById('patient-list');

// Show/Hide Sections
function showSection(section) {
    loginSection.classList.add('hidden');
    dashboardSection.classList.add('hidden');
    section.classList.remove('hidden');
}

// Login Function
async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        console.log('Login successful:', data);
        showSection(dashboardSection);
        loadPatients();
        return data;
    } catch (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
        return null;
    }
}

// Signup Function  
async function signup(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        console.log('Signup successful:', data);
        alert('Signup successful! Please check your email for verification.');
        return data;
    } catch (error) {
        console.error('Signup error:', error.message);
        alert('Signup failed: ' + error.message);
        return null;
    }
}

// Load Patients
async function loadPatients() {
    try {
        const { data: patients, error } = await supabase
            .from('patients')
            .select('*');
            
        if (error) throw error;
        
        patientList.innerHTML = '';
        patients.forEach(patient => {
            const patientDiv = document.createElement('div');
            patientDiv.className = 'patient-card';
            patientDiv.innerHTML = `
                <h3>${patient.name}</h3>
                <p>Age: ${patient.age}</p>
                <p>Condition: ${patient.condition}</p>
            `;
            patientList.appendChild(patientDiv);
        });
    } catch (error) {
        console.error('Error loading patients:', error.message);
    }
}

// Logout Function
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        showSection(loginSection);
    } catch (error) {
        console.error('Logout error:', error.message);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
            showSection(dashboardSection);
            loadPatients();
        } else {
            showSection(loginSection);
        }
    });

    // Login button
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            login(email, password);
        });
    }

    // Signup button  
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            signup(email, password);
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
