# vue 项目初始脚手架

## 配置清单

```bash
格式约束：eslint|stylelint
测试： jest
打包： webpack
```

## install

```bash
yarn install
```

## dev

```bash
yarn hot
```

## build

```bash
yarn build:[dev|production]
```

## 构建环境变量说明

- NODE_ENV: 当前 js 运行的环境，development 或者 production, 主要区别在于 js
  压缩，css 提取，sourcemap，代码分片，代码打包分析·
- API_ENV: 当前 api 环境，development 或者 prodution 或者其他
