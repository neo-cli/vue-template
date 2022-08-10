import i18n from '@/i18n'
import { watch } from 'vue'
import store from '@/store'

export const generateTitle = (title) => {
  return i18n.global.t('route.' + title)
}

/**
 * 监听语言变化，同时执行cds
 * @param  {...any} cbs 所有的回调
 */
export function watchSwitchLang(...cbs) {
  watch(
    () => store.getters.language,
    () => {
      cbs.forEach((cb) => cb(store.getters.language))
    }
  )
}

// 获取浏览当前默认语言
export const currentLanguage = () => {
  const current = navigator.systemLanguage || navigator.language
  return current.replace('-', '')
}
