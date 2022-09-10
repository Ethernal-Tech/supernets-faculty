// rules for svg icons:
// - size should be 1024 x 1024 (for resizing square icons: https://www.iloveimg.com/resize-image/resize-svg)
// - all styles and unneeded stuff should be manually removed from svg file

export { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow_down.svg';
export { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';
export { ReactComponent as CheckIcon } from 'assets/icons/check.svg';
export { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
export { ReactComponent as InfoIcon } from 'assets/icons/info.svg';
export { ReactComponent as WarningIcon } from 'assets/icons/warning.svg';

export type IconType = React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
}>
