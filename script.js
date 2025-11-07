// ====== 1. Supabase क्लाइंट ======
const supabaseUrl = 'https://ntmhbmegmkkpdugxexhi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bWhibWVnbWtLcGR1Z3hleGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5NTg0NTEsImV4cCI6MjA0NjUzNDQ1MX0.zv1J2rR3nXx0Qq3cJ4x8eQ6mD9q7KjJvL7W6qLmYdJU';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// ====== 2. टैब स्विचिंग ======
function switchTab(tabId) {
  document.querySelectorAll('.content-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-item, .nav-mobile-item').forEach(item => item.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

document.querySelectorAll('[data-tab]').forEach(item => {
  item.addEventListener('click', (e) => {
    const tab = e.currentTarget.dataset.tab;
    switchTab(tab);
    
    // अगर "कहानियाँ" टैब है, तो कहानियाँ लोड करें
    if (tab === 'stories') {
      loadAllStories();
    } else if (tab === 'home') {
      loadRecentStories();
    }
  });
});

// ====== 3. कहानियाँ लोड करने के फंक्शन ======

async function loadRecentStories() {
  const { data, error } = await supabase
    .from('Jeevni')
    .select('title, category, content, Author')
    .order('id', { ascending: false })
    .limit(3);

  if (error) {
    console.error('हाल की कहानियाँ लोड नहीं हो पाईं:', error);
    return;
  }

  const container = document.getElementById('storiesGrid');
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p class="no-stories">अभी तक कोई कहानी नहीं है। पहले आप अपनी कहानी साझा करें!</p>';
    return;
  }

  data.forEach(story => {
    const div = document.createElement('div');
    div.classList.add('story-card');
    div.innerHTML = `
      <h3>${story.title}</h3>
      <p class="story-category">${story.category}</p>
      <p class="story-author">लेखक: ${story.Author || 'अज्ञात'}</p>
      <p class="story-excerpt">${story.content.substring(0, 100)}${story.content.length > 100 ? '...' : ''}</p>
    `;
    container.appendChild(div);
  });
}

async function loadAllStories() {
  const { data, error } = await supabase
    .from('Jeevni')
    .select('title, category, content, Author')
    .order('id', { ascending: false });

  if (error) {
    console.error('सभी कहानियाँ लोड नहीं हो पाईं:', error);
    return;
  }

  const container = document.getElementById('storiesGridAll');
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p class="no-stories">अभी तक कोई कहानी नहीं है।</p>';
    return;
  }

  data.forEach(story => {
    const div = document.createElement('div');
    div.classList.add('story-card');
    div.innerHTML = `
      <h3>${story.title}</h3>
      <p class="story-category">${story.category}</p>
      <p class="story-author">लेखक: ${story.Author || 'अज्ञात'}</p>
      <p class="story-content">${story.content}</p>
    `;
    container.appendChild(div);
  });
}

// ====== 4. कहानी सबमिट फॉर्म ======
document.getElementById('storyForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('storyTitle').value;
  const category = document.getElementById('storyCategory').value;
  const content = document.getElementById('storyContent').value;
  const isAnonymous = document.getElementById('anonymousPost').checked;

  const author = isAnonymous ? 'अज्ञात' : 'आप';

  const { error } = await supabase.from('Jeevni').insert({
    title,
    category,
    content,
    Author: author
  });

  if (error) {
    alert('कहानी जमा नहीं हो सकी। कृपया दोबारा कोशिश करें।');
    console.error('त्रुटि:', error);
  } else {
    alert('आपकी कहानी सफलतापूर्वक जमा हो गई! धन्यवाद 🙏');
    document.getElementById('storyForm').reset();
    if (document.getElementById('home').classList.contains('active')) {
      loadRecentStories();
    }
  }
});

// ====== 5. पेज लोड होने पर होम टैब की कहानियाँ लोड करें ======
document.addEventListener('DOMContentLoaded', () => {
  loadRecentStories();
});
