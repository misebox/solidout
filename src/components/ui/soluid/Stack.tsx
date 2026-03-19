import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface StackProps extends CommonProps {
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  children: JSX.Element;
}

export function Stack(props: StackProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "gap", "align", "justify", "children"]);

  return (
    <div
      class={cls(
        "so-stack",
        local.gap !== undefined && `so-stack--gap-${local.gap}`,
        local.align && `so-stack--align-${local.align}`,
        local.justify && `so-stack--justify-${local.justify}`,
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}
