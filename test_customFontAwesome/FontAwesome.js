/**
 * @author atul.silori <atul.silori@314ecorp.com>
 * @description fontawesome master plugin
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FontAwesomeEditing from './FontAwesomeEditing';
import FontAwesomeUI from './FontAwesomeUI';

export default class FontAwesome extends Plugin {
	static get requires() {
		return [FontAwesomeEditing, FontAwesomeUI];
	}

	static get pluginName() {
		return 'FontAwesome';
	}
}
