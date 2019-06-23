import Vue from "vue";

export function reportError(error: Error) {
  // @ts-ignore
  Vue.rollbar.error(error);
  // Sentry.captureException(error);
}

export function reportException(message: string) {
  // @ts-ignore
  Vue.rollbar.warn(error);
  // Sentry.captureException(error);
}

export function reportMessage(message: string) {
  // @ts-ignore
  Vue.rollbar.debug(message);
  // Sentry.captureMessage(message);
}

export function reportContext(key: string, value: string) {
  const payload: any = {};
  payload[key] = value;

  // @ts-ignore
  Vue.rollbar.configure({
    payload: {
      person: payload
    }
  });
  /*Sentry.configureScope(scope => {
    scope.setExtra(key, value);
  });*/
}
