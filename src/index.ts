// nekodemo の公開 API。部品は src/components/ui/<name>/index.tsx を正とする。

// Form 用。利用側が react-hook-form / zod を別途インストールしなくてよいように再 export する
// （pnpm の厳密な node_modules で解決できない問題と、バージョン不一致による FormProvider の二重化を防ぐ）
export { zodResolver } from "@hookform/resolvers/zod";
export {
  type SubmitHandler,
  type UseFormReturn,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
export { z } from "zod";
export { Mascot } from "./components/mascot";
export { NekoHead } from "./components/theme/NekoHead";
export { NekoThemePicker } from "./components/theme/NekoThemePicker";
export {
  type NekoThemeContextValue,
  NekoThemeProvider,
  useNekoTheme,
} from "./components/theme/NekoThemeProvider";
export { Avatar, type AvatarProps } from "./components/ui/avatar";
export { Badge, type BadgeProps, badgeVariants } from "./components/ui/badge";
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
export { Button, type ButtonProps, buttonVariants } from "./components/ui/button";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
export { Checkbox, type CheckboxProps } from "./components/ui/checkbox";
export {
  DataGrid,
  type DataGridColumn,
  type DataGridProps,
  type DataGridStatus,
} from "./components/ui/data-grid";
export {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
export { Divider, type DividerProps } from "./components/ui/divider";
export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./components/ui/drawer";
export { EmptyState, type EmptyStateProps } from "./components/ui/empty-state";
export {
  Field,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./components/ui/form";
export { ICON_SIZES, Icon, type IconProps, type IconSize } from "./components/ui/icon";
export {
  type IconDef,
  type IconTier,
  iconAliases,
  iconNames,
  icons,
} from "./components/ui/icon/icons.generated";
export { IconButton, type IconButtonProps, iconButtonVariants } from "./components/ui/icon-button";
export {
  InlineMessage,
  type InlineMessageProps,
  inlineMessageVariants,
} from "./components/ui/inline-message";
export { Input, type InputProps, inputVariants } from "./components/ui/input";
export { InputPassword, type InputPasswordProps } from "./components/ui/input-password";
export { InputSearch, type InputSearchProps } from "./components/ui/input-search";
export { Link, type LinkProps } from "./components/ui/link";
export {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from "./components/ui/menu";
export {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "./components/ui/modal";
export { Pagination, type PaginationProps, pageItems } from "./components/ui/pagination";
export {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "./components/ui/popover";
export { RadioGroup, RadioItem } from "./components/ui/radio";
export {
  SearchCombobox,
  type SearchComboboxProps,
  type SearchComboboxSize,
} from "./components/ui/search-combobox";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
export {
  SideNavGroup,
  SideNavItem,
  type SideNavItemProps,
  SideNavigation,
  type SideNavigationProps,
} from "./components/ui/side-navigation";
export { Skeleton, SkeletonRows } from "./components/ui/skeleton";
export { Slider, type SliderProps } from "./components/ui/slider";
export { Spinner, type SpinnerProps } from "./components/ui/spinner";
export { Switch, type SwitchProps } from "./components/ui/switch";
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  type TableDensity,
  TableFooter,
  TableHead,
  TableHeader,
  type TableHeadProps,
  TableRow,
} from "./components/ui/table";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
export {
  StatusTag,
  type StatusTagProps,
  statusTagVariants,
  Tag,
  type TagProps,
  tagVariants,
} from "./components/ui/tag";
export { Textarea, type TextareaProps } from "./components/ui/textarea";
export { Toaster, toast } from "./components/ui/toast";
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
export { cn } from "./lib/utils";
export {
  defaultNekoTheme,
  isNekoThemeId,
  NEKO_THEME_STORAGE_KEY,
  type NekoTheme,
  type NekoThemeId,
  nekoThemeIds,
  nekoThemes,
} from "./themes/registry";
