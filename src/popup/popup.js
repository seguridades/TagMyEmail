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

  activeEmailSelect.innerHTML = '';
  if (emails.length === 0) {
    const opt = document.createElement('option');
    opt.value = "";
    opt.textContent = "Sin correos configurados";
    activeEmailSelect.appendChild(opt);
  } else {
    emails.forEach(email => {
      const opt = document.createElement('option');
      opt.value = email;
      opt.textContent = email;
      if (email === activeEmail) opt.selected = true;
      activeEmailSelect.appendChild(opt);
    });
  }

  activeEmailSelect.addEventListener('change', (e) => {
    chrome.storage.local.set({ activeEmail: e.target.value });
  });
});

// Load history
chrome.storage.local.get('history', (data) => {
  const history = data.history || [];
  historyList.innerHTML = '';
  if (history.length === 0) {
    const li = document.createElement('li');
    li.className = "history-item";
    li.style.color = "#555";
    li.textContent = "Sin historial aún";
    historyList.appendChild(li);
  } else {
    history
      .slice(-10)
      .reverse()
      .forEach(item => {
        const li = document.createElement('li');
        li.className = "history-item";
        
        const div = document.createElement('div');
        div.style.display = "flex";
        div.style.flexDirection = "column";
        
        const spanDomain = document.createElement('span');
        spanDomain.className = "history-domain";
        spanDomain.textContent = item.domain;
        
        const spanTag = document.createElement('span');
        spanTag.className = "history-tag";
        spanTag.style.fontSize = "10px";
        spanTag.style.opacity = "0.7";
        spanTag.textContent = `+${item.tag}`;
        
        div.appendChild(spanDomain);
        div.appendChild(spanTag);
        li.appendChild(div);
        historyList.appendChild(li);
      });
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
