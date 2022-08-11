import { Plugin } from "ckeditor5/src/core";
import AttributeCommand from "../attributecommand";

const STRONG = "strong";

/**
 * The strong editing feature.
 *
 * It registers the `'strong'` command and introduces the `strong` attribute in the model which renders to the view
 * as a `<strong>` element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class StrongEditing extends Plugin {
  static get pluginName() {
    return "StrongEditing";
  }

  init() {
    const editor = this.editor;
    // Allow strong attribute on text nodes.
    editor.model.schema.extend("$text", { allowAttributes: STRONG });
    editor.model.schema.setAttributeProperties(STRONG, {
      isFormatting: true,
      copyOnEnter: true,
    });

    // Build converter from model to view for data and editing pipelines.
    editor.conversion.attributeToElement({
      model: STRONG,
      view: "strong",
      upcastAlso: [
        "b",
        (viewElement) => {
          const fontWeight = viewElement.getStyle("font-weight");

          if (!fontWeight) {
            return null;
          }

          // Value of the `font-weight` attribute can be defined as a string or a number.
          if (fontWeight == "bold" || Number(fontWeight) >= 600) {
            return {
              name: true,
              styles: ["font-weight"],
            };
          }
        },
      ],
    });

    // Create strong command.
    editor.commands.add(STRONG, new AttributeCommand(editor, STRONG));

    // Set the Ctrl+S keystroke.
    editor.keystrokes.set("CTRL+S", STRONG);
  }
}
