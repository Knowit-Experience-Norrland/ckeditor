import { Plugin } from "ckeditor5/src/core";
import StrongEditing from "./strongediting";
import StrongUI from "./strongui";

/**
 * A custom bold feature to use <b> tag instead of <strong>
 * @extends module:core/plugin~Plugin
 */
export default class Strong extends Plugin {
  static get requires() {
    return [StrongEditing, StrongUI];
  }

  static get pluginName() {
    return "Strong";
  }
}
