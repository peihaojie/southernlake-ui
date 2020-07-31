/*
 * @Date         : 2020-07-31 16:35:23
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-31 23:03:41
 * @FilePath     : \src\store\modules\towerCrane\TowerCraneStore.ts
 */
import { Action, Module, VuexModule } from "vuex-module-decorators";
import store from "store/index";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "TowerCraneStore",
  store
})
export default class TowerCraneStore extends VuexModule {
  public towerCraneUrl: any;

  constructor(args: any) {
    super(args);
    this.towerCraneUrl = requestConfig.towerCrane;
  }

  @Action
  getCompanyData(params: any): Promise<any> {
    return axios.post(this.towerCraneUrl.companyData + params);
  }

  @Action
  getProjectData(params: any): Promise<any> {
    return axios.post(this.towerCraneUrl.projectData + params);
  }

  @Action
  getDeviceData(params: any): Promise<any> {
    return axios.post(this.towerCraneUrl.deviceData + params);
  }

  @Action
  getCraneWarningData(params: any): Promise<any> {
    return axios.post(this.towerCraneUrl.craneWarningData + params);
  }

  @Action
  getCraneData(params: any): Promise<any> {
    return axios.post(this.towerCraneUrl.craneData + params);
  }

  @Action
  getHistoryData(params: any): Promise<any> {
    return axios.post(this.towerCraneUrl.historyData + params);
  }

  @Action
  uploadHistoryData(params: any): Promise<any> {
    // return axios.post(this.towerCraneUrl.uploadHistoryData + params, null, { responseType: 'blob', params: '塔吊历史记录' });
    return (location.href = this.towerCraneUrl.uploadHistoryData + params);
  }
}
