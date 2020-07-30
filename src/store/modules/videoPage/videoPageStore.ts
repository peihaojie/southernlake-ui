/*
 * @Date         : 2020-07-29 16:59:48
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-30 16:22:00
 * @FilePath     : \src\store\modules\videoPage\videoPageStore.ts
 */

import { Module, Action, VuexModule } from "vuex-module-decorators";
import store from "store/index";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "videoPageStore",
  store
})
export default class VideoPageStore extends VuexModule {
  private url: any = requestConfig.videoPage;
  // constructor(args: any) {
  //   super(args);
  // }

  @Action
  public getVideoList(url: string): Promise<any> {
    return axios.post(this.url.videoUrl + url);
  }
}
