import { createStore } from '../store/index';
import './popup.css';
import { init } from 'snabbdom';
import { h } from 'snabbdom/h';
import propsModule from 'snabbdom/modules/props';
import attrsModule from 'snabbdom/modules/attributes';
import eventsModule from 'snabbdom/modules/eventlisteners';
import { toVNode } from 'snabbdom/tovnode';
import PopupPanel from '../components/popup-panel';
import { ActionType } from '../store/action-types';
import { BackgroundActionType } from '../background/store/action-types';
import { SECOND } from '../lib/time';

const store = createStore();

export function start(container: Node | null) {
	if (container == null) {
		throw new Error('Root element not found');
	}

	var popupContainer = document.createElement('div');
	popupContainer.id = 'popup-container';
	container.appendChild(popupContainer);

	const patch = init([propsModule, attrsModule, eventsModule]);

	let vnode = toVNode(popupContainer);

	store.dispatch({
		type: ActionType.BACKGROUND_ACTION,
		action: {
			type: BackgroundActionType.FEATURE_INCREMENT,
		},
	});

	const render = () => {
		const newVnode = h('div#popup-container', [PopupPanel(store)]);

		patch(vnode, newVnode);
		vnode = newVnode;
	};
	store.subscribe(render);

	// Force re-render to update time remaining
	setInterval(() => {
		render();
	}, 30 * SECOND);

	render();
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
	start(document.getElementById('popup-app'));
});

