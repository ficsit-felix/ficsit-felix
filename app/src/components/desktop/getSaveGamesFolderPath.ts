import electron from 'electron';
import { normalize } from 'path';
export function getSaveGamesFolderPath() {
  const home = (electron.app || electron.remote.app).getPath('home');
  if (home === '/home/stream') {
    // development test
    return '/home/stream/saves';
  } else if (home === '/home/bitowl') {
    return '/home/bitowl/saves';
  } else {
    return home + normalize('/AppData/Local/FactoryGame/Saved/SaveGames');
  }
}
