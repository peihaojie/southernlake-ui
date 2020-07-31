/*
 * @Date         : 2020-07-27 15:53:36
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-31 23:23:37
 * @FilePath     : \src\store\modules\surroundings\SurroundingsStore.ts
 */
import { Action, Module, VuexModule } from "vuex-module-decorators";
import store from "store/index";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "SurroundingsStore",
  store
})
export default class SurroundingsStore extends VuexModule {
  public surroundingsUrl: any;

  constructor(args: any) {
    super(args);
    this.surroundingsUrl = requestConfig.surroundings;
  }

  @Action
  getSnData(params: any): Promise<any> {
    return axios.post(this.surroundingsUrl.snData + params);
  }

  @Action
  getDustData(params: any): Promise<any> {
    return axios.post(this.surroundingsUrl.dustData + params);
  }

  @Action
  getCompanyData(params: any): Promise<any> {
    return axios.post(this.surroundingsUrl.companyData + params);
  }

  @Action
  getProjectData(params: any): Promise<any> {
    return axios.post(this.surroundingsUrl.projectData + params);
  }

  @Action
  getSnCountData(params: any): Promise<any> {
    return axios.post(this.surroundingsUrl.snCountData + params);
  }

  @Action
  getHistoryData(params: any): Promise<any> {
    return axios.post(this.surroundingsUrl.historyData + params);
  }

  @Action
  uploadHistoryData(params: any): any {
    // return axios.post(this.surroundingsUrl.uploadHistoryData + params, null, {
    //   responseType: "blob",
    //   params: "扬尘历史记录"
    // });
    return (location.href =
      "http://47.106.71.3:8080" +
      this.surroundingsUrl.uploadHistoryData +
      params);
  }

  @Action
  getCORP(params: any): Promise<any> {
    return axios.post(this.surroundingsUrl.getProjectId + params);
  }
}
