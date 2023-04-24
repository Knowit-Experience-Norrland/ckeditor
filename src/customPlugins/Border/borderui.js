import { Plugin } from "ckeditor5/src/core";
import { ButtonView } from "ckeditor5/src/ui";
import Icon from "./theme/border-icon.svg";

import "./theme/border.css";

export default class BorderUI extends Plugin {
  static get pluginName() {
    return "BorderUI";
  }

  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add("border", (locale) => {
      const command = editor.commands.get("border");
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: t("border"),
        icon: Icon,
        tooltip: true,
        isToggleable: true,
      });

      // Bind button model to command.
      buttonView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");

      // Execute command.
      this.listenTo(buttonView, "execute", () => {
        editor.execute("border");
        editor.editing.view.focus();
      });

      return buttonView;
    });
  }
}

