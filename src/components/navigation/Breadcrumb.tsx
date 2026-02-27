import { splitProps, Show } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import "./Breadcrumb.css";

export interface BreadcrumbProps extends CommonProps {
  children: JSX.Element;
}

export interface BreadcrumbItemProps {
  href?: string;
  current?: boolean;
  class?: string;
  children: JSX.Element;
}

export function Breadcrumb(props: BreadcrumbProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "children",
  ]);

  return (
    <nav
      class={cls("soui-breadcrumb", local.class)}
      aria-label="Breadcrumb"
      data-density={local.density}
      {...others}
    >
      <ol class="soui-breadcrumb__list">{local.children}</ol>
    </nav>
  );
}

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const [local, others] = splitProps(props, [
    "href",
    "current",
    "class",
    "children",
  ]);

  return (
    <li
      class={cls(
        "soui-breadcrumb__item",
        local.current && "soui-breadcrumb__item--current",
        local.class,
      )}
      {...(local.current ? { "aria-current": "page" } : {})}
      {...others}
    >
      <Show
        when={local.href && !local.current}
        fallback={<span>{local.children}</span>}
      >
        <a href={local.href}>{local.children}</a>
      </Show>
    </li>
  );
}
