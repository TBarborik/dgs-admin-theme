import $ from "jquery"
import "@dgstudio/admin-theme/src/js/components/datatable/core.datatable"

/**
 * Response object:
 * {
 *     records: [],
 *     layout: {
 *         scroll: boolean,
 *         footer: boolean
 *     },
 *     sortable: boolean,
 *     pagination: boolean,
 *     draggable?: null | string,
 *     search: {
 *         input: string,
 *         key: string
 *     },
 *     filters: search: {
 *         input: string,
 *         key: string
 *     }[],
 *     columns: {
 *          field: string,
 *          title: string,
 *          sortable: boolean | "asc" | "desc",
 *          width: number,
 *          autoHide: boolean,
 *          overflow: string,
 *          type: string,
 *          format: string,
 *          textAlign: string,
 *          selector: {class: string},
 *          template: string
 *     }[]
 *     actions?: {
 *       icon: string,
 *       blank: boolean,
 *       label: string,
 *       name: string
 *     }[]
 * }
 */

export class Datatable {
	/** @type {Object} */
	DEFAULT_OPTIONS = {
		layout: {
			theme: "default",
		},
		draggable: null,
	}

	/** @type {HTMLDivElement|null} */
	_tableEl = null

	/** @type {CoreDatatable | null} */
	_datatable = null

	/** @type {string} */
	_selector = ""

	/** @type {Object} */
	_options = {}

	/** @type {HTMLElement} */
	_draggedEl = null

	dragStartHandler = this._handleDragStart.bind(this)
	dragOverHandler = this._handleDragOver.bind(this)
	dragEndHandler = this._handleDragEnd.bind(this)

	constructor(selector = "#kt_datatable") {
		this._selector = selector
		this._tableEl = document.querySelector(selector)
	}

	setOptions(options) {
		this._options = {...this.DEFAULT_OPTIONS, ...options}
	}

	render() {
		const processedData = this._processData(this._options)
		this._datatable = $(this._tableEl).KTDatatable(processedData)

		if (Object.prototype.hasOwnProperty.call(processedData, "filters")) {
			processedData["filters"].forEach(filter => {
				$(filter.input).on('change', (ev) => {
					this._datatable.search(ev.target.value.toLowerCase(), filter.key)
				})
			})
		}


		$(this._tableEl).on('datatable-on-layout-updated', this._handleLayoutUpdated.bind(this))
	}

	rerender() {
		if (this._datatable === null) {
			throw new Error("Cannot rerender nonexistent datatable.")
		}

		this._datatable.dataRender()
	}

	getSelection() {
		return this._datatable.getSelectedRecords()
	}

	_processData(originalData) {
		const data = {...originalData}

		if (!Object.prototype.hasOwnProperty.call(originalData, "data")) {
			data["data"] = {
				type: "local",
				source: data.records,
				pageSize: 10,
			}
		}

		if (Object.prototype.hasOwnProperty.call(data, "search")) {
			data["search"]["input"] = $(data["search"]["input"])
		}

		for (let key in data["columns"]) {
			data["columns"][key] = Object.fromEntries(Object.entries(data["columns"][key]).filter(([_, value]) => value !== null))

			if (Object.prototype.hasOwnProperty.call(data["columns"][key], "selector") && data["columns"][key]["selector"]["class"] === null) {
				delete data["columns"][key]["selector"]
			}

			if (Object.prototype.hasOwnProperty.call(data["columns"][key], "template") && data["columns"][key]["template"] !== null) {
				data["columns"][key]["templateString"] = data["columns"][key]["template"]
				data["columns"][key]["template"] = function (record) {
					return eval(data["columns"][key]["templateString"])
				}
			}
		}

		data["layout"] = {theme: "default"}

		if (Object.prototype.hasOwnProperty.call(data, "actions") && !!data.actions) {
			data["columns"].push(this._prepareActions(data.actions))
		}
		return data
	}

	_prepareActions(actions) {
		return {
			field: 'Actions',
			title: Object.prototype.hasOwnProperty.call(this._options.translate, "actions") ? this._options.translate["actions"] : 'Actions',
			sortable: false,
			width: 130,
			overflow: 'visible',
			textAlign: 'right',
			template: function (row, index, datatable) {
				let template = ""

				for (const action of actions) {
					if (Object.prototype.hasOwnProperty.call(row, action.name)) {
						let classes = "btn btn-sm btn-hover-secondary "
						if (!!action.icon && !action.text) {
							classes += " btn-icon btn-pill"
						}
						template += '<a href="' + row[action.name] + '" ' + (!!action.blank ? 'target="_blank"' : '')
							+ ' class="' + classes + '" title="' + action.label + '" data-toggle="tooltip">'
							+ (!!action.icon ? '<i class="' + action.icon + '"></i>' : action.label) + action.text
							+ '</a>'
					}
				}
				return template
			},
		}
	}

	_handleLayoutUpdated(ev, {table}) {
		const defaultSort = this._datatable.getDefaultSortColumn()
		const currentSort = this._datatable.getDataSourceParam("sort")

		if (!this._options.draggable || typeof defaultSort === "undefined")
			return

		const tbody = this._tableEl.querySelector("tbody")
		const rows = tbody.querySelectorAll("tr")

		rows.forEach(row => {
			row.draggable = false
			row.removeEventListener("dragstart", this.dragStartHandler)
			row.removeEventListener("dragover", this.dragOverHandler)
			row.removeEventListener("dragend", this.dragEndHandler)
		})

		if (currentSort !== null && (currentSort.field !== defaultSort.field || currentSort.sort !== defaultSort.sort)) {
			return
		}

		rows.forEach(row => {
			row.draggable = true
			row.addEventListener("dragstart", this.dragStartHandler)
			row.addEventListener("dragover", this.dragOverHandler)
			row.addEventListener("dragend", this.dragEndHandler)
		})
	}

	_handleDragStart(ev) {
		let el = ev.target
		while (el !== null && el.nodeName !== "TR")
			el = el.parentElement

		this._draggedEl = el
	}

	_handleDragOver(ev) {
		ev.preventDefault()

		/** @type {HTMLElement} */
		let el = ev.target
		while (el !== null && el.nodeName !== "TR")
			el = el.parentElement

		if (el !== null) {
			const rows = Array.from(el.parentElement.querySelectorAll("tr"))

			if (rows.indexOf(el) > rows.indexOf(this._draggedEl)) {
				el.after(this._draggedEl)
			} else {
				el.before(this._draggedEl)
			}
		}
	}

	_handleDragEnd(ev) {
		ev.preventDefault()

		const rows = Array.from(this._draggedEl.parentElement.querySelectorAll("tr")).map(row => parseInt(row.dataset.row))
		const dataEntries = Array.from(this._datatable.getDataSet().entries())
		rows.forEach((id, pos) => {
			dataEntries[id][0] = pos
			return dataEntries
		})

		const formData = new FormData()
		Object.values(Object.fromEntries(dataEntries)).forEach((data) => formData.append("ids[]", data.id))
		fetch(this._options.draggable, {method: "POST", body: formData})
	}
}

if (typeof datatables !== "undefined") {
	const tables = {}
	datatables.forEach(({id, params}) => {
		const table = new Datatable("#" + id)
		table.setOptions(JSON.parse(params))
		table.render()
		tables[id] = table
	})

	const groupActions = document.querySelectorAll("[data-group-action]")
	groupActions.forEach((el) => {
		el.addEventListener("click", (ev) => {
			ev.preventDefault()
			const table = tables[el.dataset.groupAction]
			const selection = table.getSelection()
			const selectedID = []
			for (let i = 0; i < selection.length; i++) {
				selectedID.push(parseInt(selection[i].querySelector("[data-field='id']").getAttribute("aria-label")))
			}

			fetch(el.href, {
				method: "POST",
				mode: 'cors',
				cache: 'no-cache',
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify(selectedID),
			}).then(response => {
				if (response.ok) {
					const table = tables[el.dataset.groupAction]
					table.rerender()
					return response.json()
				}
			}).then(data => {
				if (typeof data !== "undefined") {
					if (Object.prototype.hasOwnProperty.call(data, "redirect")) {
						const redirectData = data["redirect"]
						open(redirectData["url"], redirectData["target"])
					}
				}
			})
		})
	})
}