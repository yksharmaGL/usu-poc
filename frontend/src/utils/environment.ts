export const isClient = typeof window !== 'undefined';
export const isServer = !isClient;

export function onClient<T>(callback: () => T): T | undefined {
  if (isClient) {
    return callback();
  }
  return undefined;
}

export function onServer<T>(callback: () => T): T | undefined {
  if (isServer) {
    return callback();
  }
  return undefined;
}
