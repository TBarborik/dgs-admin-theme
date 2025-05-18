import $ from "jquery"
import "bootstrap/js/src/tab"
import "bootstrap/js/src/dropdown"
import "bootstrap/js/src/tooltip"


class Bootstrap {
	constructor() {
		this._init()
	}

	initialize(naja) {
		naja.addEventListener("success", this._najaReinit.bind(this))
	}

	_init() {
		$('[data-toggle="tab"]').tab()
		$('[data-toggle="dropdown"]').dropdown()
		$('[data-toggle="tooltip"]').tooltip()
	}

	_najaReinit() {

	}
}

const bootstrap = new Bootstrap()
export {bootstrap}