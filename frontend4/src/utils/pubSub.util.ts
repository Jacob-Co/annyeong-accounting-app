export function subscribe(eventName: string, customHandlerFunction: Function) {
  const eventHandler = function(event: Event) {
    customHandlerFunction(event);
  };

  document.addEventListener(eventName, eventHandler);

  return {
    unsubscribe: function unsubscribe() {
      document.removeEventListener(eventName, eventHandler);
    }
  }
}

export function publish(eventName: string, args: any = {}) {
  const customEvent = new CustomEvent(eventName, args);
  document.dispatchEvent(customEvent);
}
