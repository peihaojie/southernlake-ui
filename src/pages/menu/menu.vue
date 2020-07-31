<!--
 * @Date         : 2020-07-27 15:53:36
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-31 17:29:17
 * @FilePath     : \src\pages\menu\menu.vue
-->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import MenuStore from "store/modules/menu/MenuStore";

@Component({})
export default class Menu extends Vue {
  private store: any;
  private checkedPath = "/menu/surroundings";
  private menuList: MenuList[] = [
    {
      label: "环境监测",
      path: "/menu/surroundings",
      id: 1,
      src: require("static/surroundings.png")
    },
    {
      label: "塔吊监测",
      path: "/menu/towerCrane",
      id: 2,
      src: require("static/towerCrane.png")
    },
    {
      label: "升降机监测",
      path: "/menu/towerLift",
      id: 3,
      src: require("static/lift.png")
    },
    {
      label: "视频监控",
      path: "/menu/videoPage",
      id: 4,
      src: require("static/video.png")
    }
  ]; // 列表的数据

  constructor() {
    super();
    this.store = getModule(MenuStore);
  }

  mounted() {
    this.checkedPath = this.$route.path
  }

  // 跳转到相关页面
  jumpToPage(menuItem: any) {
    this.checkedPath = menuItem.path;
    this.$router.push(menuItem.path);
  }
}
interface MenuList {
  label: string;
  path?: string;
  id: number;
  box?: boolean;
  src: string;
}
</script>
<template lang="pug" src="views/menu.pug" />
<style lang="stylus" src="styles/menu.stylus" />
