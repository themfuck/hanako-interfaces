import { createI18n } from 'vue-i18n'
import Cookies from 'cookies-ts'
const cookies = new Cookies()

import th from '@/locales/th.json'
import en from '@/locales/en.json'
import hi from '@/locales/hi.json'
import kr from '@/locales/kr.json'
import vi from '@/locales/vi.json'
import ru from '@/locales/ru.json'
import ja from '@/locales/ja.json'
import tr from '@/locales/tr.json'

const message = {
  th: th,
  en: en,
  hi: hi,
  kr: kr,
  vi: vi,
  ja: ja,
  ru: ru,
  tr: tr
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: cookies.get('lang') || 'en',
  warnHtmlMessage: false,
  messages: message
})

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(i18n)
})
