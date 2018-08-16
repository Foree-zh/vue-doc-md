# Abc 组件

基础组件。

## 示例

### 类型

```html
<template>
  <div>
    <input v-model="a" />
    <span>val: {{ a }}</span>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        a: '',
      }
    },
  }
</script>
```
