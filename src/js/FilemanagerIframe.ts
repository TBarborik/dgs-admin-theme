class FilemanagerIframe {
	private iframeContainer: HTMLDivElement | null
	private fileButtons: HTMLButtonElement[] = []

	constructor() {
		this.iframeContainer = document.getElementById("_filemanager_iframe-container") as HTMLDivElement | null

		if (this.iframeContainer)
			this.init()
	}

	private init() {
		this.fileButtons = Array.from(this.iframeContainer!.querySelectorAll<HTMLButtonElement>("button._filemanager_file-button"))

		this.fileButtons.forEach(this.initBtn.bind(this))
	}

	private initBtn(btn: HTMLButtonElement) {
		btn.addEventListener("click", this.handleBtnClick.bind(this))
	}

	private handleBtnClick(ev: MouseEvent) {
		ev.preventDefault()

		let btn: HTMLElement | null = ev.target as HTMLElement
		while (btn !== null && btn.nodeName !== "BUTTON")
			btn = btn.parentElement

		if (window.parent && btn !== null) {
			window.parent.postMessage({id: btn.dataset.id, name: btn.dataset.name}, "*")
		}
	}
}

export {FilemanagerIframe}