import { splitProps, Show } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import { useRadioGroup } from "./RadioGroupContext";
import "./RadioButton.css";

export interface RadioButtonProps extends CommonProps {
  value: string;
  label?: string;
  disabled?: boolean;
  children?: JSX.Element;
}

export function RadioButton(props: RadioButtonProps) {
  const [local, others] = splitProps(props, [
    "class",
    "value",
    "label",
    "disabled",
    "children",
  ]);

  const group = useRadioGroup();

  const isChecked = () => group?.value() === local.value;

  const handleChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = () => {
    group?.onChange(local.value);
  };

  return (
    <label
      class={cls(
        "soui-radio-button",
        local.disabled && "soui-radio-button--disabled",
        local.class,
      )}
    >
      <input
        type="radio"
        class="soui-radio-button__input"
        name={group?.name}
        value={local.value}
        checked={isChecked()}
        disabled={local.disabled}
        onChange={handleChange}
      />
      <span class="soui-radio-button__indicator" aria-hidden="true">
        <span class="soui-radio-button__dot" />
      </span>
      <Show when={local.label || local.children}>
        <span class="soui-radio-button__label">
          {local.children ?? local.label}
        </span>
      </Show>
    </label>
  );
}
