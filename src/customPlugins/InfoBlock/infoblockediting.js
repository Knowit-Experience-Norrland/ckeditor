import { Plugin } from "ckeditor5/src/core";
import { Enter } from "ckeditor5/src/enter";
import { Delete } from "ckeditor5/src/typing";

import InfoBlockCommand from "./infoblockcommand";

/**
 * The infoblock editing.
 *
 * Introduces the `'infoBlock'` command and the `'infoBlock'` model element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class InfoBlockEditing extends Plugin {
  static get pluginName() {
    return "InfoBlockEditing";
  }

  static get requires() {
    return [Enter, Delete];
  }

  init() {
    const editor = this.editor;
    const schema = editor.model.schema;

    editor.commands.add("infoBlock", new InfoBlockCommand(editor));

    schema.register("infoBlock", {
      allowWhere: "$block",
      allowContentOf: "$root",
    });

    editor.conversion.elementToElement({
      model: "infoBlock",
      view: {
        name: "div",
        classes: "infoblock",
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

          if (element.is("element", "infoBlock") && element.isEmpty) {
            // Added an empty infoBlock - remove it.
            writer.remove(element);

            return true;
          } else if (
            element.is("element", "infoBlock") &&
            !schema.checkChild(entry.position, element)
          ) {
            // Added a infoBlock in incorrect place. Unwrap it so the content inside is not lost.
            writer.unwrap(element);

            return true;
          } else if (element.is("element")) {
            // Just added an element. Check that all children meet the scheme rules.
            const range = writer.createRangeIn(element);

            for (const child of range.getItems()) {
              if (
                child.is("element", "infoBlock") &&
                !schema.checkChild(writer.createPositionBefore(child), child)
              ) {
                writer.unwrap(child);

                return true;
              }
            }
          }
        } else if (entry.type == "remove") {
          const parent = entry.position.parent;

          if (parent.is("element", "infoBlock") && parent.isEmpty) {
            // Something got removed and now infoBlock is empty. Remove the infoBlock as well.
            writer.remove(parent);

            return true;
          }
        }
      }

      return false;
    });

    const viewDocument = this.editor.editing.view.document;
    const selection = editor.model.document.selection;
    const infoBlockCommand = editor.commands.get("infoBlock");

    // Overwrite default Enter key behavior.
    // If Enter key is pressed with selection collapsed in empty block inside a block, break the block.
    this.listenTo(
      viewDocument,
      "enter",
      (evt, data) => {
        if (!selection.isCollapsed || !infoBlockCommand.value) {
          return;
        }

        const positionParent = selection.getLastPosition().parent;

        if (positionParent.isEmpty) {
          editor.execute("infoBlock");
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
          !infoBlockCommand.value
        ) {
          return;
        }

        const positionParent = selection.getLastPosition().parent;

        if (positionParent.isEmpty && !positionParent.previousSibling) {
          editor.execute("infoBlock");
          editor.editing.view.scrollToTheSelection();

          data.preventDefault();
          evt.stop();
        }
      },
      { context: "infoBlock" }
    );
  }
}
