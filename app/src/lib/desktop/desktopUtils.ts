import { remote } from 'electron';
import { EventBus } from '@lib/event-bus';
import { Store } from 'vuex';
import {
  DIALOG_PROGRESS,
  DIALOG_OPEN_TIME_MS,
  DIALOG_BUGREPORT
} from '@lib/constants';
import { v4 } from 'uuid';
import { reportContext } from '@lib/errorReporting';
import { openFileFromFilesystem } from './openFile';
import Vue from 'vue';
import { saveFileToFilesystem } from './saveFile';
import { SaveFileReader, SaveGameLoading } from '../core/SaveGameLoading';
import { SaveFileWriter, SaveGameSaving } from '../core/SaveGameSaving';
import { SaveGame } from 'satisfactory-json';
