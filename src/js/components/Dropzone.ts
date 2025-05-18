import Dropzone from "dropzone"

export class DropzoneInitializator {
	private elements: HTMLElement[] = []

	constructor(selector: string = "[data-dropzone]") {
		this.elements = Array.from(document.querySelectorAll<HTMLElement>(selector))

		this.elements.forEach(this.init.bind(this))
	}

	private init(el: HTMLElement) {
		const row = el.nextElementSibling as HTMLDivElement
		el.classList.add("dropzone-default")

		new Dropzone(el, {
			url: el.dataset.dropzone,
			success(file: Dropzone.DropzoneFile) {
				const data = JSON.parse(file.xhr!.responseText)

				row.innerHTML += `
				<div class="col col-auto">
					<div class="image-input mb-5 image-input-outline" id="kt_user_add_avatar">
						<div class="image-input-wrapper" style="background-image: url(${file.dataURL})"></div>
						<a href="?galleryForm-id=${data.id}&do=galleryForm-photoDelete" class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="change" title="" data-original-title="Smazat">
							<i class="ki ki-bold-close icon-xs text-muted"></i>
						</a>
					</div>
				</div>
			`
			},
		})
	}
}