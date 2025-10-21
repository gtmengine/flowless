import { h } from 'snabbdom/h';
import { currentQuote } from '../store/selectors';
import {
	removeCurrentQuote,
	selectNewQuote,
	menuHide,
	menuToggle,
	showOptions,
} from '../store/actions';
import { Store } from '../store';
import { ActionObject } from '../store/action-types';

const MenuItem = (store: Store, action: ActionObject, children: string) => {
	const onClick = (e: Event) => {
		e.preventDefault();
		store.dispatch(menuHide());
		store.dispatch(action);
	};

	return h('li.margin-0.pad-0', [
		h(
			'a.nfe-quote-action-menu-item.underline-off',
			{ on: { click: onClick } },
			children
		),
	]);
};

const QuoteMenu = (store: Store) => {
	return h('div.nfe-quote-action-menu-content', [
		h('ul.margin-0.pad-0.list-unstyled', [
			MenuItem(store, removeCurrentQuote(), 'Remove this quote'),
			MenuItem(store, selectNewQuote(), 'See another quote'),
			MenuItem(store, showOptions(), 'Settings...'),
		]),
	]);
};

const QuoteDisplay = (store: Store) => {
	const state = store.getState();
	const displayMode = state.settings?.displayMode || 'quotes';

	// If display mode is blank, show nothing
	if (displayMode === 'blank') {
		return h('div.nfe-quote', []);
	}

	// If display mode is cats, show random cat image
	if (displayMode === 'cats') {
		return h('div.nfe-quote.nfe-cats-container', [
			h('img.nfe-cat-image', {
				props: {
					src: `https://cataas.com/cat?${Date.now()}`,
					alt: 'Random cat',
				},
			}),
		]);
	}

	// Otherwise show quotes (default)
	const quote = currentQuote(state);

	if (quote == null) return null;

	// Keep quotes original - no replacements
	const displayText = quote.text;
	const displaySource = quote.source;

	const toggleMenu = (e: MouseEvent) => {
		e.preventDefault();
		store.dispatch(menuToggle());
	};
	
	return h('div.nfe-quote', [
		h('nfe-quote-action-menu', [
			h(
				'a.nfe-quote-action-menu-button',
				{ on: { click: toggleMenu } },
				'▾'
			),
			state.isQuoteMenuVisible ? QuoteMenu(store) : null,
		]),

		h('div', [
			h('p.nfe-quote-text', [
				h('span', '"'),
				h('span', displayText),
				h('span', '"'),
			]),
			h('p.nfe-quote-source', [h('span', '~ '), h('span', displaySource)]),
		]),
	]);
};

export default QuoteDisplay;
