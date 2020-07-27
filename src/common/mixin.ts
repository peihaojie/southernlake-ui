/*
 * @Date         : 2020-05-18 18:07:52
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-01 11:10:44
 * @FilePath     : \src\common\mixin.ts
 */

class Time {
  date: Date | [Date, Date];
  constructor(date: Date | [Date, Date]) {
    this.date = date;
  }

  private getString(date: Date): string {
    const Y = date.getFullYear();
    const M = date.getMonth() + 1;
    const D = date.getDate();
    return `${Y}-${M < 10 ? "0" + M.toString() : M}-${
      D < 10 ? "0" + D.toString() : D
    }`;
  }

  public get() {
    if (Array.isArray(this.date)) {
      const start = this.getString(this.date[0]);
      const end = this.getString(this.date[1]);
      return `${start}~${end}`;
    }
    return this.getString(this.date);
  }

  private getSecond(time: Date | null): string {
    if (time) {
      const date = new Date(time);
      const Y = date.getFullYear().toString();
      const M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1).toString()
          : (date.getMonth() + 1).toString();
      const D =
        date.getDate() < 10
          ? "0" + date.getDate().toString()
          : date.getDate().toString();
      const h =
        date.getHours() < 10
          ? "0" + date.getHours().toString()
          : date.getHours().toString();
      const m =
        date.getMinutes() < 10
          ? "0" + date.getMinutes().toString()
          : date.getMinutes().toString();
      const s =
        date.getSeconds() < 10
          ? "0" + date.getSeconds().toString()
          : date.getSeconds().toString();
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    }
    return "";
  }

  public getTime() {
    if (Array.isArray(this.date)) {
      const start = this.getSecond(this.date[0]);
      const end = this.getSecond(this.date[1]);
      return `${start}~${end}`;
    }
    return this.getSecond(this.date);
  }
}

export default Time;
