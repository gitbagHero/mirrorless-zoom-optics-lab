# Mirrorless Zoom Optics Lab

## 微单变焦镜头中镜组成像与变焦对焦原理演示

一个以 **NIKKOR Z 24-200mm f/4-6.3 VR** 为研究案例的交互式光学教学项目。

目标是把一支高倍率变焦镜头拆成可以观察、可以操作、可以解释的几层：

- 19 片镜片的侧视结构；
- 六组镜片在变焦时如何分工和移动；
- G5 内对焦组如何完成手动对焦与自动对焦；
- 合成目标图如何从离焦模糊变为合焦清晰；
- ED / 非球面 / 非球面 ED 分别在解决什么问题。

**在线演示：** <https://gitbaghero.github.io/mirrorless-zoom-optics-lab/>

> 当前版本：`v0.4 · I3`。已完成 19 片结构、六组双视图、二维光线追迹与 24–200 mm 变焦运动；正在按增量计划继续 I4–I6。

---

## 项目边界

本项目是**基于尼康公开专利实施例与官方规格的教学示意模型**：

- 不是尼康官方光学仿真；
- 不是量产镜头的精确 CAD；
- 不使用官方营销图，所有视觉素材由项目重绘；
- 专利实施例 8 用于近似 19 片 15 组的六组结构，但与量产版存在差异（例如专利焦距 24.7–194 mm、光圈 f/4.12–6.49）；
- 所有光学运动、像差和成像反馈都应在页面中明确标注“示意”。

NIKKOR 与 Nikon 是 Nikon Corporation 的商标。本项目是非官方、非商业的教学演示，不暗示尼康背书。

---

## 当前能力（I0–I3）

- 明亮扁平的页面外壳 + 暗色光学舞台；
- 19 片 / 15 组镜片结构，按专利半径绘制形状；
- G1–G6、光圈、像面的功能分区与组括号；
- “19 片结构 / 6 组功能”双视图；
- 点击/键盘选择镜片或组，查看形状、nd/νd、类型与作用；
- 二维逐面折射光线追迹：球面 + 非球面、Snell 折射、光圈裁剪；
- 轴上 / 轴外 / 光线扇三种预设，支持显示光线开关；
- 宽角端 EFL 24.70 mm 与专利表 8 对齐；
- 24–200 mm 变焦滑杆，四锚点平滑插值；
- “变焦时谁在动”面板：G1–G6 行程、G3/G6 同步块、D4 非单调提示；
- 官方规格、模型边界与来源入口；
- 响应式布局（1920 / 1365 / 768 / 390）；
- 键盘跳转、减少动态支持；
- Vitest 数据单测 + Playwright 冒烟测试；
- GitHub Pages 自动部署。

## 计划中的能力

| 增量 | 内容 | 状态 |
|---|---|---|
| I0 | 基础与设计系统 | ✅ verified |
| I1 | 19 片结构与六组双视图 | ✅ verified |
| I2 | 二维逐面折射光路引擎 | ✅ verified |
| I3 | 24–200 mm 变焦运动 | ✅ verified |
| I4 | 手动对焦 / AF-S / AF-C + 合成成像 | ⏳ next |
| I5 | 分章导览与解释内容 | pending |
| I6 | 响应式、无障碍、测试与 v1.0 发布 | pending |

VR 防抖、光圈/景深、像差深化与科普视频导出属于 **post-v1.0** 路线，详见开发计划。

---

## 技术栈

| 层 | 选择 |
|---|---|
| 构建 | Vite |
| UI | React + TypeScript |
| 结构图 | SVG |
| 光线 | Canvas 2D |
| 单测 | Vitest |
| 浏览器测试 | Playwright |
| 部署 | GitHub Pages + GitHub Actions |
| 包管理 | pnpm |

## 本地运行

```bash
pnpm install
pnpm dev
```

默认开发地址：`http://127.0.0.1:5173/`

## 验证

```bash
pnpm test        # 光学数据单测
pnpm build       # TypeScript + 生产构建
pnpm test:e2e    # Playwright 冒烟
pnpm check       # 依次执行以上三项
```

## 目录结构

```text
src/
  app/            # 页面入口与页面结构
  components/     # 舞台、数据说明等 UI
  data/           # 官方规格、来源、测试
  styles/         # 设计 tokens 与页面样式
tests/            # Playwright 冒烟
docs/
  research/       # 镜头光学调研、专利资料、结构图
  development-plan.md
```

## 文档

- [v1.0 开发计划](docs/development-plan.md)
- [NIKKOR Z 24-200 光学原理调研](docs/research/nikkor-z-24-200-research.md)
- [调研原始资料说明](docs/research/raw/README.md)

## 分支说明

- `main`：稳定入口，目前只保留项目标题与基础文件；
- `dsh-dev`：项目实际开发分支，后续增量、状态更新和提交都在此分支进行。

## 许可

代码以 [MIT License](LICENSE) 发布。第三方资料、商标和专利文本的使用边界见文档中的数据说明。
