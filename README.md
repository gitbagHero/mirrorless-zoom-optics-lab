# Mirrorless Zoom Optics Lab

## 微单变焦镜头中镜组成像与变焦对焦原理演示

以 NIKKOR Z 24–200mm f/4–6.3 VR 为例，查看 19 枚镜片的二维剖面、玻璃类别、曲面形状及运动分组。

当前可连续变焦或跳到四个专利档位，调整光圈并切换轴上、离轴光束。剖面同步显示逐面折射与遮挡，镜组位移以广角端为基准，像面光斑及教学测试图随操作更新。

选择主体距离后，MF 可直接移动对焦双片 E16/E17。两种 AF 分别展示正负半瞳像点的位置差，以及测试图对比度评分的搜索过程。变焦中间档位采用插值，AF 行程与测试图均为教学模型。

实验引导提供折射成像、变焦与镜组、手动对焦、自动对焦四个独立场景。可随时跳过引导或重置实验台。VR 图示展示 G3 中 E09/E10 的横向运动与理想像点补偿。

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

## GitHub Pages 发布

现有站点使用 [原项目地址](https://gitbaghero.github.io/mirrorless-zoom-optics-lab/)。此版本的工作流仅在专用发布仓库 `gitbagHero/mirrorless-zoom-optics-lab-gpt` 的 `gpt-optics-demo` 分支运行 Pages 作业。

1. 建立专用仓库，通过独立的 Git 远程推送 `gpt-optics-demo`。首次推送到空仓库后，确认此分支为该仓库的默认分支。
2. 在专用仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。若 `github-pages` 环境设有分支限制，允许 `gpt-optics-demo` 发布。
3. 在专用仓库的 **Actions** 启动或重跑 Pages 工作流。它会运行光学测试，根据站点路径构建并发布，随后 `verify-site` 对正式地址运行浏览器验收。

新站点的预计默认地址为 [gitbaghero.github.io/mirrorless-zoom-optics-lab-gpt](https://gitbaghero.github.io/mirrorless-zoom-optics-lab-gpt/)。实际地址由 Actions 的 `deploy` 作业提供。可把该地址设为 `PLAYWRIGHT_SITE_URL`，再用 `pnpm test:browser` 验证线上站点。 [GitHub Pages 配置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 项目资料

- [光学调研与处方](docs/nikkor-z-24-200-optics-research.md)
- [开发计划与进度](docs/development-plan.md)
