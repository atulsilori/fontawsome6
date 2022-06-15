/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description colorinput view
 */

import View from '@ckeditor/ckeditor5-ui/src/view';
import { jscolor } from '../jscolor';

const JsColorOptions = {
	hash: true,
	borderRadius: 2,
	borderWidth: 0,
	padding: 8,
	uppercase: false,
	closable: true,
	width: 150,
	buttonHeight: 24,
};

export default class ColorInputView extends View {
	constructor(locale, closeButtonLabel) {
		super(locale);

		const bind = this.bindTemplate;

		this.closeButtonLabel = closeButtonLabel;

		this.set('value');
		this.set('parent');

		this.setTemplate({
			tag: 'input',
			attributes: {
				class: ['ck', 'ck-color-input'],
			},
			on: {
				blur: bind.to('blur'),
			},
		});
	}

	setInputValue(newValue) {
		const value = !newValue ? '#000000' : newValue;
		if (this.colorPicker) {
			this.colorPicker.fromString(value);
		} else if (this.element) {
			this.element.value = value;
		}
	}

	getInputValue() {
		if (this.colorPicker) {
			return this.colorPicker.toHEXString();
		} else if (this.element) {
			return this.element.value;
		}
	}

	render() {
		super.render();
		this.on('change:value', (evt) => {
			const value = evt.source.element.value;
			this.setInputValue(value);
		});

		this.on('change:parent', (evt) => {
			const value = evt.source.element.value;
			let options = Object.assign({}, JsColorOptions, {
				closeText: this.closeButtonLabel,
				container: value,
			});
			if (!this.colorPicker) {
				this.colorPicker = new jscolor(this.element, options);
			}
			this.setInputValue(value);
		});
	}
}
