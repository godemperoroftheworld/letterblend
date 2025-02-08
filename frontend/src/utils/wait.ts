import type { MaybePromise } from 'vee-validate';

export async function waitUntil(condition: () => MaybePromise<boolean>) {
  const result = await condition();
  if (!result) {
    return new Promise((resolve, reject) => {
      setTimeout(() => waitUntil(condition).then(resolve).catch(reject), 100);
    });
  }
  return result;
}
