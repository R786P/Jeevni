// Initialize Supabase
const supabaseUrl = 'https://ntmhbmegmkkpdugxexhi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bWhibWVnbWtrcGR1Z3hleGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NzYwNjYsImV4cCI6MjA3NzA1MjA2Nn0.BYxR_qvH7KzIlLgsQ2Xv6fLHzgSrF7BF5y7ZFW2BXMQ';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// All code inside one DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const navItems = document.querySelectorAll('.nav-item, .nav-mobile-item');
    const tabs = document.querySelectorAll('.content-tab');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Update active state for desktop nav
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });

            // Update active state for mobile nav
            document.querySelectorAll('.nav-mobile-item').forEach(nav => {
                nav.classList.remove('active');
            });

            // Add active class to clicked item
            this.classList.add('active');

            // Show selected tab
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });

            document.getElementById(tabId).classList.add('active');

            // If switching to "Stories" tab, load stories
            if (tabId === 'stories') {
                loadStories();
            }
        });
    });

    // Hero buttons also trigger tab changes
    document.querySelectorAll('.btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            document.querySelector(`.nav-item[data-tab="${tabId}"]`).click();
        });
    });

    // Story Form Submission
    const storyForm = document.getElementById('storyForm');
    storyForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const title = document.getElementById('storyTitle').value;
        const category = document.getElementById('storyCategory').value;
        const content = document.getElementById('storyContent').value;
        const anonymous = document.getElementById('anonymousPost').checked;

        const author = anonymous ? 'अनाम' : 'आप';

        if (title && content) {
            const { error } = await supabase.from('stories').insert({
                title,
                category,
                content,
                author,
                created_at: new Date().toISOString()
            });

            if (error) {
                alert('कहानी सबमिट करने में त्रुटि: ' + error.message);
            } else {
                alert('कहानी सफलतापूर्वक प्रकाशित की गई! धन्यवाद आपकी कहानी साझा करने के लिए।');
                storyForm.reset();
                document.querySelector('.nav-item[data-tab="stories"]').click();
            }
        }
    });

    // AI Chat Functionality
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    const aiResponses = {
        'दुखी': 'मैं जानता हूँ आप दुखी महसूस कर रहे हैं। कृपया याद रखें कि आप अकेले नहीं हैं। समय सभी घाव भर देता है।',
        'हार': 'हार मानना आसान है, लेकिन उठकर फिर से कोशिश करना वीरता है। आप मजबूत हैं!',
        'प्रेरणा': 'यहाँ एक प्रेरणादायक उद्धरण है: "सूरज हर रोज नए सिरे से उगता है, आप भी नई शुरुआत कर सकते हैं।"',
        'रोना': 'रोना कमजोरी नहीं है। आँसू भी एक तरह की प्रार्थना होते हैं। आपकी भावनाएँ वैध हैं।',
        'अकेलापन': 'अकेलापन कठिन हो सकता है, लेकिन यह आपको अपने आप से जुड़ने का मौका देता है।'
    };

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'message-user' : 'message-ai');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatInput.value = '';

        // Simple AI response logic
        let aiReply = 'धन्यवाद आपके शब्दों के लिए। आपकी भावनाएँ महत्वपूर्ण हैं।';
        if (message.includes('दुखी')) aiReply = aiResponses['दुखी'];
        else if (message.includes('हार')) aiReply = aiResponses['हार'];
        else if (message.includes('प्रेरणा')) aiReply = aiResponses['प्रेरणा'];
        else if (message.includes('रो')) aiReply = aiResponses['रोना'];
        else if (message.includes('अकेला')) aiReply = aiResponses['अकेलापन'];

        setTimeout(() => addMessage(aiReply), 500);
    });

    // Quick buttons
    document.querySelectorAll('.quick-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const msg = this.getAttribute('data-message');
            chatInput.value = msg;
            chatForm.dispatchEvent(new Event('submit'));
        });
    });

    // Load stories on page load for Home tab
    loadStories();

    // Search and filter functionality
    const searchInput = document.getElementById('searchStories');
    const categoryFilter = document.getElementById('categoryFilter');
    const storiesGridAll = document.getElementById('storiesGridAll');

    // Add event listeners for search and filter
    searchInput.addEventListener('input', debounce(loadFilteredStories, 300));
    categoryFilter.addEventListener('change', loadFilteredStories);

    async function loadFilteredStories() {
        let query = supabase.from('stories').select('*').order('created_at', { ascending: false });

        const searchTerm = searchInput.value.trim();
        const category = categoryFilter.value;

        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`);
        }

        if (category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) {
            console.error('Error filtering stories:', error);
            storiesGridAll.innerHTML = '<p>कहानियाँ लोड करने में त्रुटि हुई।</p>';
        } else {
            displayStories(data, 'storiesGridAll');
        }
    }

    // Debounce function to limit API calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Load all stories for Stories tab
    async function loadAllStories() {
        const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('Error loading all stories:', error);
            document.getElementById('storiesGridAll').innerHTML = '<p>सभी कहानियाँ लोड करने में त्रुटि हुई।</p>';
        } else {
            displayStories(data, 'storiesGridAll');
        }
    }

    // Display stories in a container
    function displayStories(stories, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = ''; // Clear existing stories

        if (stories.length === 0) {
            container.innerHTML = '<p>अभी तक कोई कहानी नहीं है। पहली कहानी आप लिखें!</p>';
            return;
        }

        stories.forEach(story => {
            const card = document.createElement('div');
            card.className = 'story-card';
            card.innerHTML = `
                <div class="story-content">
                    <div>
                        <span class="story-category">${story.category}</span>
                        <span class="story-date">${new Date(story.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 class="story-title">${story.title}</h3>
                    <p class="story-excerpt">${story.content.substring(0, 100)}${story.content.length > 100 ? '...' : ''}</p>
                    <div class="story-meta">
                        <span>लेखक: ${story.author}</span>
                        <div class="story-actions">
                            <div class="story-action">
                                <span>❤️</span>
                                <span>0</span>
                            </div>
                            <div class="story-action">
                                <span></span>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Load stories from Supabase
    async function loadStories() {
        const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false }).limit(3);
        if (error) {
            console.error('Error loading stories:', error);
            document.getElementById('storiesGrid').innerHTML = '<p>कहानियाँ लोड करने में त्रुटि हुई।</p>';
        } else {
            displayStories(data, 'storiesGrid');
        }
    }
});
