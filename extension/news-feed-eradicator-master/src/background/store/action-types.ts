import { SettingsState, DisplayMode } from './reducer';
import { Permissions } from '../../webextension';
import { SiteId } from '../../sites';
import { Settings } from '.';

export enum BackgroundActionType {
	QUOTES_SHOW_TOGGLE = 'QUOTES_SHOW_TOGGLE',
	QUOTES_BUILTIN_TOGGLE = 'QUOTES_BUILTIN_TOGGLE',
	QUOTE_HIDE = 'QUOTE_HIDE',
	QUOTE_SHOW = 'QUOTE_SHOW',
	QUOTE_HIDDEN_RESET = 'QUOTE_HIDDEN_RESET',
	QUOTE_DELETE = 'QUOTE_DELETE',
	QUOTE_ADD = 'QUOTE_ADD',
	FEATURE_INCREMENT = 'FEATURE_INCREMENT',
	SETTINGS_LOAD = 'SETTINGS_LOAD',
	SETTINGS_LOADED = 'SETTINGS_LOADED',
	PERMISSIONS_CHECK = 'permissions/check',
	PERMISSIONS_UPDATE = 'permissions/update',
	SITES_SET_STATE = 'sites/set_state',
	CONTENT_SCRIPTS_REGISTER = 'content_scripts/register',
	WORD_REPLACEMENT_TOGGLE = 'WORD_REPLACEMENT_TOGGLE',
	WORD_REPLACEMENT_ADD = 'WORD_REPLACEMENT_ADD',
	WORD_REPLACEMENT_DELETE = 'WORD_REPLACEMENT_DELETE',
	DISPLAY_MODE_SET = 'DISPLAY_MODE_SET',
}

export type BackgroundActionObject =
	| FeatureIncrement
	| QuotesShowToggle
	| QuotesBuiltinToggle
	| QuoteHide
	| QuoteShow
	| QuoteDelete
	| QuoteAdd
	| QuoteHiddenReset
	| SettingsLoad
	| SettingsLoaded
	| PermissionsCheck
	| PermissionsUpdate
	| SitesSetState
	| ContentScriptsRegister
	| WordReplacementToggle
	| WordReplacementAdd
	| WordReplacementDelete
	| DisplayModeSet;

export type FeatureIncrement = { type: BackgroundActionType.FEATURE_INCREMENT };

export type QuotesShowToggle = {
	type: BackgroundActionType.QUOTES_SHOW_TOGGLE;
};

export type QuotesBuiltinToggle = {
	type: BackgroundActionType.QUOTES_BUILTIN_TOGGLE;
};

export type QuoteHide = {
	type: BackgroundActionType.QUOTE_HIDE;
	id: number;
};
export type QuoteShow = {
	type: BackgroundActionType.QUOTE_SHOW;
	id: number;
};
export type QuoteDelete = {
	type: BackgroundActionType.QUOTE_DELETE;
	id: string;
};

export type QuoteAdd = {
	type: BackgroundActionType.QUOTE_ADD;
	id: string;
	text: string;
	source: string;
};

export type QuoteHiddenReset = {
	type: BackgroundActionType.QUOTE_HIDDEN_RESET;
};

export type SettingsLoad = { type: BackgroundActionType.SETTINGS_LOAD };
export type SettingsLoaded = {
	type: BackgroundActionType.SETTINGS_LOADED;
	settings: SettingsState;
};

export type PermissionsCheck = {
	type: BackgroundActionType.PERMISSIONS_CHECK;
};
export type PermissionsUpdate = {
	type: BackgroundActionType.PERMISSIONS_UPDATE;
	permissions: Permissions;
};
export type SitesSetState = {
	type: BackgroundActionType.SITES_SET_STATE;
	siteId: SiteId;
	state: Settings.SiteState;
};
export type ContentScriptsRegister = {
	type: BackgroundActionType.CONTENT_SCRIPTS_REGISTER;
};
export type WordReplacementToggle = {
	type: BackgroundActionType.WORD_REPLACEMENT_TOGGLE;
};
export type WordReplacementAdd = {
	type: BackgroundActionType.WORD_REPLACEMENT_ADD;
	id: string;
	from: string;
	to: string;
};
export type WordReplacementDelete = {
	type: BackgroundActionType.WORD_REPLACEMENT_DELETE;
	id: string;
};
export type DisplayModeSet = {
	type: BackgroundActionType.DISPLAY_MODE_SET;
	mode: DisplayMode;
};
