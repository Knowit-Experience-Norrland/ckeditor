/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldui
 */


import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import underlineIcon from '../../../icons/underline.svg';

const UNDERLINE = 'markdownUnderline';

/**
 * the bold ui feature. it introduces the bold button.
 *
 * @extends module:core/plugin~plugin
 */
export default class UnderlineUI extends Plugin {
	/**
	 * @inheritdoc
	 */
	static get pluginname() {
		return 'UnderlineUI';
	}

	/**
	 * @inheritdoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// add bold button to feature components.
		editor.ui.componentFactory.add(UNDERLINE, locale => {
			const command = editor.commands.get(UNDERLINE);
			const view = new ButtonView(locale);

			view.set({
				label: t('underline'),
				icon: underlineIcon,
				keystroke: 'ctrl+u',
				tooltip: true,
				isToggleable: true
			});

			view.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');


			// view.on('execute', () => {
			// 	editor.model.change(writer => {
			// 		writer.insertText('<u>', editor.model.document.selection.getFirstPosition());
			// 		writer.insertText('</u>', editor.model.document.selection.getLastPosition());
			// 	});
			// });
			// execute command.
			this.listenTo(view, 'execute', () => {

				editor.model.change(writer => {
					writer.insertText('<u>', editor.model.document.selection.getFirstPosition());
					writer.insertText('</u>', editor.model.document.selection.getLastPosition());
				});
				editor.execute(UNDERLINE);
				editor.editing.view.focus();

			});

			return view;
		});
	}
}
