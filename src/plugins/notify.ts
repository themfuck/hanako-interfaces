import { notification } from 'ant-design-vue'

notification.config({
  placement: 'topRight',
  bottom: '50px',
  duration: null,
  closeIcon: h(
    'svg',
    {
      class: {
        icon: true,
        'modal-icon-close': true
      },
      'aria-hidden': true
    },
    [
      h('use', {
        'xlink:href': '#icon-a-icon-Shutdown'
      })
    ]
  )
})

export default defineNuxtPlugin(nuxtApp => {
  // Doing something with nuxtApp
  return {
    provide: {
      notify: notification
    }
  }
})
