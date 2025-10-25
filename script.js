// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
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
    storyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('storyTitle').value;
        const category = document.getElementById('storyCategory').value;
        const content = document.getElementById('storyContent').value;
        const anonymous = document.getElementById('anonymousPost').checked;

        if (title && content) {
            alert('कहानी सफलतापूर्वक प्रकाशित की गई! धन्यवाद आपकी कहानी साझा करने के लिए।');
            storyForm.reset();
            document.querySelector('.nav-item[data-tab="stories"]').click();
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
});
