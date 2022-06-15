/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description Iconview for rendering icons
 */
import { View } from 'ckeditor5/src/ui';
import icons from '../iconsData';

const fontFamily = icons.fontFamilies;
export default class IconView extends View {
	constructor(locale, icon, type, size) {
		super(locale);
		const bind = this.bindTemplate;
		const fontfamily = fontFamily[type];
		/** creates a template of html **/
		this.setTemplate({
			tag: 'button',
			attributes: {
				class: ['fa-' + type, 'fa-' + icon, 'ck-font-button'],
				style: `font-family: '${fontfamily}';`,
				attr: ['fa-' + type, 'fa-' + icon, 'fa-' + size],
			},
			on: {
				// Views listen to DOM events and propagate them.
				click: bind.to('clicked'),
			},
		});
	}
	render() {
		super.render();
	}
}
