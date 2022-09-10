// rules for svg icons:
// - size should be 1024 x 1024 (for resizing square icons: https://www.iloveimg.com/resize-image/resize-svg)
// - all styles and unneeded stuff should be manually removed from svg file

export { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';

export type IconType = React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
}>
