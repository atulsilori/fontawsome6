/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description fontawesome UI plugin
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import fontColorIcon from './theme/icons/font-awesome.svg';
import { createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Fuse from 'fuse.js';

import FontawesomeiconTypeView from './ui/FontawesomeIconTypeView';
import FontawesomeiconsListView from './ui/FontawesomeiconsListView';
import FontawesomeiconSearchView from './ui/FontawesomeSearchIconView';
import FontawesomeiconSizeView from './ui/FontawesomeSizeView';
import FontawesomeColorView from './ui/FontawesomeColorView';
import icons from './iconsData';

import './theme/css/fontAwesome.css';

const createSearchData = () => {
	const searchData = [];
	for (const data of icons.proIcons) {
		const obj = { id: '', type: '' };
		obj.id = data;
		obj.type = 'proIcons';
		searchData.push(obj);
	}
	for (const data of icons.brandIcons) {
		const obj = { id: '', type: '' };
		obj.id = data;
		obj.type = 'brandIcons';
		searchData.push(obj);
	}
	return searchData;
};

const searchData = createSearchData();

const fuse = new Fuse(searchData, {
	keys: ['id'],
});

const typenames = icons.iconTypes;
const sizes = ['2xs', 'xs', 'sm', 'lg', 'xl', '2xl', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'];
let currenttype = 'solid';
let currentsize = 'sm';
let currentcolor = '#000000';
export default class FontAwesomeUI extends Plugin {
	constructor(editor) {
		super(editor);
	}

	static get pluginName() {
		return 'FontAwesomeUI';
	}

	init() {
		const editor = this.editor;
		const t = editor.t;
		// this.focusTracker = new FocusTracker();
		/* adding toolbar */
		editor.ui.componentFactory.add('fontAwesome', (locale) => {
			const dropdownView = createDropdown(locale); // toolbar(as a dropdown)
			let dropdownPanelContent;
			/* setting attribute of toolbar */
			dropdownView.buttonView.set({
				label: t('Font Awesome Icon'),
				icon: fontColorIcon,
				tooltip: true,
			});

			/* action on when dropdownview is open */
			dropdownView.on('change:isOpen', (evt) => {
				if (!dropdownPanelContent) {
					dropdownPanelContent = this._createDropdownPanelContent(locale, editor, dropdownView);

					dropdownView.panelView.children.add(dropdownPanelContent.fontawesomeiconSizeView);
					dropdownView.panelView.children.add(dropdownPanelContent.fontawesomeiconTypeView);
					dropdownView.panelView.children.add(dropdownPanelContent.fontawesomeiconSearchView);
					dropdownView.panelView.children.add(dropdownPanelContent.fontawesomeColorView);
					dropdownView.panelView.children.add(dropdownPanelContent.fontawesomeiconsListView);

					const colorInputView = dropdownPanelContent.fontawesomeColorView.children._items[1].colorInputView;
					const value = colorInputView.getInputValue();
					colorInputView.fire('change:parent', { value });
				} else {
					const colorInputView = dropdownPanelContent.fontawesomeColorView.children._items[1].colorInputView;
					currentcolor = colorInputView.element.value;

					dropdownPanelContent.fontawesomeiconSizeView.fontawesomeSizeDropdownView.value = 'sm';
					currentsize = 'sm';
					this._updateGrid(
						editor,
						dropdownPanelContent.fontawesomeiconsListView,
						currenttype,
						currentsize,
						icons,
					);
				}
				// colorInputView.fire('change:value', { value });
			});

			return dropdownView;
		});
	}

	focus() {
		this._focusCycler.focusFirst();
	}

	focusLast() {
		this._focusCycler.focusLast();
	}
	/**
	 * execute command
	 *
	 *@param editor editor instance
	 *@param param parameters for command
	 */
	_executeCommand(editor, param, color) {
		/**
		 * execute command having name 'fontawesome' requires parameters { value: param }
		 */
		editor.execute('fontawesome', { value: { param, color } });
		editor.editing.view.focus();
	}

	/**
    updating the iconlist grid
	 *
    @param editor editor instance
    @param fontawesomeiconsListView fontawesome icon list grid
    @param type type of icon [solid, light, ..]
    @param size size of icons
    @param items list of fontawesome icons
  */
	_updateGrid(editor, fontawesomeiconsListView, type, size, items) {
		fontawesomeiconsListView.tiles.clear();
		let ICONS = [];
		if (type === 'brands') {
			const brandIcons = items.brandIcons;
			ICONS = brandIcons;
		} else {
			const proIcons = items.proIcons;
			ICONS = proIcons;
		}

		for (const icon of ICONS) {
			const tile = fontawesomeiconsListView.createTile(icon, type, size);

			tile.on('clicked', (editorEvent, elementEvent) => {
				elementEvent.preventDefault();
				const param = editorEvent.source.template.attributes.attr;
				this._executeCommand(editor, param, currentcolor);
			});
			fontawesomeiconsListView.tiles.add(tile);
		}
	}
	/**
	 * will return diffrent content {dropdowngrid, search, typeselect} for dropdown panel
	 *
	 * @param locale
	 * @param editor editor instance
	 * @param dropdownView dropdown which will open panel which contain contents
	 */
	_createDropdownPanelContent(locale, editor, dropdownView) {
		/** contain dropdown for icon type */
		const fontawesomeiconTypeView = new FontawesomeiconTypeView(locale, typenames);

		/** contain grid for icons */
		const fontawesomeiconsListView = new FontawesomeiconsListView(locale);

		const fontawesomeColorView = new FontawesomeColorView(locale);
		fontawesomeColorView.set({ value: '#000000' });
		/** contain searchview for searching icons */
		const fontawesomeiconSearchView = new FontawesomeiconSearchView(locale);

		/** contain sizeview for icons sizes */
		const fontawesomeiconSizeView = new FontawesomeiconSizeView(locale, sizes);
		fontawesomeiconSizeView.fontawesomeSizeDropdownView.value = 'sm';

		/** propagate event to plugin dropdownView */
		fontawesomeiconsListView.delegate('execute').to(dropdownView);

		this._updateGrid(editor, fontawesomeiconsListView, currenttype, currentsize, icons);

		/** fire event when search input changed */
		fontawesomeiconSearchView.iconSearch.on('input', (evt) => {
			const data = fontawesomeiconSearchView.iconSearch.element.value;
			const result = fuse.search(data);
			const items = { proIcons: [], brandIcons: [] };

			for (const searchItem of result) {
				if (searchItem.item.type === 'brandIcons') {
					items.brandIcons.push(searchItem.item.id);
				} else {
					items.proIcons.push(searchItem.item.id);
				}
			}

			if (result.length === 0) {
				if (currenttype === 'brands') {
					items.brandIcons = icons.brandIcons;
				} else {
					items.proIcons = icons.proIcons;
				}
				this._updateGrid(editor, fontawesomeiconsListView, currenttype, currentsize, items);
			} else {
				this._updateGrid(editor, fontawesomeiconsListView, currenttype, currentsize, items);
			}
		});

		// fontawesomeColorView.fontawesomeColorDropdownView.colorInputView.on('change:value', (evt) => {
		// 	if (fontawesomeColorView.fontawesomeColorDropdownView.colorPicker) {
		// 		currentcolor = fontawesomeColorView.fontawesomeColorDropdownView.colorPicker.valueElement.value;
		// 	}
		// 	this._updateGrid(editor, fontawesomeiconsListView, currenttype, currentsize, icons);
		// });

		/** fire event when type dropdown opened */
		fontawesomeiconTypeView.fontawesomeTypeDropdownView.on('execute', (evt) => {
			currenttype = evt.source.label;
			fontawesomeiconSearchView.iconSearch.element.value = '';
			this._updateGrid(editor, fontawesomeiconsListView, currenttype, currentsize, icons);
		});

		fontawesomeiconSizeView.fontawesomeSizeDropdownView.on('execute', (evt) => {
			currentsize = evt.source.label;
			fontawesomeiconSearchView.iconSearch.element.value = '';
			this._updateGrid(editor, fontawesomeiconsListView, currenttype, currentsize, icons);
		});

		return {
			fontawesomeiconTypeView,
			fontawesomeiconSearchView,
			fontawesomeiconsListView,
			fontawesomeiconSizeView,
			fontawesomeColorView,
		};
	}
}
