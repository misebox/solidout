import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import "./VisuallyHidden.css";

export interface VisuallyHiddenProps {
  children: JSX.Element;
}

export function VisuallyHidden(props: VisuallyHiddenProps) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <span class="soui-visually-hidden" {...others}>
      {local.children}
    </span>
  );
}
