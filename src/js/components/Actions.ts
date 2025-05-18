export class Actions {
	private floatingActions: HTMLElement
	private staticActions: HTMLElement
	private observer: IntersectionObserver

	public constructor(floatingActions: HTMLElement, staticActions: HTMLElement) {
		this.floatingActions = floatingActions
		this.staticActions = staticActions
		this.observer = new IntersectionObserver(this.handleIntersect.bind(this))
		this.init()
	}

	private init() {
		this.floatingActions.classList.remove("d-none")
		this.observer.observe(this.staticActions)
	}

	private handleIntersect(entries: IntersectionObserverEntry[]) {
		const [staticEntry] = entries
		if (staticEntry.isIntersecting) {
			this.floatingActions.classList.add("floating-actions-hidden")
		} else {
			this.floatingActions.classList.remove("floating-actions-hidden")
		}
	}

	static init() {
		const floatingActions = document.querySelector<HTMLElement>("#_floating-actions")
		const staticActions = document.querySelector<HTMLElement>("#_static-actions")

		if (floatingActions && staticActions)
			return new Actions(floatingActions, staticActions)

		return null
	}
}