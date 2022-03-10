/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '../attributecommand';

const HIGHLIGHT = 'markdownHighlight';

/**
 * The bold editing feature.
 *
 * It registers the `'bold'` command and introduces the `bold` attribute in the model which renders to the view
 * as a `<strong>` element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class HighlightEditing extends Plugin {
	/**
	 * @inheritDoc
	 */

	static get pluginName() {
		return 'HighlightEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// Allow bold attribute on text nodes.
		editor.model.schema.extend('$text', { allowAttributes: HIGHLIGHT });
		editor.model.schema.setAttributeProperties(HIGHLIGHT, {
			isFormatting: true,
			copyOnEnter: true
		});

		// Build converter from model to view for data and editing pipelines.
		editor.conversion.attributeToElement({
			model: HIGHLIGHT,
			view: 'mark',
			upcastAlso: {
				styles: {
					'background-color': 'grey'
				}
			}
		});


		// Create bold command.
		editor.commands.add(HIGHLIGHT, new AttributeCommand(editor, HIGHLIGHT));

		// Set the Ctrl+B keystroke.
		editor.keystrokes.set('CTRL+M', HIGHLIGHT);
	}
}
