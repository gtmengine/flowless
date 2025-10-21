import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';
import { enableGlobalTextReplacement } from '../lib/dom-text-replacement';

//export function checkSite(): boolean {
//	return !!document.querySelector('#stream_pagelet');
//}

export function eradicate(store: Store) {
	let textReplacementObserver: MutationObserver | null = null;

	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		// Remove notification text from document.title (i.e. '(7)' in '(7) Facebook')
		if (document.title !== 'Facebook') {
			document.title = 'Facebook';
		}

		// Don't do anything if the FB UI hasn't loaded yet
		const feed =
			document.querySelector('#ssrb_feed_start + div') || // For home and groups feed
			document.querySelector('[data-pagelet=MainFeed]') || // For watch and marketplace feeds
			document.querySelector('div[aria-label=Gaming][role=main]') || // For gaming feed
			document.querySelector('div.x1hc1fzr.x1unhpq9.x6o7n8i'); // For new fb layout (Q4 2022)

		if (feed == null) {
			return;
		}

		const container = feed.parentNode;

		// Add Flowless quote/info panel
		if (container && !isAlreadyInjected()) {
			injectUI(container, store);
		}

		// Enable word replacement on the entire page if enabled
		if (settings.wordReplacementEnabled && !textReplacementObserver) {
			const customReplacements = settings.customWordReplacements || [];
			textReplacementObserver = enableGlobalTextReplacement(customReplacements);
		}
	}

	// This delay ensures that the elements have been created by Facebook's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
