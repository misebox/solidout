import { splitProps, Show, createUniqueId } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import { FormFieldContext } from "./FormFieldContext";
import type { FormFieldContextValue } from "./FormFieldContext";
import "./FormField.css";

export interface FormFieldProps extends CommonProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: JSX.Element;
}

export function FormField(props: FormFieldProps) {
  const [local, others] = splitProps(props, [
    "class",
    "label",
    "error",
    "hint",
    "required",
    "children",
  ]);

  const id = createUniqueId();
  const fieldId = `soui-field-${id}`;
  const errorId = `soui-field-error-${id}`;
  const hintId = `soui-field-hint-${id}`;

  const context: FormFieldContextValue = {
    get id() {
      return fieldId;
    },
    get errorId() {
      return errorId;
    },
    get hintId() {
      return hintId;
    },
    get hasError() {
      return !!local.error;
    },
  };

  return (
    <FormFieldContext.Provider value={context}>
      <div
        class={cls(
          "soui-form-field",
          local.error && "soui-form-field--error",
          local.class,
        )}
        {...others}
      >
        <label class="soui-form-field__label" for={fieldId}>
          {local.label}
          <Show when={local.required}>
            <span class="soui-form-field__required" aria-hidden="true">
              *
            </span>
          </Show>
        </label>
        {local.children}
        <Show when={local.error}>
          <p class="soui-form-field__error" id={errorId} role="alert">
            {local.error}
          </p>
        </Show>
        <Show when={!local.error && local.hint}>
          <p class="soui-form-field__hint" id={hintId}>
            {local.hint}
          </p>
        </Show>
      </div>
    </FormFieldContext.Provider>
  );
}
