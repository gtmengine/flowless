import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';
import { enableGlobalTextReplacement } from '../lib/dom-text-replacement';

export function checkSite(): boolean {
	return window.location.host.includes('youtube.com');
}

export function eradicate(store: Store) {
	let textReplacementObserver: MutationObserver | null = null;

	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		// Don't do anything if the UI hasn't loaded yet
		const feed = document.querySelector('#primary');

		if (feed == null) {
			return;
		}

		const container = feed;

		// Add Flowless quote/info panel
		if (container && !isAlreadyInjected()) {
			// Hack so that injectUI can handle dark theme
			document.body.style.background = 'var(--yt-spec-general-background-a)';

			injectUI(container, store);
		}

		// Enable word replacement on the entire page if enabled
		if (settings.wordReplacementEnabled && !textReplacementObserver) {
			const customReplacements = settings.customWordReplacements || [];
			textReplacementObserver = enableGlobalTextReplacement(customReplacements);
		}
	}

	// This delay ensures that the elements have been created before we attempt
	// to replace them
	setInterval(eradicateRetry, 1000);
}
