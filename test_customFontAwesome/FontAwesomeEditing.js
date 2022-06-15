/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description fontawesome editing plugin
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { join } from 'lodash-es';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import FontAwesomeCommand from './FontAwesomeCommand';

export default class FontAwesomeEditing extends Plugin {
	static get pluginName() {
		return 'FontAwesomeEditing';
	}

	static get requires() {
		// Clipboard is required for handling cut and paste events while typing over the link.
		return [Widget];
	}

	constructor(editor) {
		super(editor);
		editor.config.define('fontawesome');
	}

	init() {
		this._defineSchema();
		this._defineConverters();

		/** adding command 'fontawesome' so it could be registered in editor */
		this.editor.commands.add('fontawesome', new FontAwesomeCommand(this.editor));
	}

	_defineSchema() {
		const schema = this.editor.model.schema;
		schema.register('fontawesome', {
			// Allow wherever text is allowed:
			allowWhere: '$text',

			// fontawesome icon will act as an inline node:
			isInline: true,

			// The icon is self-contained so it cannot be split by the caret and can be selected:
			isObject: true,

			// The icon can have the same attributes as text (for example linkHref, bold).
			allowAttributesOf: '$text',

			/*
          icon will have these 3 attribute:-
          classes - define classes for fontawesome icon
          color - color of icon
          id -  for differentiating 2 same icons if present consecutively, because if there is no difference
                between content present one after another, then editor merges them together, that is why id
                is required.
			 */
			allowAttributes: ['classes', 'color'],
		});
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		/** converting model to view in editor, for adding content in editor */
		conversion.for('downcast').elementToElement({
			model: 'fontawesome',
			view: (modelItem, { writer: viewWriter }) => createIconElement(modelItem, viewWriter),
		});

		/** converting view to model, for showing content when editor again selected */
		conversion.for('upcast').elementToElement({
			view: {
				name: 'i',
				classes: ['fontawesome'],
			},
			model: (viewElement, { writer: modelWriter }) => {
				const CLASS = [];
				for (const cls of viewElement.getClassNames()) {
					CLASS.push(cls);
				}
				const COLOR = viewElement.getStyle('color');
				return modelWriter.createElement('fontawesome', { classes: CLASS, color: COLOR });
			},
		});

		/**
		 *
		 */
		function createIconElement(attr, viewWriter) {
			const CLASSES = attr.getAttribute('classes');
			const COLOR = attr.getAttribute('color');
			const CLASS = 'fontawesome ' + join(CLASSES, ' ');

			const iconView = viewWriter.createContainerElement('i', {
				class: CLASS,
				style: `color:${COLOR}`,
			});

			const innerText = viewWriter.createText('');
			viewWriter.insert(viewWriter.createPositionAt(iconView, 0), innerText);

			return iconView;
		}
	}
}
