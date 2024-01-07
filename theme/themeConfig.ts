// theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
  },
  components: {
    Button: {},
    Input: {
      activeBorderColor: "#f2f2f2",
      hoverBorderColor: "#f2f2f2",
    },
    Modal: {
      contentBg: "transparent",
      headerBg: "transparent",
      titleColor: "#f2f2f2",
    },
  },
};

export default theme;
