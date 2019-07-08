import Vue from 'vue';
import * as Sentry from '@sentry/browser';

export function reportError(error: Error) {
  Sentry.captureException(error);
}

export function reportException(message: string) {
  Sentry.captureException(message);
}

export function reportMessage(message: string) {
  Sentry.captureMessage(message);
}

export function reportContext(key: string, value: string) {
  Sentry.configureScope(scope => {
    scope.setTag(key, value);
  });
}
