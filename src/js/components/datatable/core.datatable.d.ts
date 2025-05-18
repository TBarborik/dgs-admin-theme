type CoreDatatable = {
	originalDataSet: any[],
	dataSet: any[],
	dataRender: () => void,
	search: (value: string | number, columns: undefined | object) => void,
	getSelectedRecords: () => HTMLTableRowElement[],
	getDataSet: () => any[],
	getDefaultSortColumn: () => undefined | ({sort: "asc" | "desc", field: string}),
	getDataSourceParam: (param: name) => null | any
}

export {CoreDatatable}
