
// Supabase Initialization
const supabaseUrl = 'https://your-project.supabase.co'; // YAHAN APNA URL DALO
const supabaseKey = 'your-anon-key-here'; // YAHAN APNA KEY DALO
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log('Supabase initialized');

// DOM Elements
const contentTabs = document.querySelectorAll('.content-tab');
const navItems = document.querySelectorAll('.nav-item, .nav-mobile-item');

// Tab Navigation
function showTab(tabId) {
    // Hide all tabs
    contentTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Update nav items
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Activate corresponding nav item
    const activeNavItems = document.querySelectorAll(`[data-tab="${tabId}"]`);
    activeNavItems.forEach(item => {
        item.classList.add('active');
    });
    
    // Load content based on tab
    if (tabId === 'stories') {
        loadStories();
    }
}

// Load Stories from Supabase
async function loadStories() {
    try {
        const { data: stories, error } = await supabase
            .from('stories')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        const storiesGrid = document.getElementById('storiesGridAll') || document.getElementById('storiesGrid');
        if (storiesGrid) {
            storiesGrid.innerHTML = '';
            
            stories.forEach(story => {
                const storyCard = document.createElement('div');
                storyCard.className = 'story-card';
                storyCard.innerHTML = `
                    <h3>${story.title}</h3>
                    <span class="story-category">${story.category}</span>
                    <p>${story.content.substring(0, 150)}...</p>
                    <div class="story-footer">
                        <span class="story-date">${new Date(story.created_at).toLocaleDateString('hi-IN')}</span>
                    </div>
                `;
                storiesGrid.appendChild(storyCard);
            });
        }
    } catch (error) {
        console.error('Error loading stories:', error.message);
    }
}

// Submit Story Form
async function submitStory(event) {
    event.preventDefault();
    
    const title = document.getElementById('storyTitle').value;
    const category = document.getElementById('storyCategory').value;
    const content = document.getElementById('storyContent').value;
    const anonymous = document.getElementById('anonymousPost').checked;
    
    try {
        const { data, error } = await supabase
            .from('stories')
            .insert([
                {
                    title: title,
                    category: category,
                    content: content,
                    anonymous: anonymous,
                    created_at: new Date().toISOString()
                }
            ]);
            
        if (error) throw error;
        
        alert('कहानी सफलतापूर्वक प्रकाशित हुई!');
        document.getElementById('storyForm').reset();
        showTab('stories');
        
    } catch (error) {
        console.error('Error submitting story:', error.message);
        alert('कहानी प्रकाशित करने में त्रुटि: ' + error.message);
    }
}

// AI Chat Simulation
function simulateAIResponse(userMessage) {
    const responses = {
        'मैं बहुत दुखी हूँ': 'मैं समझ सकता हूँ कि आप दुखी हैं। यह महसूस करना पूरी तरह से सामान्य है। क्या आप मुझे बता सकते हैं कि आप क्या महसूस कर रहे हैं?',
        'मुझे प्रेरणा चाहिए': 'जीवन में उतार-चढ़ाव आते रहते हैं, लेकिन यह याद रखें कि हर सुबह नई शुरुआत लेकर आती है। आप मजबूत हैं और आप यह कर सकते हैं!',
        'मैं हार मान रहा हूँ': 'कृपया हार न मानें। आपने अब तक जो संघर्ष किया है, वह आपकी ताकत को दर्शाता है। छोटे-छोटे कदमों से आगे बढ़ते रहें।',
        'मैं अकेला महसूस कर रहा हूँ': 'आप अकेले नहीं हैं। हम यहाँ आपके लिए हैं। कभी-कभी दूसरों से बात करना मददगार हो सकता है। क्या आप किसी मित्र या परिवार के सदस्य से बात कर सकते हैं?'
    };
    
    return responses[userMessage] || 'मैं आपकी भावनाओं को समझने की कोशिश कर रहा हूँ। क्या आप और अधिक विस्तार से बता सकते हैं कि आप क्या महसूस कर रहे हैं?';
}

// Handle Chat Messages
function handleChatMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message message-user';
    userMessageDiv.textContent = message;
    chatMessages.appendChild(userMessageDiv);
    
    // Simulate AI thinking
    setTimeout(() => {
        const aiResponse = simulateAIResponse(message);
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message message-ai';
        aiMessageDiv.textContent = aiResponse;
        chatMessages.appendChild(aiMessageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Tab Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });
    
    // Story Form Submission
    const storyForm = document.getElementById('storyForm');
    if (storyForm) {
        storyForm.addEventListener('submit', submitStory);
    }
    
    // Chat Form Submission
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const chatInput = document.getElementById('chatInput');
            if (chatInput.value.trim()) {
                handleChatMessage(chatInput.value.trim());
                chatInput.value = '';
            }
        });
    }
    
    // Quick Chat Buttons
    const quickButtons = document.querySelectorAll('.quick-button');
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            handleChatMessage(message);
        });
    });
    
    // Hero Buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });
    
    // Load initial stories
    loadStories();
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});
