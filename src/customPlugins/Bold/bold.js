import { Plugin } from "ckeditor5/src/core";
import BoldEditing from "./boldediting";
import BoldUI from "./boldui";

/**
 * A custom bold feature to use <b> tag instead of <strong>
 * @extends module:core/plugin~Plugin
 */
export default class Bold extends Plugin {
  static get requires() {
    return [BoldEditing, BoldUI];
  }

  static get pluginName() {
    return "Bold";
  }
}
