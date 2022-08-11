import { Plugin } from "ckeditor5/src/core";
import { ButtonView } from "ckeditor5/src/ui";
import Icon from "./theme/info-icon.svg";

import "./theme/infoblock.css";

export default class InfoBlockUI extends Plugin {
  static get pluginName() {
    return "InfoBlockUI";
  }

  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add("infoBlock", (locale) => {
      const command = editor.commands.get("infoBlock");
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: t("Infoblock"),
        icon: Icon,
        tooltip: true,
        isToggleable: true,
      });

      // Bind button model to command.
      buttonView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");

      // Execute command.
      this.listenTo(buttonView, "execute", () => {
        editor.execute("infoBlock");
        editor.editing.view.focus();
      });

      return buttonView;
    });
  }
}
