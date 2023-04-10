// export const useTestList = ():any => {
export default function () {
  const list = ref(null)
  const count = ref(0)

  const getList = (): void => {
    setTimeout(() => {
      list.value = [1, 2, 3]
      count.value += 1
    }, 2000)
  }

  return {
    list,
    count,
    getList
  }
}
