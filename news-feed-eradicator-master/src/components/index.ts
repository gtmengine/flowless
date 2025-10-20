import QuoteDisplay from './quote-display';
import { Store } from '../store';
import { h } from 'snabbdom/h';
import { ActionType } from '../store/action-types';

const NewsFeedEradicator = (store: Store) => {
	const state = store.getState();

	// TODO: Add quotes component
	const quoteDisplay = state.settings?.showQuotes ? QuoteDisplay(store) : null;

	// Entire app component
	return h('div', [quoteDisplay]);
};

export default NewsFeedEradicator;
