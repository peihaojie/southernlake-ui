/*
 * @Date         : 2020-06-10 16:58:02
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-29 14:59:59
 * @FilePath     : \src\shims-vue.d.ts
 */
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
declare let AMap: any;
declare module 'echarts';
declare let EZUIPlayer: any;
