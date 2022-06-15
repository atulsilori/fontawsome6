/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description command for adding icons
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { toMap } from 'ckeditor5/src/utils';

export default class FontAwesomeCommand extends Command {
	execute({ value }) {
		const attr = { classes: value.param, color: value.color };
		const model = this.editor.model;
		const document = model.document;
		const selection = document.selection;

		const range = selection.getFirstRange();

		model.change((writer) => {
			const currentAttributes = toMap(selection.getAttributes());
			const iconElement = writer.createElement('fontawesome', attr);
			model.insertContent(iconElement);

			/* adding trailing space after icon insertion*/
			writer.setSelection(range.start.getShiftedBy(1));
			model.insertContent(writer.createText(' ', currentAttributes), range.start.getShiftedBy(1));
		});
	}

	refresh() {
		this.isEnabled = true;
	}
}
