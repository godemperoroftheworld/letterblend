import type { Engine } from '@tsparticles/engine';

export async function registerParticles(engine: Engine): Promise<void> {
  // @ts-expect-error i don't care
  const [{ loadSlim }] = await Promise.all([import('@tsparticles/slim')]);
  await loadSlim(engine);
}
