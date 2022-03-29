import { Plugin } from "ckeditor5/src/core";
import InfoBlockEditing from "./infoblockediting";
import InfoBlockUI from "./infoblockui";

/**
 * A custom plugin for highlighting info.
 *
 * @extends module:core/plugin~Plugin
 */
export default class InfoBlock extends Plugin {
  static get requires() {
    return [InfoBlockEditing, InfoBlockUI];
  }

  static get pluginName() {
    return "InfoBlock";
  }
}
