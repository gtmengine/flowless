import { h } from 'snabbdom/h';
import { Store } from '../store';
import { ActionType } from '../store/action-types';
import { BackgroundActionType } from '../background/store/action-types';
import WordReplacementManager from './word-replacement-manager';

const CheckboxField = (
	store: Store,
	checked: boolean,
	text: string,
	toggleAction: any
) => {
	return h('label', [
		h('input', {
			props: {
				type: 'checkbox',
				checked,
			},
			on: {
				change: () => store.dispatch(toggleAction),
			},
		}),
		h('span', ' ' + text),
	]);
};

const ReplaceOptions = (store: Store) => {
	const state = store.getState();
	if (state.settings == null) {
		return null;
	}

	const fieldWordReplacement = CheckboxField(
		store,
		state.settings.wordReplacementEnabled,
		'Enable Word Replacement',
		{
			type: ActionType.BACKGROUND_ACTION,
			action: {
				type: BackgroundActionType.WORD_REPLACEMENT_TOGGLE,
			},
		}
	);

	return h('div.nfe-settings', [
		h('div.v-stack-2', [
			h('h2', 'Word Replacement'),
			h('p', [
				h('span', 'Replace words across social media sites in real-time. '),
				h('span', 'Built-in replacements and custom word pairs work on Twitter/X, Instagram, YouTube, LinkedIn, Reddit, GitHub, and Hacker News.'),
			]),
			h('div.v-stack-2', [
				h('div', fieldWordReplacement),
			]),
			state.settings.wordReplacementEnabled
				? h('div.v-stack-2', [
						h('h3', 'Manage Word Replacements'),
						WordReplacementManager(store),
				  ])
				: h('div.col-bg-warn.pad-2', [
						h('p', [
							h('strong', 'Word Replacement is disabled. '),
							h('span', 'Enable it above to start replacing words on social media.'),
						]),
				  ]),
		]),
	]);
};

export default ReplaceOptions;

