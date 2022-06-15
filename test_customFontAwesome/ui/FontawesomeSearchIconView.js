/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description view for creating fontawesome icon searchbox
 */

import { InputTextView, FormHeaderView } from 'ckeditor5/src/ui';

export default class FontawesomeiconSearchView extends FormHeaderView {
	constructor(locale) {
		super(locale);
		const t = locale.t;

		this.set('class', 'ck-fontawesome-search');

		this.iconSearch = this._createIconSearchView(this.locale);
		this.label = t('Icon Search');
		this.children.add(this.iconSearch);
	}

	_createIconSearchView(locale) {
		const searchbox = new InputTextView(locale);
		return searchbox;
	}
}
