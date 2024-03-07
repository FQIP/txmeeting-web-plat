import dayjs from "dayjs";
import zhCNLocale from 'dayjs/locale/zh-cn';

/**
 * 快速创建一个时间格式化函数工厂
 * @param {string} temp 
 * @return {(dt:dayjs.ConfigType) =>string}
 */
export function fastParseTimeFactory(temp) {
  return function (dt) {
    const rs = dayjs(dt).locale(zhCNLocale);
    return rs.format(temp);
  }
}