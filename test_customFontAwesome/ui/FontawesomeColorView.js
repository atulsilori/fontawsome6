/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description FontawesomeColor view for fontawesomeplugin
 */
import { Model, FormHeaderView, createDropdown, addListToDropdown } from 'ckeditor5/src/ui';

// import FontawesomeColorPickerView from './FontawesomeColor/FontawesomeColorPickerView';
import ColorInputView from './FontawesomeColor/ColorInputView';

const closeButtonLabel = 'Select color';
export default class FontawesomeColorView extends FormHeaderView {
	constructor(locale) {
		super(locale);
		const t = locale.t;
		this.set('class', 'ck-fontawesome-color');
		this.colorInputView = this._createColorInputView(closeButtonLabel);
		// const fontawesomeColorPickerView = new FontawesomeColorPickerView(locale);
		// this.fontawesomeColorDropdownView = fontawesomeColorPickerView;
		console.log('this.children -- ', this.children);
		this.label = t('Color Picker');
		this.children.add(this.colorInputView);
	}

	render() {
		super.render();
	}

	_createColorInputView(closeButtonLabel) {
		const colorInputView = new ColorInputView(this.locale, closeButtonLabel);
		console.log('colorInputView -- ', colorInputView);
		colorInputView.on('blur', () => {
			let value = colorInputView.getInputValue();
			colorInputView.fire('change:parent');
			colorInputView.fire('change:value');
		});
		return colorInputView;
	}
}
