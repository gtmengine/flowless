// Default word replacements (always active)
const defaultReplacements = [
  { pattern: 'AI', replace: 'cocaine' },
  { pattern: 'artificial intelligence', replace: 'cocaine' },
  { pattern: 'machine learning', replace: 'cocaine' },
  { pattern: 'neural network', replace: 'cocaine network' },
  { pattern: 'LLM', replace: 'cocaine' },
  { pattern: 'large language model', replace: 'cocaine' }
];

let customReplacements = [];
let allReplacements = [...defaultReplacements];

// Load custom replacements from storage
chrome.storage.sync.get(['customReplacements'], (result) => {
  if (result.customReplacements) {
    customReplacements = result.customReplacements;
    allReplacements = [...defaultReplacements, ...customReplacements];
    replaceTextInPage();
  }
});

// Listen for changes to replacements
chrome.storage.onChanged.addListener((changes) => {
  if (changes.customReplacements) {
    customReplacements = changes.customReplacements.newValue || [];
    allReplacements = [...defaultReplacements, ...customReplacements];
    replaceTextInPage();
  }
});

// Replace text in a text node
function replaceInTextNode(node) {
  let text = node.nodeValue;
  let modified = false;

  allReplacements.forEach(({ pattern, replace }) => {
    // Create regex with word boundaries and case insensitive
    const regex = new RegExp(`\\b${escapeRegex(pattern)}\\b`, 'gi');
    if (regex.test(text)) {
      text = text.replace(regex, replace);
      modified = true;
    }
  });

  if (modified) {
    node.nodeValue = text;
  }
}

// Escape special regex characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Walk through DOM and replace text
function walkNodes(node) {
  // Skip script, style, and input elements
  if (node.nodeType === Node.ELEMENT_NODE) {
    const tagName = node.tagName.toLowerCase();
    if (['script', 'style', 'noscript', 'iframe', 'input', 'textarea', 'code', 'pre'].includes(tagName)) {
      return;
    }
  }

  if (node.nodeType === Node.TEXT_NODE) {
    replaceInTextNode(node);
  } else {
    for (let child of node.childNodes) {
      walkNodes(child);
    }
  }
}

// Replace text in entire page
function replaceTextInPage() {
  walkNodes(document.body);
}

// Initial replacement
replaceTextInPage();

// Watch for dynamic content changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        replaceInTextNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        walkNodes(node);
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

