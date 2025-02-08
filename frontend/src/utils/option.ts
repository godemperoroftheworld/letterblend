export interface Option<T extends PropertyKey | boolean> {
  label: string;
  id: T;
}

export function enumToOption<E extends object>(e: E) {
  const enumEntries = Object.entries(e);
  // Object entries puts the enum twice, once with key first and once with value first
  // This is hacky fix
  const fixedEntries = enumEntries.slice(0, enumEntries.length / 2) as [E[keyof E], keyof E][];
  return fixedEntries.map(([key, value]) => {
    return { label: value, id: key } as Option<E[keyof E] & PropertyKey>;
  });
}
