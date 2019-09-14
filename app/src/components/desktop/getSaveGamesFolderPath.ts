import electron from 'electron';
export function getSaveGamesFolderPath() {
  const home = (electron.app || electron.remote.app).getPath('home');
  if (home === '/home/stream') {
    // development test
    return '/home/stream/saves';
  } else {
    return home + '/AppData/Local/FactoryGame/Saved/SaveGames';
  }
}
