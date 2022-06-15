/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description view for creating fontawesome icon types dropdown
 */
import { Collection } from 'ckeditor5/src/utils';
import { Model, FormHeaderView, createDropdown, addListToDropdown } from 'ckeditor5/src/ui';

export default class FontawesomeiconTypeView extends FormHeaderView {
	constructor(locale, typenames) {
		super(locale);
		const t = locale.t;

		this.set('class', 'ck-fontawesome-type');
    this.fontawesomeTypeDropdownView = this._createFontawesomeTypeDropdown(typenames);

    this.label = t('Icon Types');

    this.children.add(this.fontawesomeTypeDropdownView);
	}

	get currentTypeName() {
		return this.fontawesomeTypeDropdownView.value;
	}

	_createFontawesomeTypeDropdown(typenames) {
		const locale = this.locale;
		const t = locale.t;
		const dropdown = createDropdown(locale);
		const fontawesomeIconTypeDefinitions = this._getFontawesomeIconTypeDefinitions(dropdown, typenames);

		dropdown.set('value', fontawesomeIconTypeDefinitions.first.model.label);

		dropdown.buttonView.bind('label').to(dropdown, 'value');

		dropdown.buttonView.set({
			isOn: false,
			withText: true,
			tooltip: t('Fontawesome icons categories'),
			class: ['ck-dropdown__button_label-width_auto'],
		});

		dropdown.on('execute', (evt) => {
			dropdown.value = evt.source.label;
		});

		dropdown.delegate('execute').to(this);

		addListToDropdown(dropdown, fontawesomeIconTypeDefinitions);

		return dropdown;
	}

	_getFontawesomeIconTypeDefinitions(dropdown, typename) {
		const typeDefs = new Collection();
		for (const name of typename) {
			const definition = {
				type: 'button',
				model: new Model({
					label: name,
					withText: true,
				}),
			};

			definition.model.bind('isOn').to(dropdown, 'value', (value) => {
				return value === definition.model.label;
			});

			typeDefs.add(definition);
		}
		return typeDefs;
	}
}
