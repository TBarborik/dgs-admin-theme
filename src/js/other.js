import {Actions} from "./components/Actions"

class Other {
	constructor() {
		this._init()
	}

	initialize(naja) {
		naja.addEventListener("success", this._najaReinit.bind(this))
	}

	_init() {
		Actions.init()
	}

	_najaReinit() {

	}
}

const other = new Other()
export {other}