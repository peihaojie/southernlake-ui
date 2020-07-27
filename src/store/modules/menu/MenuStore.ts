import { Module, VuexModule } from "vuex-module-decorators";
import store from "store/index";
import { requestConfig } from "request/requestConfig";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "MenuStore",
  store
})
export default class MenuStore extends VuexModule {

}
