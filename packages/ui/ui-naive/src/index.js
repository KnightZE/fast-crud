import { useMessage, useDialog, useNotification } from "naive-ui";
import { uiContext } from "@fast-crud/fast-crud";
import setupIcons from "./icons";
import { Naive } from "./naive";
export default {
  install(app) {
    const naiveUi = new Naive();
    uiContext.set(naiveUi);

    setupIcons(app);
    console.log("naive ui installed");
  },
  init() {
    if (uiContext.ref == null) {
      throw new Error("请先安装ui：app.use(UiNaive);");
    }
    const message = useMessage();
    const notification = useNotification();
    const messageBox = useDialog();
    uiContext.ref.init({ message, notification, messageBox });
  }
};
