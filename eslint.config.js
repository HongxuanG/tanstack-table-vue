import antfu from "@antfu/eslint-config";

export default antfu(
  {
    ignores: ["node_modules/*"],
  },
  {
    rules: {
      "array-callback-return": "off",
    },
  },
);
