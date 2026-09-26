import { isRef, unref } from 'vue';

export function unrefDeep<T>(value: T): T {
  if (isRef(value)) {
    return unrefDeep(unref(value) as T);
  }
  if (Array.isArray(value)) {
    return value.map((entry) => unrefDeep(entry)) as T;
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, unrefDeep(entry)]),
    ) as T;
  }
  return value;
}
