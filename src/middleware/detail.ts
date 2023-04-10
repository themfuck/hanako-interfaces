export default defineNuxtRouteMiddleware((to, from) => {
  const body = document.querySelector('.body-container-bg')
  console.log(body, 'body##')
  if (body) {
    body.scrollTo({
      top: 0
    })
  }
})
