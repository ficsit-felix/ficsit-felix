import { remote } from 'electron';
import electron from 'electron';
import { EventBus } from '@/event-bus';
import { Store } from 'vuex';
import {
  DIALOG_PROGRESS,
  DIALOG_OPEN_TIME_MS,
  DIALOG_BUGREPORT
} from '@/ts/constants';
import { v4 } from 'uuid';
import { reportContext } from '@/ts/errorReporting';
import { openFileFromFilesystem } from './openFile';
import Vue from 'vue';
import { saveFileToFilesystem } from './saveFile';

export function getSaveGamesFolderPath() {
  const home = (electron.app || electron.remote.app).getPath('home');
  if (home === '/home/stream') {
    // development test
    return '/home/stream/saves';
  } else {
    return home + '/AppData/Local/FactoryGame/Saved/SaveGames';
  }
}

/**
 * Supply a file path to open the file
 */
export function openFileAndMoveToEditor(
  vue: Vue,
  path: string,
  asJson: boolean
) {
  vue.$store.dispatch('setProgressText', {
    title: vue.$t('openPage.subtitleSav'), // TODO asJson
    currentStep: vue.$t('openPage.readingFile'),
    showCloseButton: false
  });
  vue.$store.dispatch('setProgress', 0);
  EventBus.$emit(DIALOG_PROGRESS, true);
  setTimeout(() => {
    // give the dialog time to be open

    const name = path.replace(/^.*[\\/]/, '');

    vue.$store.dispatch('setFilename', name);
    const uuid = v4();
    vue.$store.dispatch('setUUID', uuid);

    reportContext('uuid', uuid);
    reportContext('savename', name);

    // TODO test for file extension when BugReportDialog is built in

    //      setTimeout(() => {
    console.time('openFile');

    openFileFromFilesystem(path, asJson, (err, progress, saveGame) => {
      if (err) {
        // open bug report window
        EventBus.$emit(DIALOG_BUGREPORT, err.message);
        return;
      }

      if (progress) {
        vue.$store.dispatch('setProgress', progress);
        return;
      }

      console.time('setVuex');
      vue.$store.dispatch('setLoadedData', saveGame).then(() => {
        console.timeEnd('setVuex');
        console.timeEnd('openFile');

        vue.$store.dispatch('setShowSaveMenuEntries', true);
        vue.$router.push({
          name: 'editor'
        });
      });
    });
  }, DIALOG_OPEN_TIME_MS);
}

export function saveFileAndShowProgress(
  vue: Vue,
  path: string,
  asJson: boolean,
  asZip: boolean
) {
  vue.$store.dispatch('setProgress', 0);
  vue.$store.dispatch('setProgressText', {
    title: vue.$t('savePage.savSubtitle'), // TODO asJson
    currentStep: vue.$t('savePage.processingFile'),
    showCloseButton: false
  });

  EventBus.$emit(DIALOG_PROGRESS, true);
  setTimeout(() => {
    // give the dialog time to be open

    saveFileToFilesystem(
      window.data,
      path,
      asJson,
      asZip,
      (err, progress, success) => {
        if (err) {
          // open bug report window
          EventBus.$emit(DIALOG_BUGREPORT, err.message);
          return;
        }

        if (progress) {
          vue.$store.dispatch('setProgress', progress);
          return;
        }

        if (success) {
          vue.$store.dispatch('setProgress', 100);
          vue.$store.dispatch('setProgressText', {
            currentStep: vue.$t('savePage.saveFinished'),
            showCloseButton: true
          });
        }
      }
    );
  }, DIALOG_OPEN_TIME_MS);
}
