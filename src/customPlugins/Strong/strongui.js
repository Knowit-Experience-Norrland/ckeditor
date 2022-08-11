/**
 * @module basic-styles/strong/strongui
 */

import { Plugin } from "ckeditor5/src/core";
import { ButtonView } from "ckeditor5/src/ui";

import strongIcon from "./theme/strong-icon.svg";

const STRONG = "strong";

/**
 * The strong UI feature. It introduces the Strong button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class StrongUI extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return "StrongUI";
  }

  init() {
    const editor = this.editor;
    const t = editor.t;

    // Add strong button to feature components.
    editor.ui.componentFactory.add(STRONG, (locale) => {
      const command = editor.commands.get(STRONG);
      const view = new ButtonView(locale);

      view.set({
        label: t("Strong"),
        icon: strongIcon,
        keystroke: "CTRL+S",
        tooltip: true,
        isToggleable: true,
      });

      view.bind("isOn", "isEnabled").to(command, "value", "isEnabled");

      // Execute command.
      this.listenTo(view, "execute", () => {
        editor.execute(STRONG);
        editor.editing.view.focus();
      });

      return view;
    });
  }
}
