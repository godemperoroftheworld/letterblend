import type { Component, UnwrapRef } from 'vue';
import type { InputProps } from '@/components/InputField.vue';
import type { SelectProps } from '@/components/SelectField.vue';
import type { RuleExpression } from 'vee-validate';
import type { DefaultError, UseMutationReturnType } from '@tanstack/vue-query';

// FIELD
type FieldComponentProps<T extends PropertyKey> = Partial<InputProps & SelectProps<T>>;
export type FieldProps<T extends PropertyKey> = {
  label: string;
  name: string;
  as: Component;
  rules?: RuleExpression<T>;
  uppercase?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnInput?: boolean;
} & FieldComponentProps<T>;

// FORM
export interface FormObject {
  [x: string]: PropertyKey;
}
export type FormFields<T extends FormObject> = {
  [K in keyof T]: T[K] extends PropertyKey
    ? Omit<FieldProps<T[K]>, 'name'>
    : Omit<FieldProps<PropertyKey>, 'name'>;
};
export type FormValueType<T> = { [P in keyof T]: unknown extends T[P] ? PropertyKey : T[P] };
export interface FormProps<T extends FormObject> {
  name: string;
  fields: FormFields<T>;
  submitted: (data: FormValueType<T>) => Promise<void>;
  showSubmitButton?: boolean;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  defaults?: T;
}

// DATA FORM
export type StrippedFormProps<V extends FormObject> = Omit<FormProps<V>, 'submitted'>;
export type DataFormProps<T, V extends FormObject> = StrippedFormProps<V> & {
  mutation: () => UseMutationReturnType<T, DefaultError, V, unknown, unknown>;
  fields: FormFields<UnwrapRef<V>>;
};
