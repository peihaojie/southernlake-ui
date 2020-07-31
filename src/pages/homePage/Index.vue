<!--
 * @Date         : 2020-07-28 14:27:55
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-31 20:35:12
 * @FilePath     : \src\pages\homePage\Index.vue
-->
<script lang="ts">
import Echarts from "echarts";
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import HomePageStore from "store/modules/homePage/HomePageStore";
import moment from "moment";
moment.locale("zh-cn");

@Component({})
export default class HomePage extends Vue {
  private store: any = null;
  private cid = "76"; // 工地ID
  private companyName = ""; // 公司名称
  private citySpace = ""; // 集团所在城市
  private temperature = ""; // 温度
  private weather = 0; // 天气
  private map: any = {}; // 挂载的地图
  private infoWindow: any = {}; // 地图的弹窗
  private interval: any = {}; // 循环获取时间
  private time = ""; // 现在的时间
  private nowTime = ""; // 现在的时间（不会刷新）
  private managementClick = 0; // 管理打卡人数
  private workerClick = 0; // 工人打卡人数
  private onGuard = 0; // 在岗人数
  private allMoneys = 0; // 累计投资金额
  private allUnits = 0; // 累计参建单位
  private allProjects = 0; // 所有项目数量
  private videoSize = 4; // 视频的个数
  private videoList: any[] = []; // 视频的列表
  private marginAlarmObject = {
    limit: {
      color: "#41ccd3",
      value: "限位报警",
      num: 0
    },
    incline: {
      color: "#2498e3",
      value: "倾斜报警",
      num: 0
    },
    hoisting: {
      color: "#2268d4",
      value: "吊重报警",
      num: 0
    },
    windSpeed: {
      color: "#d6c76e",
      value: "风速报警",
      num: 0
    },
    barrier: {
      color: "#d39255",
      value: "障碍物报警",
      num: 0
    },
    towerCrane: {
      color: "#35c87a",
      value: "塔吊碰撞",
      num: 0
    },
    sensor: {
      color: "#44ae2e",
      value: "传感器故障",
      num: 0
    },
    noGo: {
      color: "#7d5dcc",
      value: "进入禁行区",
      num: 0
    }
  }; // 塔吊报警数据

  private lifterAlarmObject = {
    load: {
      color: "#00ffff",
      value: "载重报警",
      num: 0
    },
    people: {
      color: "#0068ff",
      value: "人数报警",
      num: 0
    },
    incline: {
      color: "#7d5dcc",
      value: "倾斜报警",
      num: 0
    },
    header: {
      color: "#d6c76e",
      value: "冲顶报警",
      num: 0
    }
  }; // 升降机报警数据

  private projectList = {
    normal: {
      value: "正常",
      num: 0
    },
    abnormal: {
      value: "异常",
      num: 0
    },
    complete: {
      value: "完工",
      num: 0
    }
  }; // 项目数据

  private rem = 100; // 现在的rem
  private clickTime: Date = new Date(); // 获打卡时间段
  private oldClickTime: Date = new Date(); // 变化之前的打卡时间段
  private plateTime: Date = new Date(); // 车牌识别时间段
  private oldPlateTime: Date = new Date(); // 变换前车牌识别时间段
  private marginOnOff = {
    total: 0,
    onLine: 0,
    offLine: 0
  }; // 塔吊检测设备数据

  private electricityBoxOnOff = {
    total: 0,
    onLine: 0,
    offLine: 0
  }; // 电箱识别设备数据

  private plateNumberOnOff = {
    total: 0,
    onLine: 0,
    offLine: 0
  }; // 车牌识别设备数据

  private environmentOnOff = {
    total: 0,
    onLine: 0,
    offLine: 0
  }; // 环境监测设备数据

  private lifterOnOff = {
    total: 0,
    onLine: 0,
    offLine: 0
  }; // 升降机检测设备数据

  private VideoOnOff = {
    total: 0,
    onLine: 0
  }; // 视频检测设备数据

  constructor() {
    super();
    this.store = getModule(HomePageStore);
  }

  // 项目数量
  get allProject(): string {
    if (Number(this.allProjects) >= 100000) {
      return "99999";
    } else {
      return this.allProjects
        ? this.allProjects.toString().padStart(5, "0")
        : "00000";
    }
  }

  // 天气返回对应的class
  get weatherClass(): string {
    switch (Number(this.weather)) {
      case 100:
        return "el-icon-sunny";
      case 101:
      case 104:
        return "el-icon-cloudy";
      case 102:
        return "el-icon-partly-cloudy";
      case 103:
        return "el-icon-cloudy-and-sunny";
      case 200:
      case 201:
      case 202:
      case 203:
      case 204:
      case 205:
      case 206:
      case 207:
      case 208:
      case 209:
      case 210:
      case 211:
      case 212:
      case 213:
        return "el-icon-wind-power";
      case 300:
      case 301:
      case 304:
      case 305:
      case 306:
      case 307:
      case 308:
      case 309:
      case 310:
      case 311:
      case 312:
      case 313:
      case 314:
      case 315:
      case 316:
      case 317:
      case 318:
      case 399:
        return "el-icon-heavy-rain";
      case 302:
      case 303:
        return "el-icon-lightning";
      case 400:
      case 401:
      case 402:
      case 403:
      case 404:
      case 405:
      case 406:
      case 407:
      case 408:
      case 409:
      case 410:
        return "el-icon-light-rain";
      default:
        return "";
    }
  }

  mounted() {
    sessionStorage.setItem("companyId", this.cid)
    this.getTime();
    this.initMap();
    this.getRem();
    this.getCompanyName();
    // this.getTotal();
    this.getProjectList();
    this.getOnGuard();
    this.getEnvironmentList();
    this.getOnOff();
    // this.getMarginAlarm();
    // this.getLifterAlarm();
    this.getVideo();
    this.getVideoTotal();
    this.$nextTick(() => {
      // this.getCarEcharts();
      this.getEnvironmentEcharts({});
      this.getClickCardEacharts();
    })
  }

  // 获取时间
  getTime() {
    const now: Date = new Date();
    const week: number = now.getDay() === 0 ? 7 : now.getDay();
    const day: number = 24 * 60 * 60 * 1000;
    const tuesday: Date = new Date(now.getTime() - day * (week - 2));
    console.log(tuesday);
    this.clickTime = this.oldClickTime = this.plateTime = this.oldPlateTime = new Date(
      `${this.getDate(tuesday)}`
    );
    this.nowTime = this.getDate(now);
    this.confirmTime("clickTime");
    // this.confirmTime("plateTime");
    this.interval = setInterval(() => {
      this.time = moment().format("YYYY-MM-DD HH:mm:ss");
    }, 1000);
  }

  // 计算天数
  getDate(time: Date): string {
    const y: number = time.getFullYear();
    const M: number = time.getMonth() + 1;
    const d: number = time.getDate();
    return `${y}-${M}-${d}`;
  }

  // 挂载地图
  initMap() {
    this.map = new AMap.Map("map", {
      zoom: 12, // 级别
      mapStyle: "amap://styles/fresh"
    });
  }

  // 动态获取rem，用于在echarts中修改字体大小
  getRem() {
    (window as any).outerWidth = document.body.clientWidth;
    const StandardWidth = 1920;
    const StandardFontSize = 100;
    const nowWidth = document.documentElement.offsetWidth;
    const nowFontSize = (nowWidth / StandardWidth) * StandardFontSize;
    this.rem = nowFontSize;
  }

  // 车辆echarts
  getCarEcharts(
    time: any[] = Array(7).fill("无数据"),
    carIn: any[] = Array(7).fill(0),
    carOut: any[] = Array(7).fill(0)
  ) {
    const carEcharts = Echarts.init(
      document.getElementById("plate-number")
    );
    carEcharts.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      legend: {
        data: ["车辆进场", "车辆出厂"],
        top: "0px",
        width: "40%",
        itemGap: 30,
        textStyle: {
          color: "#fff",
          fontSize: (0.12 * this.rem).toString()
        }
      },
      grid: {
        left: "10%",
        top: "15%",
        bottom: "15%",
        right: "5%"
      },
      calculable: true,
      xAxis: {
        axisLine: {
          lineStyle: {
            color: "#fff"
          }
        },
        axisLabel: {
          fontSize: 0.12 * this.rem
        },
        type: "category",
        data: time
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        axisLine: {
          lineStyle: {
            color: "#fff"
          }
        },
        axisLabel: {
          fontSize: 0.12 * this.rem
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#0c3962"
          }
        }
      },
      series: [
        {
          name: "车辆进场",
          type: "bar",
          data: carIn,
          itemStyle: {
            normal: {
              color: new Echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: "#41ccd399" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#41ccd3" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [5, 5]
            }
          }
        },
        {
          name: "车辆出厂",
          type: "bar",
          data: carOut,
          itemStyle: {
            normal: {
              color: new Echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: "#2498e399" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#2498e3" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [5, 5]
            }
          }
        }
      ]
    });
  }

  // 环境检测echarts
  getEnvironmentEcharts({
    excellent = 0,
    favorable = 0,
    ordinary = 0,
    slight = 0,
    severity = 0
  }: any) {
    const environmentEcharts = Echarts.init(
      document.getElementById("environment")
    );
    environmentEcharts.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        width: "50%",
        bottom: 0,
        data: ["优秀", "良好", "轻度", "中度", "重度"],
        textStyle: {
          color: "#fff",
          fontSize: (0.12 * this.rem).toString(),
          padding: [0, 0, 0, 0.3 * this.rem],
          lineHeight: (0.18 * this.rem).toString()
        }
      },
      series: [
        {
          center: ["50%", "30%"],
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: "center"
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: (0.2 * this.rem).toString(),
                fontWeight: "bold"
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: excellent, name: "优秀", itemStyle: { color: "#abd9ff" } },
            { value: favorable, name: "良好", itemStyle: { color: "#3993ff" } },
            { value: ordinary, name: "轻度", itemStyle: { color: "#0068ff" } },
            { value: slight, name: "中度", itemStyle: { color: "#002a6c" } },
            { value: severity, name: "重度", itemStyle: { color: "#002053" } }
          ]
        }
      ]
    });
  }

  // 打卡情况echarts
  getClickCardEacharts(
    time: any[] = Array(7).fill("无数据"),
    worker: any[] = Array(7).fill(0),
    Management: any[] = Array(7).fill(0)
  ) {
    const click = Echarts.init(document.getElementById("click-card"));
    click.setOption({
      title: {
        text: "一周打卡趋势",
        textStyle: {
          color: "#fff",
          fontWeight: 500,
          fontSize: 0.12 * this.rem
        },
        top: "5%",
        left: "3%"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["工人", "管理"],
        top: "5%",
        textStyle: {
          color: "#fff",
          fontSize: (0.12 * this.rem).toString()
        }
      },
      grid: {
        left: "7%",
        right: "7%",
        bottom: "3%",
        top: "20%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: time,
        splitLine: {
          show: true,
          lineStyle: {
            color: "#012b6b"
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: "#012b6b"
          }
        },
        axisLabel: {
          color: "#fff",
          fontSize: 0.12 * this.rem
        }
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        splitLine: {
          show: true,
          lineStyle: {
            color: "#012b6b"
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: "#012b6b"
          }
        },
        axisLabel: {
          color: "#fff",
          fontSize: 0.12 * this.rem
        }
      },
      series: [
        {
          name: "工人",
          type: "line",
          color: "#00e4f5",
          areaStyle: {
            normal: {
              color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#00e2ef"
                },
                {
                  offset: 1,
                  color: "#00e2ef3b"
                }
              ])
            }
          },
          data: worker
        },
        {
          name: "管理",
          type: "line",
          color: "#0043a7",
          areaStyle: {
            normal: {
              color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#0068ff"
                },
                {
                  offset: 1,
                  color: "#0068ff52"
                }
              ])
            }
          },
          data: Management
        }
      ]
    });
  }

  // 确定车牌数据的时间
  confirmTime(card: string) {
    const time: Date = card === "plateTime" ? this.plateTime : this.clickTime;
    const day: number = 24 * 60 * 60 * 1000;
    const now: number = time.getTime();
    const week: number = time.getDay();
    const start: number = now - (week - 1) * day;
    const end: number = now + (7 - week) * day;
    if (start > new Date().getTime()) {
      // this.messageBox("开始时间不可大于当前时间", 0);
      this.$message({
        type: "warning",
        message: "开始时间不可大于当前时间"
      });
      card === "plateTime"
        ? (this.plateTime = this.oldPlateTime)
        : (this.clickTime = this.oldClickTime);
    } else {
      switch (card) {
        case "plateTime":
          // 调用车牌的接口，获取车牌的数据，传的参是时间戳
          this.getPlate(start, end);
          break;
        case "clickTime":
          // 调用打卡接口， 获取打卡的数据，传的参是时间戳
          this.getClickCard(start, end);
          break;
      }
    }
  }

  // 获取公司名称
  getCompanyName() {
    this.$axios.post(`/api/company?cid=${this.cid}`).then((res: any) => {
      if (res.code === 0) {
        this.companyName = res.data.name;
        this.citySpace = res.data.city;
        if (this.citySpace) {
          this.getWeather();
        }
      }
    });
  }

  // 获取实时天气
  getWeather() {
    this.$axios
      .post(
        `https://free-api.heweather.net/s6/weather/now?location=${this.citySpace}&key=22ceb3c739604944b8e868d08a6e2ff2`
      )
      .then((res: any) => {
        this.temperature = res.data.HeWeather6[0].now.tmp;
        this.weather = res.data.HeWeather6[0].now.cond_code;
      });
  }

  // 获取累计数据
  getTotal() {
    this.$axios.post(`/api/totalList?cid=${this.cid}`).then((res: any) => {
      if (res.code === 0) {
        this.allMoneys = res.data.allMoney;
        this.allUnits = res.data.allUnit;
      }
    });
  }

  // 获取项目信息
  getProjectList() {
    this.$axios.post(`/api/projectList?cid=${this.cid}`).then((res: any) => {
      if (res.code === 0) {
        this.projectList.normal.num = res.data.normal;
        this.projectList.abnormal.num = res.data.abnormal;
        this.projectList.complete.num = res.data.complete;
        this.allProjects = res.data.allProject;
        const projectList: any[] = res.data.projectList;
        const goodList: any[] = projectList.filter(a => a.longitude && a.latitude);
        if (projectList.length && goodList.length) {
          this.getMark(goodList);
        }
      }
    });
  }

  // 挂载mark点标记
  getMark(list: any[]) {
    const markList: any[] = [];
    list.forEach(item => {
      const mark = new AMap.Marker({
        position: new AMap.LngLat(
          Number(item.longitude),
          Number(item.latitude)
        ),
        title: item.name,
        animation: "AMAP_ANIMATION_DROP"
      });
      mark.on("mouseover", () => this.getWindow(item));
      markList.push(mark);
    });
    this.map.add(markList);
    this.map.setCenter([Number(list[0].longitude), Number(list[0].latitude)]);
  }

  // 渲染弹窗
  getWindow(item: any) {
    this.infoWindow = new AMap.InfoWindow({
      anchor: "bottom-center",
      content: item.name,
      offset: new AMap.Pixel(2, -25)
    });
    this.infoWindow.open(this.map, [
      Number(item.longitude),
      Number(item.latitude)
    ]);
  }

  // 获取在岗人数
  getOnGuard() {
    this.$axios.post(`/api/count?cid=${this.cid}`).then((res: any) => {
      if (res.code === 0) {
        this.onGuard = res.data.onGuard;
      }
    });
  }

  // 获取打卡数据
  getClickCard(start: number, end: number) {
    this.$axios
      .post(`/api/clickCard?cid=${this.cid}&start=${start}&end=${end}`)
      .then((res: any) => {
        if (res.code === 0) {
          const x: any[] = [];
          const administrator: any[] = [];
          const worker: any[] = [];
          if (res.data.length) {
            res.data.forEach((a: any) => {
              if (a.date === new Date(this.nowTime).getTime()) {
                this.managementClick =
                  a.administrator === "" || null ? 0 : a.administrator;
                this.workerClick = a.worker === "" || null ? 0 : a.worker;
              }
              const time = new Date(a.date - 24 * 60 * 60 * 1000);
              const M =
                time.getMonth() + 1 < 10
                  ? "0" + (time.getMonth() + 1)
                  : time.getMonth() + 1;
              const d =
                time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
              x.push(`${M} - ${d}`);
              administrator.push(
                a.administrator === "" || null ? 0 : a.administrator
              );
              worker.push(a.worker === "" || null ? 0 : a.worker);
            });
            this.getClickCardEacharts(x, worker, administrator);
            return
          }
          this.getClickCardEacharts(Array(7).fill("无数据"), Array(7).fill(0), Array(7).fill(0));
        }
      });
  }

  // 获取车牌图表数据
  getPlate(start: number, end: number) {
    this.$axios
      .post(`/api/plateList?cid=${this.cid}&start=${start}&end=${end}`)
      .then((res: any) => {
        if (res.code === 0) {
          const x: any[] = [];
          const carIn: any[] = [];
          const carOut: any[] = [];
          res.data.forEach((a: any) => {
            const time = new Date(a.date - 24 * 60 * 60 * 1000);
            const M =
              time.getMonth() + 1 < 10
                ? "0" + (time.getMonth() + 1)
                : time.getMonth() + 1;
            const d: string | number =
              time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
            x.push(`${M} - ${d}`);
            carIn.push(a.carIn === "" || null ? 0 : a.carIn);
            carOut.push(a.carOut === "" || null ? 0 : a.carOut);
          });
          this.getCarEcharts(x, carOut, carIn);
        }
      });
  }

  // 获取环境检测数据
  getEnvironmentList() {
    this.$axios.post(`/api/environmentList?cid=${this.cid}`).then((res: any) => {
      if (res.code === 0) {
        const data: any = res.data;
        this.getEnvironmentEcharts({
          excellent: data.excellent,
          favorable: data.favorable,
          ordinary: data.ordinary,
          slight: data.slight,
          severity: data.severity
        });
      }
    });
  }

  // 获取设备在线数据
  getOnOff() {
    this.$axios.post(`/api/equipment?cid=${this.cid}`).then((res: any) => {
      this.marginOnOff = res.data.margin;
      // this.electricityBoxOnOff = res.data.electricityBox;
      // 车辆这里拿不到在线和离线的数量，只有总共的，其他的默认是0
      // 这个字段plateNumber 后端没有返回
      // this.plateNumberOnOff = res.data.plateNumber
      // this.plateNumberOnOff.total = res.data.plateNumber.total;
      this.environmentOnOff = res.data.environment;
      this.lifterOnOff = res.data.lifter;
    });
  }

  // 获取塔吊设备报警数据
  getMarginAlarm() {
    this.$axios.post(`/api/marginAlarm?cid=${this.cid}`).then((res: any) => {
      const data: any = res.data;
      this.marginAlarmObject.limit.num = data.limit;
      this.marginAlarmObject.incline.num = data.incline;
      this.marginAlarmObject.hoisting.num = data.hoisting;
      this.marginAlarmObject.windSpeed.num = data.windSpeed;
      this.marginAlarmObject.barrier.num = data.barrier;
      this.marginAlarmObject.towerCrane.num = data.towerCrane;
      this.marginAlarmObject.sensor.num = data.sensor;
      this.marginAlarmObject.noGo.num = data.noGo;
    });
  }

  // 获取升降机检测报警数据
  getLifterAlarm() {
    this.$axios.post(`/api/lifterAlarm?cid=${this.cid}`).then((res: any) => {
      this.lifterAlarmObject.load.num = res.data.load;
      this.lifterAlarmObject.people.num = res.data.people;
      this.lifterAlarmObject.incline.num = res.data.incline;
      this.lifterAlarmObject.header.num = res.data.header;
    });
  }

  // 获取视频
  getVideo() {
    this.$axios.post(`/api/NanHuApi/video/selectAllVideoProjectList?cid=${this.cid}`).then((res: any) => {
      if (res.code === "0") {
        if (res.data.rows.length > this.videoSize) {
          res.data.rows.length = this.videoSize
        }
        this.videoList = res.data.rows
        this.$nextTick(() => {
          this.videoList.forEach((item, index) => {
            (this as any)[`player${index + 1}`] = new EZUIPlayer(`player${index + 1}`);
          })
        })
      }
    });
  }

  // 获取视频总数
  getVideoTotal() {
    this.$axios.post(`/api/NanHuApi/homePage/selectVideoNum?cid=${this.cid}`).then((res: any) => {
      if (res.code === "0") {
        this.VideoOnOff.total = res.data.videoNum
        this.VideoOnOff.onLine = res.data.projectsNum
      }
    });
  }

  // 页面跳转
  toPage(path: string) {
    const routeData = this.$router.resolve({ path: path });
    window.open(routeData.href, '_blank');
  }

  beforeDestroy() {
    this.videoList.forEach((item, index) => {
      if (typeof (this as any)[`player${index + 1}`] === "object") {
        ((this as any)[`player${index + 1}`]).stop()
      }
    })
  }
}
</script>
<template lang="pug" src="views/homePage.pug" />
<style lang="stylus" src="styles/homePage.stylus" />
