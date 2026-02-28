// Core
export {
  SolidoutProvider,
  useSolidout,
  createTheme,
} from "./core";
export type {
  SolidoutProviderProps,
  SolidoutContextValue,
  Density,
  Size,
  Variant,
  ButtonVariant,
  FeedbackVariant,
  CommonProps,
  InteractiveProps,
  VariantProps,
  ColorDefinition,
  DateFormatConfig,
  ThemeConfig,
} from "./core";

// Primitives
export {
  createDisclosure,
  createFocusTrap,
  createToggle,
  createToast,
  createPagination,
} from "./primitives";
export type {
  DisclosureOptions,
  DisclosureReturn,
  FocusTrapOptions,
  ToggleOptions,
  ToggleReturn,
  Toast,
  ToastOptions,
  ToastInput,
  ToastReturn,
  PaginationOptions,
  PaginationReturn,
} from "./primitives";

// Layout
export { Stack, HStack, Divider, Spacer } from "./components/layout";
export type { StackProps, HStackProps, DividerProps } from "./components/layout";

// General
export { Button, IconButton, Badge, Tag, Tooltip } from "./components/general";
export type {
  ButtonProps,
  IconButtonProps,
  BadgeProps,
  TagProps,
  TooltipProps,
} from "./components/general";

// Form
export {
  FormField,
  TextField,
  TextArea,
  NumberInput,
  Select,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  RadioButton,
  Switch,
} from "./components/form";
export type {
  FormFieldProps,
  TextFieldProps,
  TextAreaProps,
  NumberInputProps,
  SelectProps,
  CheckboxProps,
  CheckboxGroupProps,
  RadioGroupProps,
  RadioButtonProps,
  SwitchProps,
} from "./components/form";

// Data Display
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  DescriptionList,
  Skeleton,
  EmptyState,
  Table,
} from "./components/data";
export type {
  CardProps,
  DescriptionListProps,
  SkeletonProps,
  EmptyStateProps,
  TableProps,
  Column,
} from "./components/data";

// Feedback
export {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Drawer,
  Alert,
  ToastContainer,
  useToast,
  Progress,
  Spinner,
} from "./components/feedback";
export type {
  DialogProps,
  DrawerProps,
  AlertProps,
  ToastContainerProps,
  ProgressProps,
  SpinnerProps,
} from "./components/feedback";

// Navigation
export {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  Menu,
} from "./components/navigation";
export type {
  TabsProps,
  BreadcrumbProps,
  BreadcrumbItemProps,
  PaginationProps,
  MenuProps,
} from "./components/navigation";

// Utility
export { VisuallyHidden, Popover } from "./components/utility";
export type {
  VisuallyHiddenProps,
  PopoverProps,
} from "./components/utility";
