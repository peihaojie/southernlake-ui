
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import SurroundingsStore from "store/modules/surroundings/SurroundingsStore";
import Echarts from "echarts";
import Time from "common/mixin";
import Msg from "common/MessageUtils";

@Component({})
export default class Surroundings extends Vue {
  private store: any;
  private companyId = 0;
  private snCountData = {};
  private snData: any[] = [];
  private historyData: any[] = [];
  private zyData: any[] = [
    { Noise: "0", time: "0" },
    { Noise: "0", time: "0" },
    { Noise: "0", time: "0" },
    { Noise: "0", time: "0" },
    { Noise: "0", time: "0" },
    { Noise: "0", time: "0" },
    { Noise: "0", time: "0" }
  ];

  private pmData: any[] = [];
  private dustData: any = {};
  private sn = "";
  private snName = "";
  private currentPage= 1;
  private pageSize= 15;
  private total= 0;
  private historyTime = [];
  private typesOf = null;
  private disabled = true;
  private hidden = true;
  private projectId = sessionStorage.getItem("projectId") ? sessionStorage.getItem("projectId") : "";
  private companyList: any[] = []; // 列表的数据
  private projectList: Array<any> = []; // 列表的数据
  private typesOfData: Array<any> = [
    {
      value: 1,
      label: "合格"
    }, {
      value: 2,
      label: "不合格"
    }
  ]; // 列表的数据

  constructor() {
    super();
    this.store = getModule(SurroundingsStore);
  }

  mounted() {
    this.getCORP();
    this.dustEcharts();
  }

  customColors = ['#febb82', '#e6a23c', '#5cb87a', '#1989fa'];

  dustEcharts() {
    debugger
    const time = this.pmData.length > 0 ? this.pmData.map(b => b.time) : ["0:00", "0:00", "0:00", "0:00", "0:00", "0:00", "0:00", "0:00"];
    const pm10 = this.pmData.length > 0 ? this.pmData.map(b => b.PM10) : [0, 0, 0, 0, 0, 0, 0, 0];
    const pm25 = this.pmData.length > 0 ? this.pmData.map(b => b.PM25) : [0, 0, 0, 0, 0, 0, 0, 0];
    const chart: any = Echarts.init(document.getElementById("dust"));
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      color: ['#9becba', '#7fc8fe'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        top: '8%',
        containLabel: true
      },
      xAxis: [
        {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          type: 'category',
          boundaryGap: false,
          data: time
        }
      ],
      yAxis: [
        {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          type: 'value'
        }
      ],
      series: [
        {
          name: 'PM25',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: pm25
        },
        {
          name: 'PM10',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: pm10
        }
      ]
    }
    )
  }

  // 获取扬尘列表
  getSnData() {
    this.store.getSnData(`?projectId=${this.projectId}`).then((res: any) => {
      if (res.code === "0") {
        this.snData = res.data;
        if (res.data) {
          this.sn = res.data[0].sn;
          this.snName = res.data[0].comments;
          this.getDustData();
          return;
        }
        this.dustData = {};
        this.zyData = [{ Noise: "0", time: "0" }, { Noise: "0", time: "0" }, { Noise: "0", time: "0" }, { Noise: "0", time: "0" }, { Noise: "0", time: "0" }, { Noise: "0", time: "0" }, { Noise: "0", time: "0" }];
        this.pmData = [];
        this.dustEcharts();
      }
    }).catch((e: any) => {
      console.log(e)
    })
  }

  // 获取扬尘实时数据
  getDustData() {
    this.store.getDustData(`?sn=${this.sn}`).then((res: any) => {
      if (res.code === "0") {
        this.dustData = res.data.newData[0];
        this.zyData = res.data.ZY;
        this.pmData = res.data.PM;
        this.dustEcharts();
      }
    }).catch((e: any) => {
      console.log(e)
    })
  }

  getCORP() {
    if (!this.projectId) {
      this.getCompanyData();
    }
  }

  // 获取公司列表
  getCompanyData() {
    this.store.getCompanyData(`?id=1&tag=true`).then((res: any) => {
      if (res.code === "0") {
        this.companyList = res.data;
      }
    }).catch((e: any) => {
      console.log(e)
    })
  }

  // 获取项目列表
  getProjectData() {
    this.store.getProjectData(`?companyId=${this.companyId}`).then((res: any) => {
      if (res.code === "0") {
        this.projectList = res.data;
      }
    }).catch((e: any) => {
      console.log(e)
    })
  }

  // 获取设备总数、报警数
  getSnCountData() {
    this.store.getSnCountData(`?projectId=${this.projectId}`).then((res: any) => {
      if (res.code === "0") {
        this.snCountData = res.data;
      }
    }).catch((e: any) => {
      console.log(e)
    })
  }

  // 获取历史数据
  getHistoryData() {
    this.store.getHistoryData(`?sn=${this.sn}&pageNum=${this.currentPage}&pageSize=${this.pageSize}${this.historyTime.length > 0 ? `&startTime=${new Time(this.historyTime[0]).get()}&endTime=${new Time(this.historyTime[1]).get()}` : ""}${this.typesOf ? `&tag=${this.typesOf}` : ""}`).then((res: any) => {
      if (res.code === 0) {
        this.historyData = res.data.rows;
        this.total = res.data.total;
      }
    }).catch((e: any) => {
      console.log(e)
    })
  }

  // 导出数据
  uploadHistoryData() {
    this.store.uploadHistoryData(`?sn=${this.sn}${this.historyTime.length > 0 ? `&startTime=${new Time(this.historyTime[0]).get()}&endTime=${new Time(this.historyTime[1]).get()}` : ""}`).catch((e: any) => {
      console.log(e);
      Msg.warning("导出失败！");
    })
  }

  switchDevice() {
    this.snName = this.snData.filter(a => a.sn === this.sn)[0].comments;
    this.getDustData();
  }

  checkCompany(company: any) {
    this.companyId = this.companyId === company.id ? null : company.id;
    this.disabled = true;
    if (this.companyId) {
      this.getProjectData();
    }
  }

  checkProject(e: any, project: any) {
    e.stopPropagation();
    this.projectId = project.id;
    this.disabled = false;
    this.sn = "";
    this.getSnData();
    this.getSnCountData();
  }

  checkHistoryHome() {
    this.hidden = !this.hidden;
    if (this.hidden) {
      this.getCORP();
    } else {
      this.getHistoryData();
    }
  }

  tableRowClassName ({ rowIndex }: any) {
    if (rowIndex % 2 !== 0) {
      return 'success_row'
    }
    return ''
  }

  handleSizeChange(size: any) {
    this.pageSize = size;
    this.getHistoryData();
  }

  handleCurrentChange(startPage: any) {
    this.currentPage = startPage;
    this.getHistoryData();
  }

  checkSearch() {
    this.getHistoryData();
  }
}
</script>
<template lang="pug" src="views/surroundings.pug" />
<style lang="stylus" src="styles/surroundings.stylus" />