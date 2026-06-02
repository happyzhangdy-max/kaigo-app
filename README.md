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
│   ├── Home.tsx     # 首页（Hello World 验证）
│   ├── Exam.tsx     # 考试页面（预留）
│   └── Settings.tsx # 设置页面（预留）
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
| `/` | 首页 | ✅ 中日双语 Hello World |
| `/exam` | 考试 | 📝 预留 |
| `/settings` | 设置 | 📝 预留 |
