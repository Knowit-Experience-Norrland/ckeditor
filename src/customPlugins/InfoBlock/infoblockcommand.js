import { Command } from "ckeditor5/src/core";
import { first } from "ckeditor5/src/utils";

/**
 * The command for the infoblock plugin.
 *
 * @extends module:core/command~Command
 */
export default class InfoBlockCommand extends Command {
  refresh() {
    this.value = this._getValue();
    this.isEnabled = this._checkEnabled();
  }

  /**
   * Executes the command. When the command {@link #value is on}, all top-most infoblocks within
   * the selection will be removed. If it is off, all selected blocks will be wrapped with
   * a infoblock.
   *
   * @fires execute
   * @param {Object} [options] Command options.
   * @param {Boolean} [options.forceValue] If set, it will force the command behavior. If `true`, the command will apply a infoblock,
   * otherwise the command will remove the infoblock. If not set, the command will act basing on its current value.
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
        this._removeInfo(writer, blocks.filter(findInfo));
      } else {
        const blocksToInfo = blocks.filter((block) => {
          return findInfo(block) || canBeWrapped(schema, block);
        });

        this._applyInfo(writer, blocksToInfo);
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

    // In the current implementation, the infoblock must be an immediate parent of a block element.
    return !!(firstBlock && findInfo(firstBlock));
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
  _removeInfo(writer, blocks) {
    // Unquote all groups of block. Iterate in the reverse order to not break following ranges.
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
   * Applies the info to given blocks.
   *
   * @private
   * @param {module:engine/model/writer~Writer} writer
   * @param {Array.<module:engine/model/element~Element>} blocks
   */
  _applyInfo(writer, blocks) {
    const quotesToMerge = [];

    // Wrap all groups of block. Iterate in the reverse order to not break following ranges.
    getRangesOfBlockGroups(writer, blocks)
      .reverse()
      .forEach((groupRange) => {
        let quote = findInfo(groupRange.start);

        if (!quote) {
          quote = writer.createElement("infoBlock");

          writer.wrap(groupRange, quote);
        }

        quotesToMerge.push(quote);
      });

    quotesToMerge.reverse().reduce((currentQuote, nextQuote) => {
      if (currentQuote.nextSibling == nextQuote) {
        writer.merge(writer.createPositionAfter(currentQuote));

        return currentQuote;
      }

      return nextQuote;
    });
  }
}

function findInfo(elementOrPosition) {
  return elementOrPosition.parent.name == "infoBlock"
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
  const isWrapAllowed = schema.checkChild(block.parent, "infoBlock");
  const isBlockAllowedInInfoBlock = schema.checkChild(
    ["$root", "infoBlock"],
    block
  );

  return isWrapAllowed && isBlockAllowedInInfoBlock;
}
