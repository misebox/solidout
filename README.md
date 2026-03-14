# soluid

[![npm version](https://img.shields.io/npm/v/soluid)](https://www.npmjs.com/package/soluid)
[![license](https://img.shields.io/npm/l/soluid)](./LICENSE)

CLI that installs SolidJS UI components directly into your project. Own the code, no runtime dependency.

[Website & Demo](https://misebox.github.io/soluid/)

## Features

- **34 components** — layout, form, data display, feedback, navigation
- **CLI-driven install** — `bunx soluid install`, no manual copy-paste
- **Own the code** — components live in your repo, fully customizable
- **No runtime dependency** — zero JS added to your bundle
- **Dark mode & density** — CSS variable-based theming out of the box
- **TypeScript** — fully typed props for every component

## Usage

No global install required. Run directly:

```sh
bunx soluid init                # create soluid.config.json interactively
bunx soluid install             # download and install components + CSS
bunx soluid add <component...>  # add components to config
bunx soluid remove <comp...>    # remove components from config
bunx soluid list                # list available components
```

## Config

`soluid.config.json`

```json
{
  "componentDir": "src/components/ui",
  "cssPath": "src/styles/soluid.css",
  "components": ["Button", "TextField", "Dialog"]
}
```

`cssPath` receives all component CSS concatenated into a single file.

## Setup

Import CSS in your app entry point:

```tsx
// src/index.tsx
import "./styles/soluid.css";
```

Theme and density switching:

```tsx
document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-density", "dense");
```

## Components (34)

| Category | Components |
| --- | --- |
| Layout | Stack, HStack, Divider, Spacer |
| General | Button, IconButton, Badge, Tag, Tooltip, Avatar |
| Form | FormField, TextField, TextArea, NumberInput, Select, Checkbox, CheckboxGroup, RadioGroup, Switch |
| Data | Table, Card, DescriptionList, Skeleton, EmptyState, Accordion |
| Feedback | Dialog, Drawer, Alert, Toast, Progress, Spinner |
| Navigation | Tabs, Breadcrumb, Pagination, Menu |
| Utility | VisuallyHidden, Popover |

## Core Utilities

`createFocusTrap`, `createToast`, `createToggle`

Installed automatically as dependencies when any component that requires them is added.

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md).
