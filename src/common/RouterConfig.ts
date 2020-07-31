/*
 * @Date         : 2020-03-07 10:18:43
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-31 17:45:49
 * @FilePath     : \src\common\RouterConfig.ts
 */
import router from "router/.invoke/router";

router.beforeEach((to, from, next) => {
  if (/\/home:id=/.test(to.path)) {
    next({
      path: "/menu/surroundings",
      query: { projectId: to.path.split("=")[1] }
    });
  } else {
    next();
  }
});
export default router;
