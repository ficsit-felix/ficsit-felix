export function isElectron() {
  var userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf(' electron/') > -1;
}
