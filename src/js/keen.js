import KTLayoutHeader from "./layout/base/header"
import KTLayoutHeaderMenu from "./layout/base/header-menu"
import KTLayoutHeaderTopbar from "./layout/base/header-topbar"
import KTLayoutAside from "./layout/base/aside"
import KTLayoutAsideMenu from "./layout/base/aside-menu"
import KTLayoutSubheader from "./layout/base/subheader"
import KTLayoutBrand from "./layout/base/brand"
import KTLayoutContent from "./layout/base/content"
import KTLayoutFooter from "./layout/base/footer"
import KTLayoutAsideToggle from "./layout/base/aside-toggle"
import KTLayoutSidebar from "./layout/base/sidebar"
import KTLayoutQuickActions from "./layout/extended/quick-actions"
import KTLayoutQuickNotifications from "./layout/extended/quick-notifications"
import KTLayoutQuickPanel from "./layout/extended/quick-panel"
import KTLayoutQuickUser from "./layout/extended/quick-user"
import KTLayoutScrolltop from "./layout/extended/scrolltop"

class Keen {
	constructor() {
		this._init();
	}

	initialize(naja) {
		naja.addEventListener("success", this._najaReinit.bind(this))
	}

	_init() {
		KTLayoutHeader.init('kt_header', 'kt_header_mobile')
		KTLayoutHeaderMenu.init('kt_header_menu', 'kt_header_menu_wrapper')
		KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle')
		KTLayoutSubheader.init('kt_subheader')
		KTLayoutBrand.init('kt_brand')
		KTLayoutAside.init('kt_aside')
		KTLayoutAsideToggle.init('kt_aside_toggle')
		KTLayoutAsideMenu.init('kt_aside_menu')
		KTLayoutContent.init('kt_content')
		KTLayoutFooter.init('kt_footer')
		KTLayoutSidebar.init('kt_sidebar')

		KTLayoutScrolltop.init('kt_scrolltop')
		KTLayoutQuickActions.init('kt_quick_actions')
		KTLayoutQuickNotifications.init('kt_quick_notifications')
		KTLayoutQuickPanel.init('kt_quick_panel')
		KTLayoutQuickUser.init('kt_quick_user')
	}

	_najaReinit() {

	}
}

const keen = new Keen()
export {keen}