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
				'Flowless helps you take back control from addictive social media feeds. ' +
					'Many people find themselves unconsciously typing social media URLs into their browser, ' +
					'losing hours to endless scrolling without even realizing it.'
			),
			h(
				'p',
				'Social media platforms have perfected the art of capturing attention through their news feeds. ' +
					'While these platforms can be useful for communication, the endless feed often becomes a time sink and source of distraction.'
			),
			h(
				'p',
				'Flowless blocks these addictive feeds and replaces them with inspiring quotes, cat pictures, or a blank space - ' +
					"giving you back control of your time and attention. It's your browser, your rules."
			),
			h('p', [
				'Flowless is completely free, ',
				h(
					'a.underline-hover',
					{
						props: {
							href: 'https://github.com/gtmengine/Flowless-',
						},
					},
					'open-source'
				),
				', and will never track you or collect your data.',
			]),
		]),
		h('div.v-stack-2', [
			h('h2', 'Features'),
			h('ul', [
				h('li', 'Block feeds on Facebook, Twitter/X, Instagram, LinkedIn, Reddit, YouTube, GitHub, and Hacker News'),
				h('li', 'Replace feeds with inspiring quotes or cute cat pictures'),
				h('li', 'Custom word replacement to make social media content more interesting'),
				h('li', 'Temporary "Show feed" option when you need it'),
				h('li', 'Dark mode interface'),
				h('li', 'Complete privacy - no tracking, no data collection'),
			]),
		]),
		h('div.v-stack-2', [
			h('h2', 'Support'),
			h('p', [
				'View source code, report bugs, or contribute on ',
				h(
					'a.underline-hover',
					{
						props: {
							href: 'https://github.com/gtmengine/Flowless-',
						},
					},
					'GitHub'
				),
				'.',
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
