import { remote } from 'electron';
import { EventBus } from '@/event-bus';
import { Store } from 'vuex';
import { DIALOG_PROGRESS, DIALOG_OPEN_TIME_MS } from '@/ts/constants';
import { v4 } from 'uuid';
import { reportContext } from '@/ts/errorReporting';
import { openFileFromFilesystem } from './openFile';
import Vue from 'vue';
import { saveFileToFilesystem } from './saveFile';

export function getSaveGamesFolderPath() {
  /*this.saveFilesPath = 
        (electron.app || electron.remote.app).getPath('home') +
        '/AppData/Local/FactoryGame/Saved/SaveGames';*/

  return '/home/stream/saves';
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
        // TODO open bug report window
        console.error(err);
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
          // TODO open bug report window
          console.error(err);
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
