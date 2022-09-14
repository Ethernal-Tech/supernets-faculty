export enum FieldTypeEnum {
	Options = 'Options',
	Boolean = 'Boolean',
	Number = 'Number',
	Currency = 'Currency',
	String = 'String',
	Date = 'Date',
	None = 'None' // filter icon will be hidden
}

export type BaseColumnModel = {
	field: string
	fieldType?: FieldTypeEnum
	visible?: boolean // TODO: prebaciti u TabulatorColumnModel, samo mora prvo da se sredi useVisibleColumns // problem je export
	title: string
	align?: 'left' | 'center' | 'right'
	disableSort?: boolean
	disableFilter?: boolean
	formatter?: ((cell: any, formatterParams: any, onRendered: Function) => string | number | undefined | HTMLDivElement) | string | HTMLDivElement // 'tickCross' for example
	formatterParams?: any
	notInModel?: boolean // used only to mark client side calculated values for easier search in future
	editor?: any;
	editorParams?: any;
	editable?: any;
	tooltip?: ((cell: any, formatterParams: any, onRendered: Function) => string | number | undefined | HTMLDivElement) | string | HTMLDivElement // samo as formatter
	width?: number;
	// FIXME: CSS za frozen ne valja, posto je background za header celije override-ovan da bude unset i onda se header-i vide "ispod" frozen header-a nakon sto se horizontalno skroluje
	// moras napraviti content-background bez transparency i onda setovati tu boju za header tabele
	frozen?: boolean; // freeze the column so it is always visible while horizontal scrolling

	bottomCalc?: any
	bottomCalcFormatter?: (cell: any) => string | number | undefined
}

export type TabulatorColumnModel = BaseColumnModel & {
	// BaseTable is adding those ones
	headerSort?: boolean
}

export type TableColumnType = BaseColumnModel

export type TableColumnsType = {
	[key in string]: BaseColumnModel
}
