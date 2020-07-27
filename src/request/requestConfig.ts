/*
 * @Date         : 2020-03-05 11:37:23
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-08 09:25:40
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
  }
};
