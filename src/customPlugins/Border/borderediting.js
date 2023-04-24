import { Plugin } from "ckeditor5/src/core";
import { Enter } from "ckeditor5/src/enter";
import { Delete } from "ckeditor5/src/typing";

import BorderCommand from "./bordercommand";

/**
 * The border editing.
 *
 * Introduces the `'border'` command and the `'border'` model element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class BorderEditing extends Plugin {
  static get pluginName() {
    return "BorderEditing";
  }

  static get requires() {
    return [Enter, Delete];
  }

  init() {
    const editor = this.editor;
    const schema = editor.model.schema;

    editor.commands.add("border", new BorderCommand(editor));

    schema.register("border", {
      allowWhere: "$block",
      allowContentOf: "$root",
    });

    editor.conversion.elementToElement({
      model: "border",
      view: {
        name: "div",
        classes: "border",
      },
    });

    // Postfixer which cleans incorrect model states connected with block info.
    editor.model.document.registerPostFixer((writer) => {
      const changes = editor.model.document.differ.getChanges();

      for (const entry of changes) {
        if (entry.type == "insert") {
          const element = entry.position.nodeAfter;

          if (!element) {
            // We are inside a text node.
            continue;
          }

          if (element.is("element", "border") && element.isEmpty) {
            // Added an empty border - remove it.
            writer.remove(element);

            return true;
          } else if (
            element.is("element", "border") &&
            !schema.checkChild(entry.position, element)
          ) {
            // Added a border in incorrect place. Unwrap it so the content inside is not lost.
            writer.unwrap(element);

            return true;
          } else if (element.is("element")) {
            // Just added an element. Check that all children meet the scheme rules.
            const range = writer.createRangeIn(element);

            for (const child of range.getItems()) {
              if (
                child.is("element", "border") &&
                !schema.checkChild(writer.createPositionBefore(child), child)
              ) {
                writer.unwrap(child);

                return true;
              }
            }
          }
        } else if (entry.type == "remove") {
          const parent = entry.position.parent;

          if (parent.is("element", "border") && parent.isEmpty) {
            // Something got removed and now border is empty. Remove the border as well.
            writer.remove(parent);

            return true;
          }
        }
      }

      return false;
    });

    const viewDocument = this.editor.editing.view.document;
    const selection = editor.model.document.selection;
    const borderCommand = editor.commands.get("border");

    // Overwrite default Enter key behavior.
    // If Enter key is pressed with selection collapsed in empty block inside a block, break the block.
    this.listenTo(
      viewDocument,
      "enter",
      (evt, data) => {
        if (!selection.isCollapsed || !borderCommand.value) {
          return;
        }

        const positionParent = selection.getLastPosition().parent;

        if (positionParent.isEmpty) {
          editor.execute("border");
          editor.editing.view.scrollToTheSelection();

          data.preventDefault();
          evt.stop();
        }
      },
      { context: "div" }
    );

    // Overwrite default Backspace key behavior.
    // If Backspace key is pressed with selection collapsed in first empty block inside a block, break the block.
    this.listenTo(
      viewDocument,
      "delete",
      (evt, data) => {
        if (
          data.direction != "backward" ||
          !selection.isCollapsed ||
          !borderCommand.value
        ) {
          return;
        }

        const positionParent = selection.getLastPosition().parent;

        if (positionParent.isEmpty && !positionParent.previousSibling) {
          editor.execute("border");
          editor.editing.view.scrollToTheSelection();

          data.preventDefault();
          evt.stop();
        }
      },
      { context: "border" }
    );
  }
}

