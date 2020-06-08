// Problems: This removes the check in vscode if the file exists
// But if this file does not exist, we cannot import Vue components in .ts files
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
