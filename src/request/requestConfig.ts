/*
 * @Date         : 2020-03-05 11:37:23
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-31 10:56:47
 * @FilePath     : \src\request\requestConfig.ts
 */
// 配置所有的接口
export const requestConfig = {
  // login: {
  //   loginData: "/login/loginApi"
  // },
  surroundings: {
    snData: "/api/equipment/constructionDust",
    companyData: "/api/NanHuApi/getProjectList",
    projectData: "/api/NanHuApi/dustEmission/selectAreaProjectList",
    dustData: "/api/NanHuApi/dustEmission/constructionDustData",
    snCountData: "/api/NanHuApi/dustEmission/kanBanDust",
    historyData: "/api/DustEmission/getDustEmission",
    uploadHistoryData: "/api/DustEmission/getExcel"
  },
  towerCrane: {
    companyData: "/api/NanHuApi/getProjectList",
    projectData: "/api/NanHuApi/crane/selectAreaProjectList",
    deviceData: "/api/craneApi/switchDevice",
    craneWarningData: "/api/craneApi/selectIndex",
    craneData: "/api/NanHuApi/craneApi/selectIndex",
    historyData: "/api/NanHuApi/craneApi/historyRecord",
    uploadHistoryData: "/api/craneApi/historyRecordExcel"
  },
  towerLift: {
    companyData: "/api/NanHuApi/getProjectList",
    projectData: "/api/NanHuApi/elevator/selectAreaProjectList",
    deviceData: "/api/elevatorApi/switchDevice",
    liftData: "/api/NanHuApi/elevatorApi/selectIndex",
    historyData: "/api/elevatorApi/historyRecord",
    uploadHistoryData: "/api/elevatorApi/historyRecordExcel",  },
  videoPage: {
    videoUrl: "/api/NanHuApi/video/selectAllVideoProjectList",
    menu: "/api/NanHuApi/getProjectList",
    project: "/api/NanHuApi/video/selectAreaProjectList"
  }
};
