import './styles.css';
import { getSLD } from '../utils/domain.js';

console.log('%c[TagMyEmail] Content script loaded', 'color: #00ffa3; font-weight: bold;');

const currentSLD = getSLD(window.location.hostname);
console.log(`[TagMyEmail] Current SLD: ${currentSLD}`);

/**
 * Detects email inputs and injects the TagMyEmail button.
 */
function detectAndInject() {
  const selectors = [
    'input[type="email"]',
    'input[name*="email" i]',
    'input[id*="email" i]',
    'input[autocomplete="email"]',
    'input[placeholder*="email" i]'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(injectButton);
  });
}

/**
 * Injects a button next to the given email field.
 * @param {HTMLInputElement} field 
 */
function injectButton(field) {
  if (field.dataset.tagMyEmailInjected) return;
  field.dataset.tagMyEmailInjected = 'true';

  const button = document.createElement('div');
  button.className = 'tag-my-email-button';
  button.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  `;
  button.title = `Generar etiqueta: +${currentSLD}`;

  // Position logic
  const updatePosition = () => {
    const rect = field.getBoundingClientRect();
    button.style.left = `${rect.right - 30 + window.scrollX}px`;
    button.style.top = `${rect.top + rect.height / 2 + window.scrollY}px`;
  };

  document.body.appendChild(button);
  updatePosition();

  // Update on scroll/resize
  window.addEventListener('scroll', updatePosition, true);
  window.addEventListener('resize', updatePosition);

  // Click handler
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { emails = [], activeEmail } = await chrome.storage.local.get(['emails', 'activeEmail']);
    
    if (emails.length === 0) {
      alert('Por favor, configura al menos un correo base en las opciones de la extensión.');
      chrome.runtime.sendMessage({ action: 'openOptions' });
      return;
    }

    if (emails.length === 1) {
      applyEmail(field, emails[0]);
    } else {
      showMenu(button, field, emails, activeEmail || emails[0]);
    }
  });
}

/**
 * Shows a selection menu for multiple emails.
 */
function showMenu(anchor, field, emails, active) {
  // Remove existing menu if any
  const existing = document.querySelector('.tag-my-email-menu');
  if (existing) existing.remove();

  const menu = document.createElement('div');
  menu.className = 'tag-my-email-menu';
  
  emails.forEach(email => {
    const item = document.createElement('div');
    item.className = 'tag-my-email-menu-item';
    item.textContent = email;
    if (email === active) {
      item.style.color = '#08c2e2';
      item.style.fontWeight = 'bold';
    }
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      applyEmail(field, email);
      menu.remove();
    });
    menu.appendChild(item);
  });

  document.body.appendChild(menu);
  
  const rect = anchor.getBoundingClientRect();
  menu.style.left = `${rect.right - 180 + window.scrollX}px`;
  menu.style.top = `${rect.bottom + 5 + window.scrollY}px`;

  // Close on click outside
  const close = () => {
    menu.remove();
    document.removeEventListener('click', close);
  };
  setTimeout(() => document.addEventListener('click', close), 10);
}

/**
 * Applies the tagged email to the field.
 */
async function applyEmail(field, baseEmail) {
  const sld = getSLD(window.location.hostname);
  const [user, domain] = baseEmail.split('@');
  const taggedEmail = `${user}+${sld}@${domain}`;
  
  field.value = taggedEmail;
  
  // Save to history
  const { history = [] } = await chrome.storage.local.get('history');
  const newEntry = { 
    domain: window.location.hostname, 
    tag: sld, 
    fullEmail: taggedEmail,
    date: new Date().toISOString() 
  };
  const updatedHistory = [newEntry, ...history.filter(h => h.domain !== newEntry.domain)].slice(0, 20);
  await chrome.storage.local.set({ history: updatedHistory, activeEmail: baseEmail });
  
  // Dispatch events for SPA compatibility
  field.focus();
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
  field.blur();
  
  console.log(`[TagMyEmail] Applied tagged email: ${taggedEmail}`);
}

// Initial detection
detectAndInject();

// Watch for dynamic changes
const observer = new MutationObserver(() => {
  detectAndInject();
});
observer.observe(document.body, { childList: true, subtree: true });
