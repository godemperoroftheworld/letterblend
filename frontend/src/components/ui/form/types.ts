import type { Component } from 'vue';
import type { InputProps } from '@/components/ui/InputField.vue';
import type { SelectProps } from '@/components/ui/SelectField.vue';
import type { RuleExpression } from 'vee-validate';
import type { DropdownProps } from '@/components/ui/AutocompleteField.vue';
import type { FormattedInputProps } from '@/components/ui/FormattedInput.vue';

// FIELD
type FieldComponentProps<T extends PropertyKey> = Partial<
  InputProps<T> & SelectProps<T> & DropdownProps<T> & FormattedInputProps
>;
export type FieldProps<T extends PropertyKey> = {
  // Label
  label?: string;
  labelSize?: 'xs' | 'sm' | 'lg' | 'base';
  // Tootlip
  tooltip?: string;
  uppercase?: boolean;
  // Field
  name: string;
  as: Component;
  rules?: RuleExpression<T>;
  // Array props
  array?: boolean;
  length?: { min?: number; max?: number };
  // Validation
  validateOnMount?: boolean;
  props: FieldComponentProps<T>;
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
