/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description view for creating fontawesome icon grid
 */
import { View } from 'ckeditor5/src/ui';

import IconView from './IconView';

export default class FontawesomeiconsListView extends View {
	constructor(locale) {
		super(locale);
		this._locale = locale;
		this.tiles = this.createCollection(); // creates a collection - when array of elements required in view
		/** creates a template of html **/
		this.setTemplate({
			tag: 'div',
			children: [
				{
					tag: 'div',
					children: this.tiles,
					attributes: {
						class: ['ck-fontawesome-container'],
					},
				},
			],
			attributes: {
				class: ['ck-fontawesome-grid'],
			},
		});
	}

	render() {
		super.render(); // for rendering custom view in in plugin
	}

	createTile(icon, type, size) {
		const template = new IconView(this._locale, icon, type, size);
		return template;
	}
}
