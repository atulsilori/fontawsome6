/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description view for creating fontawesome icon size dropdown
 */
 import { Collection } from 'ckeditor5/src/utils';
 import { Model, FormHeaderView, createDropdown, addListToDropdown } from 'ckeditor5/src/ui';

 export default class FontawesomeiconSizeView extends FormHeaderView {
   constructor(locale, typenames) {
     super(locale);
     const t = locale.t;

     this.set('class', 'ck-fontawesome-size');
     this.fontawesomeSizeDropdownView = this._createFontawesomeSizeDropdown(typenames);

     this.label = t('Icon Sizes');

     this.children.add(this.fontawesomeSizeDropdownView);
   }

   get currentTypeName() {
     return this.fontawesomeSizeDropdownView.value;
   }

   _createFontawesomeSizeDropdown(typenames) {
     const locale = this.locale;
     const t = locale.t;
     const dropdown = createDropdown(locale);
     const fontawesomeIconSizeDefinitions = this._getFontawesomeIconSizeDefinitions(dropdown, typenames);

     dropdown.set('value', fontawesomeIconSizeDefinitions.first.model.label);

     dropdown.buttonView.bind('label').to(dropdown, 'value');

     dropdown.buttonView.set({
       isOn: false,
       withText: true,
       tooltip: t('Fontawesome Size categories'),
       class: ['ck-dropdown__button_label-width_auto'],
     });

     dropdown.on('execute', (evt) => {
       dropdown.value = evt.source.label;
     });

     dropdown.delegate('execute').to(this);

     addListToDropdown(dropdown, fontawesomeIconSizeDefinitions);

     return dropdown;
   }

   _getFontawesomeIconSizeDefinitions(dropdown, typename) {
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
