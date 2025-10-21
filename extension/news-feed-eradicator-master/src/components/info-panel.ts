import { h } from 'snabbdom/h';
import QuoteOptions from './quote-options';
import ReplaceOptions from './replace-options';
import { Store } from '../store';
import { UiOptionsTabShow, ActionType } from '../store/action-types';
import { SitesOptions } from './sites-options';

const Heading = () => {
	return h('h3.text-center', 'Flowless');
};

const Footer = () => {
	return null;
};

const About = () => {
	return h('div.v-stack-2', [
		h('div.v-stack-2', [
			h('h2', 'About'),
			h(
				'p',
				'Flowless was born in 2012 in a bout of procrastination. I first noticed that ' +
					"I wasn't in control of my own mind when I found myself typing " +
					'"facebook.com" into the address bar unconsciously.'
			),
			h(
				'p',
				'Though I was forced to use Facebook for my studies, I realised I just had to find a way to reduce its addictive power over me. ' +
					'The number one thing that felt so addictive about it was the news feed.'
			),
			h(
				'p',
				"In recent years, we've seen the news feed proliferate across all sort of apps thanks to " +
					"its addictive power over users. I think it's long overdue that we as users take that power back."
			),
			h(
				'p',
				'Flowless is and always will be free and open-source, and will never track you.'
			),
		]),
		h('div.v-stack-2', [
			h('h2', 'Support'),
			h(
				'p',
				"If Flowless has saved you time or mental energy and you'd like to help out, here's how you can do so:"
			),
			h('ul', [
				h('li', 'Tell your friends about it'),
				h('li', [
					'Report or fix bugs via ',
					h(
						'a.underline-hover',
						{
							props: {
								href: 'https://github.com/gtmengine/Flowless-',
							},
						},
						'GitHub'
					),
				]),
			]),
		]),
	]);
};

const CurrentTab = (store: Store) => {
	const tab = store.getState().uiOptions.tab;
	switch (tab) {
		case 'sites':
			return SitesOptions(store);
		case 'quotes':
			return QuoteOptions(store);
		case 'replace':
			return ReplaceOptions(store);
		case 'about':
			return About();
	}
};

const InfoPanel = (store: Store) => {
	const state = store.getState();

	const visitTab = (id: UiOptionsTabShow['tab']) => () =>
		store.dispatch({
			type: ActionType.UI_OPTIONS_TAB_SHOW,
			tab: id,
		});
	const Tab = (id: UiOptionsTabShow['tab'], label: string) =>
		state.uiOptions.tab === id
			? h('a.strong.text-larger-1', label)
			: h(
					'a.underline-hover.text-larger-1',
					{ on: { click: visitTab(id) } },
					label
			  );

	return h('div.nfe-info-panel', [
		h('div.nfe-info-col.v-stack-4', [
			Heading(),
			h('div.flex.justify-center.h-stack-2', [
				Tab('sites', 'Sites'),
				Tab('quotes', 'Quotes'),
				Tab('replace', 'Replace'),
				Tab('about', 'About'),
			]),

			h('div.shadow-mid.bg-1.pad-3', [CurrentTab(store)]),
			Footer(),
		]),
	]);
};

export default InfoPanel;
