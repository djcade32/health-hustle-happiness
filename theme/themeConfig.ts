// theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
  },
  components: {
    Button: {},
    Input: {
      activeBorderColor: "#0742A0",
      hoverBorderColor: "#0742A0",
    },
  },
};

export default theme;
