import type { Component } from 'vue';
import type { RuleExpression } from 'vee-validate';
import type { ComponentProps } from 'vue-component-type-helpers';
// FIELD
export type FieldProps<T extends PropertyKey, C extends Component = Component> = {
  // Label
  label?: string;
  labelSize?: 'xs' | 'sm' | 'lg' | 'base';
  // Tootlip
  tooltip?: string;
  uppercase?: boolean;
  // Field
  name: string;
  as: C;
  rules?: RuleExpression<T>;
  // Array props
  array?: boolean;
  length?: { min?: number; max?: number };
  // Validation
  validateOnMount?: boolean;
  props?: ComponentProps<C>;
};

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
  submitted: (data: FormValueType<T>) => void | Promise<void>;
  showSubmitButton?: boolean;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  submitButtonText?: string;
  defaults?: T;
  loading?: boolean;
}
