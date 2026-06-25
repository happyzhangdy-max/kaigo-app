# kaigo-app 项目交接文档

> 最后更新：2026-06-26
> 用途：其他 session 继续开发时阅读本文了解当前状态

## 2026-06-26 完善记录（本轮）

修复了一批此前未完成/有缺陷的部分，`npm run lint` 与 `npm run build` 均通过：

- **修复全局语言切换（核心 bug）**：原 `useTranslation` 用每个组件各自的 `useState` 存 locale，切换语言只影响当前组件、不会传播到 header/卡片/仪表盘。改为 `useSyncExternalStore` 模块级 store，全局共享 + 持久化到 `localStorage`（key `kaigo-locale`）+ 同步 `<html lang>`。
- **新增暗色模式开关**：`src/hooks/useTheme.ts`（system/light/dark，持久化 `kaigo-theme`，写 `<html data-theme>`）。header 有一键切换按钮，设置页有三选项。
- **重写顶部导航**：原来是 `<a href>`（在 `/kaigo-app/` 子路径下会跳错且全页刷新）。改为 react-router `NavLink`，i18n 文案，active 高亮；`BrowserRouter basename={import.meta.env.BASE_URL}`。header 内置语言/主题切换。
- **补全 CSS**：组件用的类名（`header-*`、`dashboard-stats-grid`、`stat-card`、`result-*`、`feedback-terms` 等）此前在 App.css 中并不存在 → 页面大面积无样式。已重写 App.css 全量覆盖，并补齐缺失的 CSS 变量。
- **新增用语集页面** `/glossary`：搜索 + 浏览 144 条专门用语（日/中/解説）。
- **答题反馈显示关联术语**：根据题目 `term_refs` 在解説下方列出相关术语；`term_refs` 解析率已达 100%（补了 35 条缺失术语，术语库 109→144）。
- **规整科目分类**：技能評価試験的题目此前 `subject` 是细分类（46 个，多数 1 题且无翻译），首页一片混乱。已按官方 5 大领域归并（介護の基本 / こころとからだのしくみ / コミュニケーション技術 / 生活支援技術 / 実技判断試験），细分类保留在 `category` 字段（答题页仍以小标签展示）。
- **修复 PWA manifest**：指向不存在的 `icon-192/512.png` → 改用 `favicon.svg`；`start_url`/`scope` 改为相对（子路径下可正确安装）；主题色统一为品牌棕。
- **去重文案**：首页/科目卡片原来把题数显示两遍（"90 全90問"）。

## 项目概况

介護福祉士国家試験 学習App（中日双语版）
- React PWA（Vite + React + TypeScript + vite-plugin-pwa）
- 全离线可用，零后端依赖
- GitHub: `happyzhangdy-max/kaigo-app`
- 线上地址（待开启Pages）：`https://happyzhangdy-max.github.io/kaigo-app/`

## 开发状态

### ✅ 已完成（MVP v0.1）

| Step | 内容 | 负责人 | 状态 |
|:----|:-----|:------|:----:|
| 0 | 规格确认（中日双语版） | 之哥+兽兽 | ✅ |
| 1 | 环境搭建（Vite+React+TS+PWA） | 小码A | ✅ |
| 2 | 题库数据（54题/7科目 + 109术语） | 团团 | ✅ |
| 3 | MVP功能开发 | 小码A | ✅ |
| 4 | 和风视觉设计（暖茶色+DarkMode+响应式） | 文森特 | ✅ |
| 5 | 验收测试（莉香测试中） | 莉香 | ⏳ |

### ✅ 已实现功能
- 📚 7科目カード一覧 → 点击进入科目別出題
- 🎲 ランダム出題 + 一問一答形式
- ✅ 解答即時FB（正解=绿/不正解=红）
- 🌐 中日双语解説（locale切换时自动切换zh↔ja）
- ⭐ 书签追加/削除/筛选
- 📊 進捗Dashboard（総回答数/正答率/科目別/連続正解/今日統計）
- 💾 IndexedDB 本地存储
- 📴 PWA离线可用（SW precache 8 entries）
- 🌗 ダークモード（系统自动+手动切换）
- 🌐 界面语言一键切换（中文↔日本語）

### ⏳ 待迭代
- 题量仍偏少（共 144 题：技能 90 / 国家 54）；可继续扩充题库
- 书签目前只在答题页加/取消，尚无"仅看收藏"的复习入口（i18n 文案 `bookmark.filter` 已备好）
- 设置页"关于"里的"7 科目"为写死值（技能实为 5 科目），可改成按当前考试类型动态显示

## 项目路径

```
G:\workcraft\kaigo-app\
├── .gitignore          # 已排除 node_modules/dist/.vite/截图
├── package.json
├── vite.config.ts      # base: '/kaigo-app/'
├── tsconfig.json
├── index.html
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css          # 全部样式（7.91KB）
│   ├── index.css        # CSS变量/主题色/字体
│   ├── routes/index.tsx
│   ├── types/index.ts
│   ├── utils/
│   │   ├── data.ts      # 题目取数函数
│   │   └── db.ts        # IndexedDB 操作
│   ├── i18n/
│   │   ├── zh.json      # 中文界面
│   │   ├── ja.json      # 日文界面
│   │   ├── terms.json   # 109介護専門用語对照
│   │   └── useTranslation.ts
│   ├── data/
│   │   └── questions.json  # 54题/7科目
│   ├── components/
│   │   ├── common/
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── NetworkStatus.tsx
│   │   ├── exam/
│   │   │   ├── QuestionCard.tsx
│   │   │   └── AnswerFeedback.tsx
│   │   └── study/
│   │       ├── SubjectCard.tsx
│   │       └── Dashboard.tsx
│   └── pages/
│       ├── Home.tsx
│       ├── Exam.tsx
│       └── Settings.tsx
└── dist/               # build产物（已推gh-pages）
```

## 技术要点

### 配色方案（已修复）
- **主题色**：暖茶色 #a67c52 / 纸张米白 #fdfaf6 / 炭灰 #4a4a4a
- **选项按钮**：白色背景 + 1.5px边框 + 字母圆形标签（A/B/C/D）
- **选中态**：边框加粗+外发光，标签变主题色
- **正解/不正解**：橄榄绿 #6b8e23 / 柔和红 #bc6e6e
- **Dark Mode**：深棕底色 #2d2a26，选项白底→卡色 #3a3630

### Vite base path
```ts
// vite.config.ts
base: '/kaigo-app/'
```

### GitHub Pages 部署
- **源码** → main 分支
- **构建产物** → gh-pages 分支
- Pages 未开启：需要用户把 repo 设为 public，然后 Settings → Pages → Deploy from branch → gh-pages / (root)

### 启动方式
```bash
cd G:\workcraft\kaigo-app
npm run dev
# → http://localhost:5173/kaigo-app/
```

### 构建+部署
```bash
npm run build                  # → dist/
npx gh-pages --dist dist --branch gh-pages -m "deploy: msg"
```

## 使用的Token
- GitHub Token：存在 `G:\workcraft\secrets\CREDENTIALS.md` 的 GitHub 节
- 细粒度 PAT，需在 Token 设置页添加新仓库授权才能推送

## 测试
- 莉香（BKBvjH）测试任务仍在运行（TASK_ID: d7a7e2dc-59e0-418e-bf05-15d79f189bf3）
- 也可以直接在本地 `npm run dev` 后手动测试

## 已知问题
- 暂无严重bug
- 配色已按用户反馈修复一次（选项对比度+题目独立卡片）
- 需要用户确认Pages部署后是否满意线上效果
