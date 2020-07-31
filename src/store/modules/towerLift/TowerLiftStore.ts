/*
 * @Date         : 2020-07-31 16:35:23
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-31 23:05:46
 * @FilePath     : \src\store\modules\towerLift\TowerLiftStore.ts
 */
import { Action, Module, VuexModule } from "vuex-module-decorators";
import store from "store/index";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "TowerLiftStore",
  store
})
export default class TowerLiftStore extends VuexModule {
  public towerLiftUrl: any;

  constructor(args: any) {
    super(args);
    this.towerLiftUrl = requestConfig.towerLift;
  }

  @Action
  getCompanyData(params: any): Promise<any> {
    return axios.post(this.towerLiftUrl.companyData + params);
  }

  @Action
  getProjectData(params: any): Promise<any> {
    return axios.post(this.towerLiftUrl.projectData + params);
  }

  @Action
  getDeviceData(params: any): Promise<any> {
    return axios.post(this.towerLiftUrl.deviceData + params);
  }

  @Action
  getLiftData(params: any): Promise<any> {
    return axios.post(this.towerLiftUrl.liftData + params);
  }

  @Action
  getHistoryData(params: any): Promise<any> {
    return axios.post(this.towerLiftUrl.historyData + params);
  }

  @Action
  uploadHistoryData(params: any): Promise<any> {
    // return axios.post(this.towerLiftUrl.uploadHistoryData + params, null, { responseType: 'blob', params: '升降机历史记录' });
    return (location.href = this.towerLiftUrl.uploadHistoryData + params);
  }
}
