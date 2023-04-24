import { Command } from "ckeditor5/src/core";
import { first } from "ckeditor5/src/utils";

/**
 * The command for the border plugin.
 *
 * @extends module:core/command~Command
 */
export default class BorderCommand extends Command {
  refresh() {
    this.value = this._getValue();
    this.isEnabled = this._checkEnabled();
  }

  /**
   * Executes the command. When the command {@link #value is on}, all top-most borders within
   * the selection will be removed. If it is off, all selected blocks will be wrapped with
   * a border.
   *
   * @fires execute
   * @param {Object} [options] Command options.
   * @param {Boolean} [options.forceValue] If set, it will force the command behavior. If `true`, the command will apply a border,
   * otherwise the command will remove the border. If not set, the command will act basing on its current value.
   */
  execute(options = {}) {
    const model = this.editor.model;
    const schema = model.schema;
    const selection = model.document.selection;

    const blocks = Array.from(selection.getSelectedBlocks());

    const value =
      options.forceValue === undefined ? !this.value : options.forceValue;

    model.change((writer) => {
      if (!value) {
        this._removeBorder(writer, blocks.filter(findBorder));
      } else {
        const blocksToInfo = blocks.filter((block) => {
          return findBorder(block) || canBeWrapped(schema, block);
        });

        this._applyBorder(writer, blocksToInfo);
      }
    });
  }

  /**
   * Checks the command's {@link #value}.
   *
   * @private
   * @returns {Boolean} The current value.
   */
  _getValue() {
    const selection = this.editor.model.document.selection;

    const firstBlock = first(selection.getSelectedBlocks());

    // In the current implementation, the border must be an immediate parent of a block element.
    return !!(firstBlock && findBorder(firstBlock));
  }

  /**
   * Checks whether the command can be enabled in the current context.
   *
   * @private
   * @returns {Boolean} Whether the command should be enabled.
   */
  _checkEnabled() {
    if (this.value) {
      return true;
    }

    const selection = this.editor.model.document.selection;
    const schema = this.editor.model.schema;

    const firstBlock = first(selection.getSelectedBlocks());

    if (!firstBlock) {
      return false;
    }

    return canBeWrapped(schema, firstBlock);
  }

  /**
   * Removes the info from given blocks.
   */
  _removeBorder(writer, blocks) {
    // Remove from all groups of block. Iterate in the reverse order to not break following ranges.
    getRangesOfBlockGroups(writer, blocks)
      .reverse()
      .forEach((groupRange) => {
        if (groupRange.start.isAtStart && groupRange.end.isAtEnd) {
          writer.unwrap(groupRange.start.parent);

          return;
        }

        // The group of blocks are at the beginning of an <bQ> so let's move them left (out of the <bQ>).
        if (groupRange.start.isAtStart) {
          const positionBefore = writer.createPositionBefore(
            groupRange.start.parent
          );

          writer.move(groupRange, positionBefore);

          return;
        }

        // The blocks are in the middle of an <bQ> so we need to split the <bQ> after the last block
        // so we move the items there.
        if (!groupRange.end.isAtEnd) {
          writer.split(groupRange.end);
        }

        // Now we are sure that groupRange.end.isAtEnd is true, so let's move the blocks right.

        const positionAfter = writer.createPositionAfter(groupRange.end.parent);

        writer.move(groupRange, positionAfter);
      });
  }

  /**
   * Applies the border to given blocks.
   *
   * @private
   * @param {module:engine/model/writer~Writer} writer
   * @param {Array.<module:engine/model/element~Element>} blocks
   */
  _applyBorder(writer, blocks) {
    const contentToMerge = [];

    // Wrap all groups of block. Iterate in the reverse order to not break following ranges.
    getRangesOfBlockGroups(writer, blocks)
      .reverse()
      .forEach((groupRange) => {
        let content = findBorder(groupRange.start);

        if (!content) {
          content = writer.createElement("border");

          writer.wrap(groupRange, content);
        }

        contentToMerge.push(content);
      });

    contentToMerge.reverse().reduce((currentContent, nextContent) => {
      if (currentContent.nextSibling == nextContent) {
        writer.merge(writer.createPositionAfter(currentContent));

        return currentContent;
      }

      return nextContent;
    });
  }
}

function findBorder(elementOrPosition) {
  return elementOrPosition.parent.name == "border"
    ? elementOrPosition.parent
    : null;
}

function getRangesOfBlockGroups(writer, blocks) {
  let startPosition;
  let i = 0;
  const ranges = [];

  while (i < blocks.length) {
    const block = blocks[i];
    const nextBlock = blocks[i + 1];

    if (!startPosition) {
      startPosition = writer.createPositionBefore(block);
    }

    if (!nextBlock || block.nextSibling != nextBlock) {
      ranges.push(
        writer.createRange(startPosition, writer.createPositionAfter(block))
      );
      startPosition = null;
    }

    i++;
  }

  return ranges;
}

function canBeWrapped(schema, block) {
  // TMP will be replaced with schema.checkWrap().
  const isWrapAllowed = schema.checkChild(block.parent, "border");
  const isBlockAllowedInBorder = schema.checkChild(
    ["$root", "border"],
    block
  );

  return isWrapAllowed && isBlockAllowedInBorder;
}

