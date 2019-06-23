import defaultSettings from '@/settings'
import i18n from '@/lang'

const title = defaultSettings.title || 'Mina'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    pageTitle = i18n.t(`route.${pageTitle}`)
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
