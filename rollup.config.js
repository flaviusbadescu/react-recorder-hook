import typescript from "@rollup/plugin-typescript";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
      },
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
];
