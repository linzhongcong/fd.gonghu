import Vue from 'vue';

function download(url, fileName = '') {
  fileName = fileName || url.split('/').pop().split('.')[0];
  let a = document.createElement('a');
  a.setAttribute('id', 'downLoad');
  a.setAttribute('download', fileName);
  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  a.click();
  a = null;
}

Vue.prototype.$download = download;