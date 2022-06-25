# vue-scroll-digit
实现类似抽奖的数字翻滚效果组件，github源码地址：https://github.com/xInfoLabCode/vue-scroll-digit

![vue-scroll-digit](https://blog.xinfolab.com/blog/scroll-digit.gif)


## 使用
1. 安装node_modules
``` shell
# 使用npm发布版本
npm i vue-scroll-digit
```

2. vue侧前端代码引用
``` javascript
import VueScrollDigit from 'vue-scroll-digit'

export default {
  components: {
    VueScrollDigit
  },
  ...
}

```

## 组件源码
### 开发

``` shell
cd vue-scroll-digit

npm i

npm run dev

# 使用npm link进行本地调试
npm link

# 打包
npm run build

```

### 组件源码联调
``` shell
# 使用本地代码联调
npm link vue-scroll-digit

# 删除本地联调
npm unlink vue-scroll-digit

```
