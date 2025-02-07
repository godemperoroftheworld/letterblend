export async function waitUntil(condition: () => Promise<boolean>) {
  const result = await condition();
  if (!result) {
    return new Promise((resolve, reject) => {
      setTimeout(() => waitUntil(condition).then(resolve).catch(reject), 100);
    });
  }
  return result;
}
