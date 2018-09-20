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
  text-align: center;
  width: 100%;
  height: 100%;
}
.col-wrap {
  margin: 0 auto;
  width: 200px;
  height: 200px;
  background: #c3c3c3;
  .icon {
    display: inline-block;
    width: 50px;
    height: 50px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    &-1 {
      background-image: url("./images/qa.1.svg");
    }
    &-2 {
      background-image: url("./images/qa.2.svg");
    }
    &-3 {
      background-image: url("./images/qa.3.svg");
    }
  }
}
</style>
