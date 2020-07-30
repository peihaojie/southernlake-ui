<!--
 * @Date         : 2020-07-29 16:59:02
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-30 17:48:40
 * @FilePath     : \src\pages\menu\videoPage\Index.vue
-->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import videoPageStore from "store/modules/videoPage/videoPageStore";
const videoData: any[] = [
  {
    name: "1号摄像头",
    id: 1,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "2号摄像头",
    id: 2,
    url:
      "http://hls.open.ys7.com/openlive/7da9d05ec1df49cc89a847296d79e1a4.hd.m3u8"
  },
  {
    name: "3号摄像头",
    id: 3,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "4号摄像头",
    id: 4,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "5号摄像头",
    id: 5,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "6号摄像头",
    id: 6,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "7号摄像头",
    id: 7,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "8号摄像头",
    id: 8,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "9号摄像头",
    id: 9,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "10号摄像头",
    id: 10,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "11号摄像头",
    id: 11,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "12号摄像头",
    id: 12,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "13号摄像头",
    id: 13,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "14号摄像头",
    id: 14,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "15号摄像头",
    id: 15,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  },
  {
    name: "16号摄像头",
    id: 16,
    url:
      "http://hls01open.ys7.com/openlive/3c3d8a4396ff49018e7a1011095a22b9.hd.m3u8"
  }
];

@Component({})
export default class VideoPage extends Vue {
  private store: any;
  private videoSize = 4; // 每页显示的视频数量
  private pageIndex = 1; // 页码
  private videoTotal = 0; // 摄像头总数
  private videoList: any[] = videoData; // 摄像头列表
  // private cid = "76"
  private cid = "1";
  private videoShow = true; // 重绘页面

  constructor() {
    super();
    this.store = getModule(videoPageStore);
  }

  mounted() {
    this.getVideoList();
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
        `?cid=${this.cid}&pageNum=${this.pageIndex}&pageSize=${this.videoSize}`
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

  beforeDestroy() {
    this.videoStop();
  }
}
</script>
<template lang="pug" src="views/videoPage.pug" />
<style lang="stylus" src="styles/videoPage.stylus" />
