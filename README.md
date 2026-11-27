# Mirrorless Zoom Optics Lab

## 微单变焦镜头中镜组成像与变焦对焦原理演示

以 NIKKOR Z 24–200mm f/4–6.3 VR 为例，查看 19 枚镜片的二维剖面、玻璃类别、曲面形状及运动分组。当前实验台展示参考处方的广角端与无穷远状态，支持通过剖面和编号选择镜片。

## 本地运行

使用 Node.js 22.12 或更高版本，以及 `package.json` 指定的 pnpm 版本。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## 验证和构建

```sh
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

生产文件位于 `build/`，可通过 `pnpm preview` 查看。安装了系统 Chrome 的环境也可用 `pnpm exec playwright test --project system-chrome` 验证生产构建。

已有匹配依赖时，可以使用 `npm run dev`、`npm test`、`npm run build` 和 `npm run preview` 调用同一套脚本。

- [光学调研与处方](docs/nikkor-z-24-200-optics-research.md)
- [开发计划与进度](docs/development-plan.md)
