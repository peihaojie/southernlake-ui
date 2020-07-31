
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import TowerLiftStore from "store/modules/towerLift/TowerLiftStore";
import Echarts from "echarts";
import Time from "common/mixin";
import Msg from "common/MessageUtils";

@Component({})
export default class TowerLift extends Vue {
  private store: any;
  private currentPage= 1;
  private pageSize= 15;
  private total= 0;
  private device= "";
  private deviceName= "";
  private hidden = true;
  private projectId = sessionStorage.getItem("projectId") ? sessionStorage.getItem("projectId") : 0;
  private companyId = sessionStorage.getItem("companyId") ? sessionStorage.getItem("companyId") : 1;
  private projectDetails: any = {}; // 列表的数据
  private companyList: any[] = []; // 公司/区列表的数据
  private projectList: Array<any> = []; // 项目列表的数据
  private deviceData: Array<any> = []; // 设备列表的数据
  private historyData: Array<any> = []; // 历史记录的数据
  private show = true;
  private historyTime = [];
  private typesOf = null;
  private disabled = true;
  private warningLiftData: any = {}; // 报警列表的数据
  private liftData: any = {}; // 实时的数据
  private typesOfData: Array<any> = [
    {
      value: 0,
      label: "合格"
    }, {
      value: 1,
      label: "不合格"
    }
  ]; // 列表的数据

  constructor() {
    super();
    this.store = getModule(TowerLiftStore);
  }

  mounted() {
    this.getCORP();
    this.warningEcharts();
  }

  getCORP() {
    if (!this.projectId) {
      this.show = true;
      this.getCompanyData();
    } else {
      this.show = false;
      this.getProjectDetails();
      this.getDeviceData();
    }
  }

  warningEcharts() {
    const data = Object.keys(this.warningLiftData).length ? [this.warningLiftData.zzbj, this.warningLiftData.rsbj, this.warningLiftData.sxwbj, this.warningLiftData.xxwbj, this.warningLiftData.sdbj, 0] : [0, 0, 0, 0, 0, 0];
    const color = ['#3adb76', '#fe7a80', '#4faeee', '#f2a33a', '#f13b3a', '#9e3cf1'];
    const names = ["载重", "人数", "上限位", "下限位", "速度", "其他"];
    const list = [];
    let total = 0;
    for (const i in data) {
      total += data[i]
    }
    const placeHolderStyle = {
      normal: {
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        color: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0
      }
    };
    const rich = {
      white: {
        align: 'center',
        padding: [3, 0]
      }
    };
    for (const i in data) {
      list.push({
        value: data[i],
        name: names[i],
        itemStyle: {
          normal: {
            borderWidth: 5,
            shadowBlur: 20,
            borderColor: color[i],
            shadowColor: color[i],
            color: color[i]
          }
        }
      }, {
        value: total / 30,
        name: '',
        itemStyle: placeHolderStyle
      })
    }
    const func = (params: any) => {
      const percent = params.value ? ((params.value / total) * 100).toFixed(1) : 0;
      const name = params.name.replace(/\n/g, '');
      if (params.name !== '') {
        return name + '\n{white|' + percent + '%}'
      } else {
        return ''
      }
    };
    const chart: any = Echarts.init(document.getElementById("warning"));
    chart.setOption({
      tooltip: {
        show: false
      },
      legend: {
        orient: 'vertical',
        data: names,
        icon: 'rect',
        right: '5px',
        top: '60px',
        textStyle: {
          color: '#000',
          fontSize: 16
        }
      },
      series: [{
        name: '',
        type: 'pie',
        clockWise: false,
        startAngle: '90',
        center: ['40%', '50%'],
        radius: ['50%', '51%'],
        hoverAnimation: false,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'outside',
              formatter: func,
              rich: rich
            },
            labelLine: {
              length: 20,
              length2: 25,
              show: true,
              color: '#00ffff'
            }
          }
        },
        data: list,
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx: any) {
          return idx * 50;
        }
      },
      {
        name: '',
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['49%', '49%'],
        itemStyle: {
          color: 'transparant'
        },
        startAngle: '90',
        data: [{
          value: total,
          name: '',
          label: {
            normal: {
              show: true,
              rich: {
                c: {
                  color: 'rgb(98,137,169)',
                  fontSize: 50,
                  fontWeight: 'bold',
                  lineHeight: 5
                },
                b: {
                  color: 'rgb(98,137,169)',
                  fontSize: 40,
                  lineHeight: 5
                }
              },
              textStyle: {
                fontSize: 28,
                fontWeight: 'bold'
              },
              position: 'center'
            }
          }
        }]
      }]
    })
  }

  // 获取设备列表
  getDeviceData() {
    this.store.getDeviceData(`?pid=${this.projectId}`).then((res: any) => {
      if (res.code === 0) {
        this.deviceData = res.data;
        if (res.data.length) {
          this.device = res.data[0].hxzid;
          this.deviceName = res.data[0].dname;
          this.disabled = false;
          this.getLiftData();
          this.getHistoryData();
          return;
        }
        this.disabled = true;
        this.liftData = [];
        this.warningLiftData = {};
        this.warningEcharts();
      }
    }).catch((e: any) => {
      console.log(e)
    })
  }

  // 获取升降机实时数据
  getLiftData() {
    this.store.getLiftData(`?pid=${this.projectId}&hxzid=${this.device}`).then((res: any) => {
      if (res.code === 0) {
        this.liftData = res.data.record;
        this.warningLiftData = res.data;
        this.warningEcharts();
      }
    }).catch((e: any) => {
      console.log(e)
    })
  }

  // 获取公司列表
  getCompanyData() {
    this.store.getCompanyData(`?id=${this.companyId}&tag=true&type=elevator`).then((res: any) => {
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

  // 获取项目详情
  getProjectDetails() {
    this.store.getCompanyData(`?id=${this.projectId}&tag=false&type=elevator`).then((res: any) => {
      if (res.code === "0") {
        this.projectDetails = res.data;
      }
    }).catch((e: any) => {
      console.log(e)
    })
  }

  switchDevice() {
    this.deviceName = this.deviceData.filter(a => a.hxzid === this.device)[0].dname;
    this.getLiftData();
    this.getHistoryData();
  }

  tableRowClassName ({ rowIndex }: any) {
    if (rowIndex % 2 !== 0) {
      return 'success_row'
    }
    return ''
  }

  handleSizeChange(size: any) {
    this.pageSize = size;
  }

  handleCurrentChange(startPage: any) {
    this.currentPage = startPage;
  }

  // 切换公司、区
  checkCompany(company: any) {
    this.companyId = this.companyId === company.id ? null : company.id;
    this.disabled = true;
    if (this.companyId) {
      this.getProjectData();
    }
  }

  // 切换项目
  checkProject(e: any, project: any) {
    e.stopPropagation();
    this.projectId = project.id;
    this.device = "";
    this.getDeviceData();
    this.getHistoryData();
  }

  // 历史记录、返回首页切换
  checkHistoryHome() {
    this.hidden = !this.hidden;
    // if (this.hidden) {
    //   this.getLiftData();
    // } else {
    //   this.getHistoryData();
    // }
  }

  // 获取历史数据
  getHistoryData() {
    this.store.getHistoryData(`?hxzid=${this.device}&pageNum=${this.currentPage}&pageSize=${this.pageSize}${this.historyTime != null && this.historyTime.length > 0 ? `&time=${new Time(this.historyTime[0]).get()}&endTime=${new Time(this.historyTime[1]).get()}` : ""}${this.typesOf != null && this.typesOf !== "" ? `&status=${this.typesOf}` : ""}`).then((res: any) => {
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
    this.store.uploadHistoryData(`?hxzid=${this.device}${this.historyTime != null && this.historyTime.length > 0 ? `&time=${new Time(this.historyTime[0]).get()}&endTime=${new Time(this.historyTime[1]).get()}` : ""}`).catch((e: any) => {
      console.log(e);
      Msg.warning("导出失败！");
    })
  }
}
</script>
<template lang="pug" src="views/towerLift.pug" />
<style lang="stylus" src="styles/towerLift.stylus" />
