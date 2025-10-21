import { remove } from '../lib/remove-news-feed';
import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';
import { enableGlobalTextReplacement } from '../lib/dom-text-replacement';

// Elements here are removed from the DOM.
// These selectors should also be added to `eradicate.css`
// to ensure they're hidden before the script loads.
const elementsToRemove = [
	'.ticker_stream',
	'.ego_column',
	'#pagelet_gaming_destination_rhc',
	'#stories_pagelet_rhc',
	'#fb_stories_card_root',
	'#stories_pagelet_below_composer',
	'#pagelet_trending_tags_and_topics',
	'#pagelet_canvas_nav_content',
];

const elementsToEmpty = ['[id^=topnews_main_stream]'];

export function checkSite(): boolean {
	return !!document.querySelector('#stream_pagelet');
}

export function eradicate(store: Store) {
	let textReplacementObserver: MutationObserver | null = null;

	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		// Don't do anything if the FB UI hasn't loaded yet
		var streamContainer = document.querySelector('#stream_pagelet');
		if (streamContainer == null) {
			return;
		}

		remove({ toRemove: elementsToRemove, toEmpty: elementsToEmpty });

		// Add Flowless quote/info panel
		if (!isAlreadyInjected()) {
			injectUI(streamContainer, store);
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
