export function getSaveFilesPath(): string {
  /*this.saveFilesPath = 
          (electron.app || electron.remote.app).getPath('home') +
          '/AppData/Local/FactoryGame/Saved/SaveGames';*/

  return '/home/stream/saves';
}
