import type { MaybeRef } from '@vueuse/core';
import { isRef, unref } from 'vue';

type MaybeDeepRefObject<T extends object> = {
  [Property in keyof T]: MaybeDeepRef<T[Property]>;
};
type MaybeDeepRefArray<T extends Array<unknown>> = Array<MaybeDeepRef<T[number]>>;
export type MaybeDeepRef<T> = MaybeRef<
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  T extends Function
    ? T
    : T extends object
      ? MaybeDeepRefObject<T>
      : T extends Array<unknown>
        ? MaybeDeepRefArray<T>
        : T
>;
export function unrefDeep<T>(obj: MaybeDeepRef<T>): T {
  if (isRef(obj)) {
    return unrefDeep(unref(obj));
  } else if (Array.isArray(obj)) {
    return unrefArray(obj) as T;
  } else if (typeof obj === 'object') {
    return unrefObject(obj as object) as T;
  } else {
    return obj as T;
  }
}

function unrefArray<T extends Array<unknown>>(array: Array<MaybeDeepRef<T[number]>>): T {
  return array.map((x) => unrefDeep(x)) as T;
}

function unrefObject<T extends object>(obj: {
  [Property in keyof T]: MaybeDeepRef<T[Property]>;
}): T {
  const deepUnref = {} as T;
  Object.entries(obj).forEach(([key, value]) => {
    deepUnref[key as keyof T] = unrefDeep(value) as T[keyof T];
  });
  return deepUnref;
}
