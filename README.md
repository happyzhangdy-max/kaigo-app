# 介護福祉士 試験対策

介護福祉士国家試験 学習アプリ（中日双语）

## 技术栈

- **框架：** React 19 + TypeScript
- **构建：** Vite 8
- **路由：** react-router-dom v7
- **国际化：** 自建 i18n hook（JSON 字典 + useTranslation()）
- **PWA：** vite-plugin-pwa（Service Worker + Manifest）

## 目录结构

```
src/
├── i18n/            # 国际化：字典JSON + useTranslation hook
│   ├── zh.json      # 中文界面
│   ├── ja.json      # 日本語UI
│   ├── terms.json   # 介護専門用語表（日/中/解説）
│   └── useTranslation.ts
├── pages/           # 页面组件
│   ├── Home.tsx     # 首页（仪表盘 + 科目卡片）
│   ├── Exam.tsx     # 答题页（出题 + 反馈 + 关联术语）
│   ├── Glossary.tsx # 用语集（搜索 + 浏览）
│   └── Settings.tsx # 设置（语言 / 主题 / 数据）
├── routes/          # 路由定义
├── components/      # 按功能模块分目录
│   ├── common/      # 通用组件
│   ├── layout/      # 布局组件
│   ├── exam/        # 考试相关组件
│   ├── study/       # 学习相关组件
│   └── settings/    # 设置相关组件
├── hooks/           # 自定义 hooks（预留）
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数（预留）
├── App.tsx          # 应用入口 + 路由
└── main.tsx         # 渲染入口
```

## 启动

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 路由

| 路径 | 页面 | 状态 |
|------|------|------|
| `/` | 首页：考试类型切换 + 学习仪表盘 + 科目卡片 | ✅ |
| `/exam` | 随机出题（可带 `?examType=`） | ✅ |
| `/exam/:subject` | 科目別出题 | ✅ |
| `/glossary` | 介护专门用语集（144 条，可搜索） | ✅ |
| `/settings` | 语言 / 主题 / 数据管理 | ✅ |

## 功能

- 中日双语界面，一键切换（全局共享 + 持久化）
- 亮/暗主题（跟随系统 / 手动），持久化
- 一问一答 + 即时反馈 + 解説 + 关联术语
- 书签收藏、IndexedDB 学习记录、科目別正答率仪表盘
- PWA 离线可用（Service Worker 预缓存）
