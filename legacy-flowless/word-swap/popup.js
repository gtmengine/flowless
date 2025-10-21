// Built-in replacements (for display only)
const builtinReplacements = [
  { pattern: 'AI', replace: 'cocaine' },
  { pattern: 'machine learning', replace: 'cocaine' },
  { pattern: 'neural network', replace: 'cocaine network' }
];

// Load and display replacements
function loadReplacements() {
  chrome.storage.sync.get(['customReplacements'], (result) => {
    const customReplacements = result.customReplacements || [];
    displayReplacements(customReplacements);
  });
}

// Display replacements in the list
function displayReplacements(customReplacements) {
  const list = document.getElementById('replacementList');
  list.innerHTML = '';

  // Show custom replacements first
  if (customReplacements.length === 0 && builtinReplacements.length === 0) {
    list.innerHTML = '<div class="empty-state">No replacements yet. Add one above!</div>';
    return;
  }

  // Custom replacements
  customReplacements.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'replacement-item';
    div.innerHTML = `
      <div class="replacement-text">
        <span class="replacement-pattern">${escapeHtml(item.pattern)}</span>
        <span class="replacement-arrow">→</span>
        <span>${escapeHtml(item.replace)}</span>
      </div>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    list.appendChild(div);
  });

  // Built-in replacements (for reference)
  builtinReplacements.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'replacement-item builtin';
    div.innerHTML = `
      <div class="replacement-text">
        <span class="replacement-pattern">${escapeHtml(item.pattern)}</span>
        <span class="replacement-arrow">→</span>
        <span>${escapeHtml(item.replace)}</span>
      </div>
      <span class="builtin-label">Built-in</span>
    `;
    list.appendChild(div);
  });

  // Add delete event listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      deleteReplacement(index);
    });
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add new replacement
document.getElementById('add').addEventListener('click', () => {
  const pattern = document.getElementById('pattern').value.trim();
  const replace = document.getElementById('replace').value.trim();

  if (!pattern || !replace) {
    alert('Please fill in both fields');
    return;
  }

  chrome.storage.sync.get(['customReplacements'], (result) => {
    const customReplacements = result.customReplacements || [];
    customReplacements.push({ pattern, replace });
    
    chrome.storage.sync.set({ customReplacements }, () => {
      document.getElementById('pattern').value = '';
      document.getElementById('replace').value = '';
      loadReplacements();
      
      // Notify all tabs to refresh replacements
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.reload(tab.id);
        });
      });
    });
  });
});

// Delete replacement
function deleteReplacement(index) {
  chrome.storage.sync.get(['customReplacements'], (result) => {
    const customReplacements = result.customReplacements || [];
    customReplacements.splice(index, 1);
    
    chrome.storage.sync.set({ customReplacements }, () => {
      loadReplacements();
      
      // Notify all tabs to refresh replacements
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.reload(tab.id);
        });
      });
    });
  });
}

// Handle Enter key in input fields
document.getElementById('pattern').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('replace').focus();
  }
});

document.getElementById('replace').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('add').click();
  }
});

// Load replacements on popup open
loadReplacements();

