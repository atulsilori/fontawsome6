/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description FontawesomeColorPicker view for fontawesomeplugin
 */
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import { View, LabelView } from 'ckeditor5/src/ui';

import ColorInputView from './ColorInputView';
// import TestInputView from './testview';

const closeButtonLabel = 'Select color';

export default class FontawesomeColorPickerView extends View {
	constructor(locale) {
		super(locale);
		this.items = this.createCollection();

		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();
		this._focusCycler = new FocusCycler({
			focusables: this.items,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate list items backwards using the Arrow Up key.
				focusPrevious: 'arrowup',
				// Navigate list items forwards using the Arrow Down key.
				focusNext: 'arrowdown',
			},
		});

		this.setTemplate({
			tag: 'div',
			attributes: {
				class: ['ck', 'ck-color-table'],
			},
			children: this.items,
		});
		this.colorInputView = this._createColorInputView(closeButtonLabel);
		this.items.add(this.colorInputView);
	}

	render() {
		super.render();

		// Items added before rendering should be known to the #focusTracker.
		for (const item of this.items) {
			this.focusTracker.add(item.element);
		}
		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo(this.element);
	}

	focus() {
		this._focusCycler.focusFirst();
	}

	focusLast() {
		this._focusCycler.focusLast();
	}

	_createLabel(text) {
		const labelView = new LabelView(this.locale);
		labelView.text = text;
		labelView.extendTemplate({
			attributes: {
				class: ['ck', 'ck-color-grid__label'],
			},
		});
		return labelView;
	}

	_createColorInputView(closeButtonLabel) {
		const colorInputView = new ColorInputView(this.locale, closeButtonLabel);
		colorInputView.on('blur', () => {
			let value = colorInputView.getInputValue();
			colorInputView.fire('change:parent');
			colorInputView.fire('change:value');
		});
		return colorInputView;
	}
}
