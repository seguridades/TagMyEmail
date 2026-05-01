import { getSLD } from '../utils/domain.js';

const currentTagDiv = document.getElementById('currentTag');
const historyList = document.getElementById('historyList');
const toggleAbout = document.getElementById('toggleAbout');
const aboutContent = document.getElementById('aboutContent');
const openOptions = document.getElementById('openOptions');
const activeEmailSelect = document.getElementById('activeEmailSelect');

// Get current tab domain
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0] && tabs[0].url) {
    try {
      const url = new URL(tabs[0].url);
      const sld = getSLD(url.hostname);
      currentTagDiv.textContent = `+${sld}`;
    } catch (e) {
      currentTagDiv.textContent = '---';
    }
  }
});

// Load emails and handle active selection
chrome.storage.local.get(['emails', 'activeEmail'], (data) => {
  const emails = data.emails || [];
  const activeEmail = data.activeEmail || emails[0] || '';

  if (emails.length === 0) {
    activeEmailSelect.innerHTML = '<option value="">Sin correos configurados</option>';
  } else {
    activeEmailSelect.innerHTML = emails.map(email => 
      `<option value="${email}" ${email === activeEmail ? 'selected' : ''}>${email}</option>`
    ).join('');
  }

  activeEmailSelect.addEventListener('change', (e) => {
    chrome.storage.local.set({ activeEmail: e.target.value });
  });
});

// Load history
chrome.storage.local.get('history', (data) => {
  const history = data.history || [];
  if (history.length === 0) {
    historyList.innerHTML = '<li class="history-item" style="color: #555;">Sin historial aún</li>';
  } else {
    historyList.innerHTML = history
      .slice(-10)
      .reverse()
      .map(item => `
        <li class="history-item">
          <div style="display: flex; flex-direction: column;">
            <span class="history-domain">${item.domain}</span>
            <span class="history-tag" style="font-size: 10px; opacity: 0.7;">+${item.tag}</span>
          </div>
        </li>
      `).join('');
  }
});

// Toggle About
toggleAbout.addEventListener('click', () => {
  aboutContent.classList.toggle('show');
});

// Open Options
openOptions.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});
