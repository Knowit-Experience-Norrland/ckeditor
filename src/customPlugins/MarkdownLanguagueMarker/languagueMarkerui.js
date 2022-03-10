/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldui
 */


import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import DropdownButtonView from '@ckeditor/ckeditor5-ui/src/dropdown/button/dropdownbuttonview';
import DropdownPanelView from '@ckeditor/ckeditor5-ui/src/dropdown/dropdownpanelview';
import DropdownView from '@ckeditor/ckeditor5-ui/src/dropdown/dropdownview';

import underlineIcon from '../../../icons/underline.svg';

const LANGUAGEMARKER = 'markdownLanguageMarker';

/**
 * the bold ui feature. it introduces the bold button.
 *
 * @extends module:core/plugin~plugin
 */
export default class LanguageMarkerUI extends Plugin {
	/**
	 * @inheritdoc
	 */
	static get pluginname() {
		return 'LanguageMarkerUI';
	}

	/**
	 * @inheritdoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// add bold button to feature components.
		editor.ui.componentFactory.add(LANGUAGEMARKER, locale => {
			const command = editor.commands.get(LANGUAGEMARKER);

			const button = new DropdownButtonView(locale);
			const panel = new DropdownPanelView(locale);
			const panelButton = new ButtonView(locale);
			const dropdown = new DropdownView(locale, button, panel);
			button.set({
				label: 'Språkmarkering',
				withText: true,
			});
			button.on('execute', () => {
				panelButton.element.style.setProperty('width', '100%')
				panel.element.classList.add('ck-dropdown__panel-visible')
				button.isOn = !button.isOn
				console.log({ rendered: panel.isRendered, visible: panel.isVisible })
			})

			dropdown.render();

			panelButton.set({
				label: 'Engelska',
				withText: true,
				isToggleable: true,
			})

			panelButton.class = 'dropdownButton'

			button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

			panelButton.on('execute', () => {
				panel.isVisible = false;
				panel.element.classList.remove('ck-dropdown__panel-visible')
				button.isOn = false;
				console.log({ rendered: panel.isRendered, visible: panel.isVisible })
				editor.model.change(writer => {
					writer.insertText('{en:', editor.model.document.selection.getFirstPosition());
					writer.insertText('}', editor.model.document.selection.getLastPosition());
				});
			})

			panel.children.add(panelButton)


			return dropdown
			// const view = new ButtonView(locale);

			// view.set({
			// 	label: t('languageMarker'),
			// 	icon: underlineIcon,
			// 	keystroke: 'ctrl+L',
			// 	tooltip: true,
			// 	isToggleable: true
			// });

			// view.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');


			// // view.on('execute', () => {
			// // 	editor.model.change(writer => {
			// // 		writer.insertText('<u>', editor.model.document.selection.getFirstPosition());
			// // 		writer.insertText('</u>', editor.model.document.selection.getLastPosition());
			// // 	});
			// // });
			// // execute command.
			// this.listenTo(view, 'execute', () => {

			// 	editor.model.change(writer => {
			// 		writer.insertText('{en:', editor.model.document.selection.getFirstPosition());
			// 		writer.insertText('}', editor.model.document.selection.getLastPosition());
			// 	});
			// 	editor.execute(LANGUAGEMARKER);
			// 	editor.editing.view.focus();

			// });

			// return view;
		});
	}
}
