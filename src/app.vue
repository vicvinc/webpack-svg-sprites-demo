<template>
  <div class="container">
    <p>hello there.</p>
    <div class="col-wrap">
      <i class="icon icon-1"/>
      <i class="icon icon-2"/>
      <i class="icon icon-3"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "vue-root"
};
</script>

<style lang="less">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body,
.container {
  width: 100%;
  height: 100%;
}
.col-wrap {
  width: 200px;
  height: 200px;
  .icon {
    display: inline-block;
    width: 50px;
    height: 50px;
    &-1 {
      background: url("./images/qa.1.svg") center / cover no-repeat;
    }
    &-2 {
      background: url("./images/qa.2.svg") center / cover no-repeat;
    }
    &-3 {
      background: url("./images/qa.3.svg") center / cover no-repeat;
    }
  }
}
</style>
