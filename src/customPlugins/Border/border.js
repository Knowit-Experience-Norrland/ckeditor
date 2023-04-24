import { Plugin } from "ckeditor5/src/core";
import BorderEditing from "./borderediting";
import BorderUI from "./borderui";

/**
 * A custom plugin for adding div with class 'border' around selected content.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Border extends Plugin {
  static get requires() {
    return [BorderEditing, BorderUI];
  }

  static get pluginName() {
    return "Border";
  }
}
