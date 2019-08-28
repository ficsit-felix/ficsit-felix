import { remote } from 'electron';

export function getSaveGamesFolderPath() {
  return remote.app.getPath('home') +
    '/AppData/Local/FactoryGame/Saved/SaveGames';
}