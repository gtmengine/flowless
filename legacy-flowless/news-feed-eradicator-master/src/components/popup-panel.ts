import { Store } from '../store';
import { h } from 'snabbdom/h';
import { Sites, SiteId } from '../sites';
import {
	getSettingsHealth,
	SiteStatus,
	getSiteStatus,
	SiteStatusTag,
} from '../background/store/sites/selectors';
import { ActionType } from '../store/action-types';
import { BackgroundActionType } from '../background/store/action-types';
import { VNode } from 'snabbdom/vnode';
import { MINUTE, HOUR, DAY, readableDuration } from '../lib/time';
import { getBrowser } from '../webextension';

const DisableConfirmation = (store: Store, siteId: SiteId) => {
	const button = (
		label: string,
		until: { t: 'forever' } | { t: 'temporarily'; milliseconds: number }
	) =>
		h(
			'button.btn-time',
			{
				on: {
					click: () =>
						store.dispatch({
							type: ActionType.UI_SITES_SITE_DISABLE_CONFIRMED,
							site: siteId,
							until,
						}),
				},
			},
			label
		);

	return h('div.popup-disable-confirm.pad-1', [
		h('div.text-smaller-1.strong', `Show feed for:`),
		h('div.h-stack.popup-time-buttons', [
			button('5 min', { t: 'temporarily', milliseconds: 5 * MINUTE }),
			button('10 min', { t: 'temporarily', milliseconds: 10 * MINUTE }),
			button('30 min', { t: 'temporarily', milliseconds: 30 * MINUTE }),
			button('1 hr', { t: 'temporarily', milliseconds: HOUR }),
			button('1 day', { t: 'temporarily', milliseconds: DAY }),
			button('Permanently', { t: 'forever' }),
		]),
	]);
};

const PopupHeader = (store: Store) => {
	const state = store.getState();
	const openSettings = () => {
		getBrowser().runtime.openOptionsPage();
	};

	const toggleWordReplacement = () => {
		store.dispatch({
			type: ActionType.BACKGROUND_ACTION,
			action: {
				type: BackgroundActionType.WORD_REPLACEMENT_TOGGLE,
			},
		});
	};

	const wordReplacementEnabled = state.settings?.wordReplacementEnabled || false;

	return h('div.popup-header.pad-2.flex.justify-right.align-items-center', [
		h('div.popup-title.flex-1', 'Flowless'),
		h('button.btn-word-swap' + (wordReplacementEnabled ? '.active' : ''), {
			props: {
				title: wordReplacementEnabled ? 'Word Replacement: ON - Click to disable' : 'Word Replacement: OFF - Click to enable',
			},
			on: { click: toggleWordReplacement },
		}, [
			h('span.word-swap-icon', [
				h('span.word-swap-text', 'Aa'),
				h('span.word-swap-status', wordReplacementEnabled ? ' ✓' : ' ○'),
			]),
		]),
		h('button.btn-settings', { on: { click: openSettings } }, '⚙️'),
	]);
};

export const PopupPanel = (store: Store) => {
	const state = store.getState();
	if (state.settings == null) return null;

	const stateText = (state: SiteStatus) => {
		switch (state.type) {
			case SiteStatusTag.ENABLED:
				return h('span.text-muted.text-smaller-1', 'Active');
			case SiteStatusTag.NEEDS_NEW_PERMISSIONS:
				return h('span.col-warn.text-smaller-1', '⚠️ Needs permissions');
			case SiteStatusTag.DISABLED:
				return h('span.text-muted.text-smaller-1', 'Off');
			case SiteStatusTag.DISABLED_TEMPORARILY:
				return h(
					'span.text-muted.text-smaller-1',
					'Off for ' + readableDuration(state.until - Date.now())
				);
		}
	};

	const stateColor = (state: SiteStatus) => {
		switch (state.type) {
			case SiteStatusTag.ENABLED:
				return '.bg-active';
			case SiteStatusTag.NEEDS_NEW_PERMISSIONS:
				return '.col-bg-warn';
			case SiteStatusTag.DISABLED:
			case SiteStatusTag.DISABLED_TEMPORARILY:
				return '.bg-2';
		}
	};

	const stateIcon = (state: SiteStatus) => {
		switch (state.type) {
			case SiteStatusTag.ENABLED:
			case SiteStatusTag.NEEDS_NEW_PERMISSIONS:
				return '✓';
			case SiteStatusTag.DISABLED:
			case SiteStatusTag.DISABLED_TEMPORARILY:
				return '○';
		}
	};

	const sites = getSiteStatus(state.settings);
	const Site = (id: SiteId, label: string) => {
		const siteStatus = sites[id];

		const onClick = () => {
			store.dispatch({
				type: ActionType.UI_SITES_SITE_CLICK,
				site: id,
			});
		};

		const bgColor = stateColor(siteStatus);
		let showDisableConfirm = state.uiOptions.confirmDisableSite === id;
		return h('div.popup-site-item', [
			h(
				'button.popup-site-button.pad-1.site-grid.border.width-100pc.underline-off' +
					bgColor,
				{ on: { click: onClick } },
				[
					h('div.flex.h-stack.align-items-center', [
						h('div.popup-site-icon', stateIcon(siteStatus)),
						h('div', label),
					]),
					h('div.flex.align-items-center.justify-right', stateText(siteStatus)),
				]
			),
			showDisableConfirm ? DisableConfirmation(store, id) : null,
		]);
	};

	return h('div.popup-panel', [
		PopupHeader(store),
		h('div.popup-sites-list.v-stack', [
			...Object.keys(Sites).map((id: SiteId) => Site(id, Sites[id].label)),
		]),
	]);
};

export default PopupPanel;

