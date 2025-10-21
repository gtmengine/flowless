import { CustomWordReplacement } from '../background/store/reducer';
import { compileRules, builtinWordReplacements, customToRules, Rule } from './word-replacement';

const IGNORE = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'CODE', 'PRE']);

/**
 * Replace text in a single text node using compiled regex rules
 */
function replaceInTextNode(node: Text, regs: Array<{ re: RegExp; replace: string }>) {
	let text = node.nodeValue || '';
	let changed = false;
	
	for (const { re, replace } of regs) {
		const next = text.replace(re, replace);
		if (next !== text) {
			text = next;
			changed = true;
		}
	}
	
	if (changed) {
		node.nodeValue = text;
	}
}

/**
 * Walk through DOM using TreeWalker to find all visible text nodes
 */
function walk(root: Node, regs: Array<{ re: RegExp; replace: string }>) {
	const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
		acceptNode: (n) => {
			const p = (n as Text).parentElement;
			if (!p) return NodeFilter.FILTER_REJECT;
			
			// Skip inputs, contentEditable, and ignored tags
			if (p.isContentEditable || IGNORE.has(p.tagName)) {
				return NodeFilter.FILTER_REJECT;
			}
			
			// Skip our extension UI elements
			if (p.closest('.nfe-quote, .nfe-info-panel, #nfe-container, #options-container')) {
				return NodeFilter.FILTER_REJECT;
			}
			
			return NodeFilter.FILTER_ACCEPT;
		}
	});
	
	// Collect all text nodes first to avoid modifying while iterating
	const nodes: Text[] = [];
	while (tw.nextNode()) {
		nodes.push(tw.currentNode as Text);
	}
	
	// Apply replacements in batch
	for (const node of nodes) {
		replaceInTextNode(node, regs);
	}
}

/**
 * Start word swap with MutationObserver for dynamic content
 */
export function enableGlobalTextReplacement(
	customReplacements: CustomWordReplacement[]
): MutationObserver {
	// Combine built-in and custom rules
	const allRules: Rule[] = [
		...builtinWordReplacements,
		...customToRules(customReplacements)
	];
	
	// Compile rules once for performance
	const regs = compileRules(allRules);
	
	// Initial walk of the page
	walk(document.body, regs);
	
	// Set up observer for dynamic content
	const mo = new MutationObserver((mutations) => {
		for (const m of mutations) {
			// Handle character data changes (text content changed)
			if (m.type === 'characterData' && m.target?.nodeType === 3) {
				replaceInTextNode(m.target as Text, regs);
				continue;
			}
			
			// Handle added nodes
			for (const node of Array.from(m.addedNodes)) {
				if (node.nodeType === 1) {
					// Element node - walk it
					walk(node, regs);
					
					// Check for shadow DOM
					const el = node as HTMLElement;
					if (el.shadowRoot) {
						walk(el.shadowRoot, regs);
					}
				} else if (node.nodeType === 3) {
					// Text node - replace directly
					replaceInTextNode(node as Text, regs);
				}
			}
		}
	});
	
	// Observe the entire document
	mo.observe(document.documentElement, {
		subtree: true,
		childList: true,
		characterData: true,
	});
	
	return mo;
}

