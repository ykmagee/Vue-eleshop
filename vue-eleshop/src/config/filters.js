import Vue from 'vue';
import format from 'date-fns/format';
// 自定义过滤器，用date-fns处理时间戳输出为想要的格式
Vue.filter('date-format', function (value, formatStr = 'YYYY-MM-DD') {
  return format(value, formatStr);
})
