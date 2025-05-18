import {Modal} from "bootstrap"

class FileManager {
	public static readonly FILEMANAGER_SRC: string = "/admin/files/iframe"
	private triggers: HTMLButtonElement[] = []
	private dialogEl: HTMLDivElement | null = null
	private iframeEl: HTMLIFrameElement | null = null
	private dialog: Modal | null = null
	private curId: string | null = null

	constructor() {
		this.triggers = Array.from(document.querySelectorAll("button[data-file-manager]"))

		if (this.triggers.length > 0)
			this.init()
	}

	private init() {
		this.dialogEl = this.createDialog()
		this.iframeEl = this.createIframe()
		this.dialogEl.querySelector(".modal-body")!.appendChild(this.iframeEl)

		this.dialog = new Modal(this.dialogEl)
		this.triggers.forEach(trigger => {
			trigger.addEventListener("click", (ev: MouseEvent) => {
				this.handleTriggerClick(ev, trigger)
			})
		})

		window.addEventListener('message', this.handleMessageReceived.bind(this))
	}

	private handleTriggerClick(ev: MouseEvent, trigger: HTMLButtonElement) {
		ev.preventDefault()
		this.dialog!.show()
		this.curId = trigger.parentElement!.parentElement!.querySelector("input[type=file]")!.id
	}

	private handleMessageReceived(ev: MessageEvent) {
		if (Object.prototype.hasOwnProperty.call(ev.data, "id")) {
			const id = parseInt(ev.data.id)
			const name = ev.data.name

			this.updateInput(this.curId!, id, name)

			this.curId = null
			this.dialog!.hide()
		}
	}

	private updateInput(inputId: string, fileId: number, fileName: string) {
		const input = document.getElementById(inputId) as HTMLInputElement

		if (input) {
			const inputGroup = input.parentElement!.parentElement as HTMLDivElement
			const label = inputGroup.querySelector("label") as HTMLLabelElement
			const hiddenInput = inputGroup.querySelector("input[type=hidden]") as HTMLInputElement

			input.value = ""
			label.innerText = fileName.split("/").pop() as string
			hiddenInput.value = fileId.toString()
		}
	}

	private clearInput(inputId: string) {
		const input = document.getElementById(inputId)

		if (input) {
			const inputGroup = input.parentElement!.parentElement as HTMLDivElement
			const label = inputGroup.querySelector("label") as HTMLLabelElement
			const hiddenInput = inputGroup.querySelector("input[type=hidden]") as HTMLInputElement

			label.innerText = ""
			hiddenInput.value = ""
		}
	}

	private createIframe() {
		const iframe = document.createElement("iframe")
		iframe.id = "_file-manager-iframe_" + Date.now().toString()
		iframe.src = FileManager.FILEMANAGER_SRC
		iframe.style.setProperty("width", "100%")
		iframe.style.setProperty("height", "420px")
		iframe.style.setProperty("border", "0")
		return iframe
	}

	private createDialog() {
		const modal = document.createElement("div")
		modal.id = "_file-manager-modal_" + Date.now().toString()
		modal.classList.add("modal", "fade")
		modal.dataset.backdrop = "static"
		modal.role = "dialog"

		const modalDialog = document.createElement("div")
		modalDialog.classList.add("modal-dialog", "modal-dialog-centered", "modal-lg")
		modalDialog.role = "document"

		const modalContent = document.createElement("div")
		modalContent.classList.add("modal-content")

		const modalHeader = document.createElement("div")
		modalHeader.classList.add("modal-header")
		modalHeader.innerHTML = '<h5 class="modal-title">File manager</h5>' +
			'<button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
			'                    <i aria-hidden="true" class="ki ki-close"></i>\n' +
			'                </button>'

		const modalBody = document.createElement("div")
		modalBody.classList.add("modal-body")

		modalContent.appendChild(modalHeader)
		modalContent.appendChild(modalBody)
		modalDialog.appendChild(modalContent)
		modal.appendChild(modalDialog)

		return modal
	}
}

export {FileManager}
