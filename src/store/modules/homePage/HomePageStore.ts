/*
 * @Date         : 2020-07-27 17:43:00
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-28 14:31:30
 * @FilePath     : \src\store\modules\homePage\HomePageStore.ts
 */

import { Module, VuexModule } from "vuex-module-decorators";
import store from "store/index";
// import { requestConfig } from "request/requestConfig";
// import { server as axios } from "common/HttpClient";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "HomePageStore",
  store
})
export default class HomePageStore extends VuexModule {
  // constructor(args: any) {
  //   super(args);
  // }
}
