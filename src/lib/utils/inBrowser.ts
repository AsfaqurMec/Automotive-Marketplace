export const getWindow = () => (typeof window === 'undefined' ? undefined : window);

export const inBrowser = <T>(fn: () => T, defaultReturn: T): T => {
  if (typeof window === 'undefined' || typeof fn !== 'function') {
    return defaultReturn;
  }
  return fn();
};

export default inBrowser;

