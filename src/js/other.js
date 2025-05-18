import $ from "jquery"
import "select2"
import {Actions} from "./components/Actions"

class Other {
	constructor() {
		this._init()
	}

	initialize(naja) {
		naja.addEventListener("success", this._najaReinit.bind(this))
	}

	_init() {
		$('select.form-control').select2({
			language: "en",
		})

		Actions.init()
	}

	_najaReinit() {

	}
}

const other = new Other()
export {other}