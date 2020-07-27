/*
 * @Date         : 2020-03-07 10:18:43
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-29 09:55:02
 * @FilePath     : \src\common\RouterConfig.ts
 */
import router from "router/.invoke/router";
import store from "../store";

// router.beforeEach((to, from, next) => {
//   sessionStorage.setItem("path", to.path);
//   store.commit("changePath", to.path);
//   if (to.path === "/show") {
//     next();
//     return;
//   }
//   if (sessionStorage.getItem("Authorization")) {
//     next();
//   } else {
//     next({
//       path: "/show"
//     });
//   }
// });
export default router;
