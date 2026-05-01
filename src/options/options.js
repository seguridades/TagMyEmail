const emailListDiv = document.getElementById('emailList');
const newEmailInput = document.getElementById('newEmail');
const addEmailButton = document.getElementById('addEmail');
const statusDiv = document.getElementById('status');

// Load saved values
loadEmails();

async function loadEmails() {
  const { emails = [] } = await chrome.storage.local.get('emails');
  // Migration from old baseEmail if exists
  const { baseEmail } = await chrome.storage.local.get('baseEmail');
  if (baseEmail && !emails.includes(baseEmail)) {
    emails.push(baseEmail);
    await chrome.storage.local.set({ emails });
    await chrome.storage.local.remove('baseEmail');
  }

  renderEmails(emails);
}

function renderEmails(emails) {
  emailListDiv.innerHTML = '';
  emails.forEach((email, index) => {
    const item = document.createElement('div');
    item.className = 'email-item';
    
    const input = document.createElement('input');
    input.type = 'email';
    input.value = email;
    input.readOnly = true;
    
    const btn = document.createElement('button');
    btn.className = 'remove-btn';
    btn.dataset.index = index;
    btn.textContent = '×';
    
    item.appendChild(input);
    item.appendChild(btn);
    emailListDiv.appendChild(item);
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const index = e.target.dataset.index;
      const { emails = [] } = await chrome.storage.local.get('emails');
      emails.splice(index, 1);
      await chrome.storage.local.set({ emails });
      loadEmails();
      showStatus('Correo eliminado.', 'success');
    });
  });
}

addEmailButton.addEventListener('click', async () => {
  const email = newEmailInput.value.trim();
  if (!email || !email.includes('@')) {
    showStatus('Por favor, ingresa un correo válido.', 'error');
    return;
  }

  const { emails = [] } = await chrome.storage.local.get('emails');
  if (emails.includes(email)) {
    showStatus('Este correo ya existe.', 'error');
    return;
  }

  emails.push(email);
  await chrome.storage.local.set({ emails });
  newEmailInput.value = '';
  loadEmails();
  showStatus('Correo agregado.', 'success');
});

function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.opacity = '1';

  setTimeout(() => {
    statusDiv.style.opacity = '0';
  }, 3000);
}
