/*
 * @Date         : 2020-07-27 15:53:36
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-31 16:54:16
 * @FilePath     : \src\store\modules\menu\MenuStore.ts
 */
import { Module, VuexModule } from "vuex-module-decorators";
import store from "store/index";
// import { requestConfig } from "request/requestConfig";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "MenuStore",
  store
})
export default class MenuStore extends VuexModule {

}
