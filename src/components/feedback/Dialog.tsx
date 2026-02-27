import { splitProps, Show, createSignal, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import { createFocusTrap } from "../../primitives/createFocusTrap";
import "./Dialog.css";

export interface DialogProps extends CommonProps {
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
  children: JSX.Element;
}

export interface DialogHeaderProps {
  class?: string;
  children: JSX.Element;
}

export interface DialogBodyProps {
  class?: string;
  children: JSX.Element;
}

export interface DialogFooterProps {
  class?: string;
  children: JSX.Element;
}

export function Dialog(props: DialogProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "open",
    "onClose",
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
          class="soui-dialog-backdrop"
          onClick={handleBackdropClick}
          {...others}
        >
          <div
            ref={setContainerRef}
            class={cls(
              "soui-dialog",
              `soui-dialog--${local.size ?? "md"}`,
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

export function DialogHeader(props: DialogHeaderProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("soui-dialog__header", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function DialogBody(props: DialogBodyProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("soui-dialog__body", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function DialogFooter(props: DialogFooterProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("soui-dialog__footer", local.class)} {...others}>
      {local.children}
    </div>
  );
}
