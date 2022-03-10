/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '../attributecommand';

const UNDERLINE = 'markdownUnderline';

/**
 * The bold editing feature.
 *
 * It registers the `'bold'` command and introduces the `bold` attribute in the model which renders to the view
 * as a `<strong>` element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UnderlineEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'UnderlineEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// Allow bold attribute on text nodes.
		editor.model.schema.extend('$text', { allowAttributes: UNDERLINE });
		editor.model.schema.setAttributeProperties(UNDERLINE, {
			isFormatting: true,
			copyOnEnter: true
		});

		// Build converter from model to view for data and editing pipelines.
		editor.conversion.attributeToElement({
			model: UNDERLINE,
			view: 'u',
			upcastAlso: {
				styles: {
					'text-decoration': 'underline'
				}
			}
		});


		// Create bold command.
		editor.commands.add(UNDERLINE, new AttributeCommand(editor, UNDERLINE));

		// Set the Ctrl+B keystroke.
		editor.keystrokes.set('CTRL+U', UNDERLINE);
	}
}
