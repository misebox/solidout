import { splitProps, Show, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import { createFocusTrap } from "../../primitives/createFocusTrap";
import "./Drawer.css";

export interface DrawerProps extends CommonProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg";
  children: JSX.Element;
}

export function Drawer(props: DrawerProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "open",
    "onClose",
    "side",
    "size",
    "children",
  ]);

  const [containerRef, setContainerRef] = createSignal<HTMLElement | undefined>(
    undefined,
  );

  createFocusTrap({
    container: containerRef,
    isActive: () => local.open,
    onClose: () => local.onClose(),
  });

  function handleBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      local.onClose();
    }
  }

  return (
    <Show when={local.open}>
      <Portal>
        <div
          class="soui-drawer-backdrop"
          onClick={handleBackdropClick}
          {...others}
        >
          <div
            ref={setContainerRef}
            class={cls(
              "soui-drawer",
              `soui-drawer--${local.side ?? "right"}`,
              `soui-drawer--${local.size ?? "md"}`,
              local.class,
            )}
            role="dialog"
            aria-modal="true"
            data-density={local.density}
          >
            {local.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
