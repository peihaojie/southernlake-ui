<!--
 * @Date         : 2020-07-29 16:59:02
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-31 16:19:26
 * @FilePath     : \src\pages\menu\videoPage\Index.vue
-->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import videoPageStore from "store/modules/videoPage/videoPageStore";
import msg from "common/MessageUtils";

@Component({})
export default class VideoPage extends Vue {
  private store: any;
  private videoSize = 4; // 每页显示的视频数量
  private pageIndex = 1; // 页码
  private videoTotal = 0; // 摄像头总数
  private videoList: any[] = []; // 摄像头列表
  private cid: string | null = sessionStorage.getItem("companyId")
    ? sessionStorage.getItem("companyId")
    : sessionStorage.getItem("projectId"); // 获取数据的ID

  private videoShow = true; // 重绘页面
  private menuList: any[] = []; // 菜单列表
  private tag = sessionStorage.getItem("companyId") ? "true" : "false"; // true 集团 false 项目
  private defaultUrl = require("static/lodaingFail.jpg");
  private props = {
    label: "companyName",
    children: "children",
    isLeaf: "leaf"
  };

  constructor() {
    super();
    this.store = getModule(videoPageStore);
  }

  mounted() {
    this.getVideoList();
    this.getMenuList();
  }

  // 翻页
  changePage(val: number) {
    this.pageIndex = val;
    this.getVideoList();
  }

  // 改变每页显示video数量
  changeVideoSize(size: number) {
    this.videoSize = size;
    this.changePage(1);
  }

  // 获取视频列表
  async getVideoList() {
    await this.videoStop();
    this.videoShow = false;
    this.store
      .getVideoList(
        `?cid=${this.cid}&pageNum=${this.pageIndex}&pageSize=${this.videoSize}&tag=${this.tag}`
      )
      .then((res: any) => {
        if (res.code === "0") {
          this.videoShow = true;
          this.videoList = res.data.rows;
          this.videoTotal = res.data.total;
          this.$nextTick(() => this.videoPlay());
        }
      });
  }

  // 播放视频
  videoPlay() {
    this.videoList.forEach((item, index) => {
      (this as any)[`player${index + 1}`] = new EZUIPlayer(
        `player${index + 1}`
      );
    });
  }

  // 停止播放
  videoStop(): Promise<any> {
    return new Promise(resolve => {
      this.videoList.forEach((item, index) => {
        if (typeof (this as any)[`player${index + 1}`] === "object") {
          (this as any)[`player${index + 1}`].stop();
        }
      });
      resolve(true);
    });
  }

  // 获取点击列表
  getMenuList() {
    this.store
      .getMenuList(`?id=${this.cid}&tag=${this.tag}&type=video`)
      .then((res: any) => {
        if (res.code === "0") {
          this.menuList = res.data;
        }
      });
  }

  // 获取项目数据
  getProject(id: number): Promise<any> {
    return new Promise(resolve => {
      this.store.getProject(`?companyId=${id}`).then((res: any) => {
        if (res.code === "0" && res.data.length) {
          res.data.forEach((project: any) => {
            project.companyName = project.projectName;
            project.leaf = true;
          });
          resolve(res.data);
          return;
        }
        msg.warning("该公司下没有项目");
        resolve([]);
      });
    });
  }

  // 树形的渲染
  async loadNode(node: any, resolve: any) {
    if (node.level === 0) {
      return resolve(this.menuList);
    }

    const childList = this.menuList.filter(
      (item: any) => item.id === node.data.id
    );
    if (childList.length && childList[0].children) {
      return resolve(childList[0].children);
    }

    const data = await this.getProject(node.data.id);
    return resolve(data);
  }

  // 播放项目视频
  getProjectVideo(id: string) {
    if (this.cid !== id) {
      this.cid = id;
      this.tag = "false";
      this.getVideoList();
      return;
    }
    msg.warning("该项目视频已播放");
  }

  // 项目没有视频
  isNull() {
    msg.warning("该项目没有摄像头");
  }

  beforeDestroy() {
    this.videoStop();
  }
}
</script>
<template lang="pug" src="views/videoPage.pug" />
<style lang="stylus" src="styles/videoPage.stylus" />
