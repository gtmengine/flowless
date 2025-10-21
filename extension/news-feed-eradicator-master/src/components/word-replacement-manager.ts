import { h } from 'snabbdom/h';
import { Store } from '../store/index';
import { ActionType } from '../store/action-types';
import { BackgroundActionType } from '../background/store/action-types';
import { CustomWordReplacement } from '../background/store/reducer';
import { generateID } from '../lib/generate-id';
import { builtinWordReplacements } from '../lib/word-replacement';

export const WordReplacementManager = (store: Store) => {
	const state = store.getState();

	if (state.settings == null) {
		return null;
	}

	const customReplacements = state.settings.customWordReplacements || [];

	const CustomReplacementRow = (replacement: CustomWordReplacement) => {
		const deleteReplacement = (id: string) => () => {
			store.dispatch({
				type: ActionType.BACKGROUND_ACTION,
				action: {
					type: BackgroundActionType.WORD_REPLACEMENT_DELETE,
					id,
				},
			});
		};

		return h('tr', [
			h('td.pad-1', replacement.from),
			h('td.pad-1', replacement.to),
		h('td.pad-1', [
			h(
				'a.underline-hover',
				{
					on: { click: deleteReplacement(replacement.id) },
				},
				'Delete'
			),
		]),
		]);
	};

	const BuiltinReplacementRow = (from: string, to: string) => {
		return h('tr', [
			h('td.pad-1.text-muted', from),
			h('td.pad-1.text-muted', to),
			h('td.pad-1.text-muted', 'Built-in'),
		]);
	};

	const AddReplacementForm = () => {
		const onAdd = () => {
			// Use setTimeout to ensure we're reading after the DOM is updated
			requestAnimationFrame(() => {
				const fromInput = document.querySelector(
					'#word-replacement-from'
				) as HTMLInputElement;
				const toInput = document.querySelector(
					'#word-replacement-to'
				) as HTMLInputElement;

				if (!fromInput || !toInput) {
					console.error('Inputs not found');
					return;
				}

				const fromValue = fromInput.value.trim();
				const toValue = toInput.value.trim();

				if (!fromValue || !toValue) {
					return;
				}

				store.dispatch({
					type: ActionType.BACKGROUND_ACTION,
					action: {
						type: BackgroundActionType.WORD_REPLACEMENT_ADD,
						id: generateID(),
						from: fromValue,
						to: toValue,
					},
				});

				// Clear the inputs
				fromInput.value = '';
				toInput.value = '';
			});
		};

		return h('div.v-stack-2.pad-2.bg-3.shadow', [
			h('h3', 'Add Custom Word Replacement'),
			h('div.v-stack', [
				h('label.inline-block.strong', 'Replace this word:'),
				h('input.pad-1.width-100pc', {
					props: {
						type: 'text',
						placeholder: 'e.g., blockchain',
						id: 'word-replacement-from',
					},
				}),
			]),
			h('div.v-stack', [
				h('label.inline-block.strong', 'With this word:'),
				h('input.pad-1.width-100pc', {
					props: {
						type: 'text',
						placeholder: 'e.g., magic beans',
						id: 'word-replacement-to',
					},
				}),
			]),
			h('button.bg-active', { on: { click: onAdd } }, 'Add Replacement'),
		]);
	};

	const builtinExamples = [
		['AI', 'cocaine'],
		['artificial intelligence', 'cocaine'],
		['machine learning', 'cocaine'],
		['neural network', 'cocaine network'],
		['LLM', 'cocaine'],
		['large language model', 'cocaine'],
	];

	return h('div.v-stack-2', [
		h('h3', 'Word Replacements'),
		h(
			'p',
			'Add your own word replacements below. All matches are case-insensitive.'
		),
		h('table.border.scrollable-table', [
			h('thead', [
				h('tr', [
					h('th.pad-1', 'Replace'),
					h('th.pad-1', 'With'),
					h('th.pad-1', ''),
				]),
			]),
			h('tbody', [
				...customReplacements.map(CustomReplacementRow),
				...builtinExamples.map(([from, to]) => BuiltinReplacementRow(from, to)),
				customReplacements.length === 0
					? h('tr', [
							h('td.pad-1.text-muted', { attrs: { colspan: '3' } }, [
								h('em', 'No custom word replacements added yet. '),
								h('span', 'Built-in replacements shown below.'),
							]),
					  ])
					: null,
			]),
		]),
		AddReplacementForm(),
	]);
};

export default WordReplacementManager;

