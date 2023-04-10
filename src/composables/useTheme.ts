import { useIndexStore } from '@/store/index'

const themes = {
  default: {
    primaryColor: '#ff0000',
    themeColor: '#68FFD8',
    backgroundColor: '#1f2224',
    buttonDefault: '#68FFD8',
    buttonHover: '#A4FFE7',
    buttonDisabled: '#1e2f2d',
    buttonDetailDefault: '#181818',
    buttonDetailHover: '#232323',
    depositBtnHover: '#1F3635',
    buttonPositionDefault: '#1E2E2A',
    buttonPositionHover: '#2D443E',
    tabActive: '#171717',
    tabHover: '#191919',
    tabDefault: '#080808',
    cardDefault: '#1A1A1A',
    cardEmphasize: '#202020',
    cardEnter: '#080808',
    cardAsset: 'linear-gradient(180deg, #1A1A1A, #0F0F0F )',
    cardTop: 'linear-gradient(270deg, #000000 0%, #15332c 100%)',
    cardTopTrans: 'linear-gradient(270deg, #1b1b1b 0%, #13211D 100%)',
    cardTopReserve: 'linear-gradient(270deg, #15332c 0%, #000000 100%)',
    cardCenter: 'linear-gradient(270deg, #1b2523 0%, #161717 50%, #1b2523 100%)',
    cardCenterHover: 'linear-gradient(270deg, #283E3A 0%, #161717 50%, #283E3A 100%)',
    moreBg: 'linear-gradient(360deg, #171717 0%, #15332c 100%)',
    moreBgReserve: 'linear-gradient(360deg, #092C2A 0%, #121212 100%)',
    moreBgReserveHover: 'linear-gradient(360deg, #204C50 0%, #121212 100%)',
    // borderGradient: 'linear-gradient(180deg, #A1FFEE 0%, #83FFE2 50%, #68FFD8 100%)',
    borderGradient: 'linear-gradient(180deg, transparent 0%, #83FFE2 50%, transparent 100%)',
    greenBg: '#192a26',
    redBg: '#2b181c',
    textDefault: '#CDCDCD',
    textDefaultStats: '#7F7F7F',
    textActive: '#fff',
    textEffect: '#B5B8C2',
    textTips: '#FFCA68',
    textWarning: '#FF6868',
    borderDefault: '#213F37',
    redColor: '#ff5073',
    h5Stats: 'linear-gradient(180deg, #131514 0%, #1E322D 100%)',
    termGradient: 'linear-gradient(270deg, #273632 0%, #202020 51%, #273632 100%)'
  },
  sui: {
    primaryColor: '#76C8FF',
    themeColor: '#76C8FF',
    backgroundColor: '#1f2224',
    buttonDefault: '#76C8FF',
    buttonHover: '#A4E2FF',
    buttonDisabled: '#32333B',
    buttonDetailDefault: '#181818',
    buttonDetailHover: '#121B1F',
    depositBtnHover: '#1D3443',
    buttonPositionDefault: '#1E2E2A',
    buttonPositionHover: '#2D443E',
    tabActive: '#181818',
    tabHover: '#191919',
    tabDefault: '#080808',
    cardDefault: '#171717',
    cardEmphasize: '#1B1B1B',
    cardEnter: '#0F0F0F',
    cardAsset: 'linear-gradient(180deg, #1A1A1A, #0F0F0F )',
    cardTop: 'linear-gradient(270deg, #000000 0%, #152533 100%)',
    cardTopTrans: 'linear-gradient(270deg, #252B2D 0%, #252F39 100%)',
    cardTopReserve: 'linear-gradient(270deg, #152533 0%, #000000 100%)',
    cardCenter: 'linear-gradient(270deg, #1B1F25 0%, #161717 52%, #1B2025 100%)',
    cardCenterHover: 'linear-gradient(270deg, #26303C 0%, #161717 52%, #26303C 100%)',
    moreBg: 'linear-gradient(360deg, #171717 0%, #152533 100%)',
    moreBgReserve: 'linear-gradient(360deg, #0E2836 0%, #121212 100%)',
    moreBgReserveHover: 'linear-gradient(360deg, #223857 0%, #121212 100%)',
    borderGradient: 'linear-gradient(180deg, transparent 0%, #76C8FF 52%, transparent 100%)',
    greenBg: '#192a26',
    redBg: '#2b181c',
    redColor: '#ff5073',
    textDefault: '#CDCDCD',
    textDefaultStats: '#7F7F7F',
    textActive: '#fff',
    textEffect: '#B5B8C2',
    textTips: '#FFCA68',
    textWarning: '#FF6868',
    borderDefault: '#044D70',
    h5Stats: 'linear-gradient(180deg, #1E2A32 0%, #121212 100%)',
    termGradient: 'linear-gradient(270deg, #314854 0%, #202020 51%, #314854 100%)'
  },
  sui2: {
    primaryColor: '#76C8FF',
    themeColor: '#76C8FF',
    backgroundColor: '#1f2224',
    buttonDefault: '#76C8FF',
    buttonHover: '#A4E2FF',
    buttonDisabled: '#32333B',
    buttonDetailDefault: '#181818',
    buttonDetailHover: '#121B1F',
    depositBtnHover: '#1D3443',
    buttonPositionDefault: '#1E2E2A',
    buttonPositionHover: '#2D443E',
    tabActive: '#181818',
    tabHover: '#191919',
    tabDefault: '#080808',
    cardDefault: '#171717',
    cardEmphasize: '#1B1B1B',
    cardEnter: '#0F0F0F',
    cardAsset: 'linear-gradient(180deg, #1A1A1A, #0F0F0F )',
    cardTop: 'linear-gradient(270deg, #000000 0%, #152533 100%)',
    cardTopTrans: 'linear-gradient(270deg, #252B2D 0%, #252F39 100%)',
    cardTopReserve: 'linear-gradient(270deg, #152533 0%, #000000 100%)',
    cardCenter: 'linear-gradient(270deg, #1B1F25 0%, #161717 52%, #1B2025 100%)',
    cardCenterHover: 'linear-gradient(270deg, #26303C 0%, #161717 52%, #26303C 100%)',
    moreBg: 'linear-gradient(360deg, #171717 0%, #152533 100%)',
    moreBgReserve: 'linear-gradient(360deg, #0E2836 0%, #121212 100%)',
    moreBgReserveHover: 'linear-gradient(360deg, #223857 0%, #121212 100%)',
    borderGradient: 'linear-gradient(180deg, transparent 0%, #76C8FF 52%, transparent 100%)',
    greenBg: '#192a26',
    redBg: '#2b181c',
    redColor: '#ff5073',
    textDefault: '#CDCDCD',
    textDefaultStats: '#7F7F7F',
    textActive: '#fff',
    textEffect: '#B5B8C2',
    textTips: '#FFCA68',
    textWarning: '#FF6868',
    borderDefault: '#044D70',
    h5Stats: 'linear-gradient(180deg, #1E2A32 0%, #121212 100%)',
    termGradient: 'linear-gradient(270deg, #314854 0%, #202020 51%, #314854 100%)'
  }
}

export default function () {
  const store = useIndexStore()
  // Modify the value of the style variable in the page
  const changeStyle = obj => {
    for (const key in obj) {
      document.getElementsByTagName('body')[0].style.setProperty(`--${key}`, obj[key])
    }
  }
  // How to change the theme
  const setTheme = themeName => {
    localStorage.setItem('theme', themeName) // Save the theme locally, and use this theme next time you enter
    store.setTheme(themeName)
    const themeConfig = themes[themeName]
    // If there is a theme name, then use the theme we defined
    if (themeConfig) {
      localStorage.setItem('termGradient', themeConfig['termGradient'])
      localStorage.setItem('primaryColor', themeConfig['primaryColor'])
      localStorage.setItem('themeColor', themeConfig['themeColor'])
      localStorage.setItem('backgroundColor', themeConfig['backgroundColor'])
      localStorage.setItem('buttonDefault', themeConfig['buttonDefault'])
      localStorage.setItem('buttonHover', themeConfig['buttonHover'])
      localStorage.setItem('buttonDisabled', themeConfig['buttonDisabled'])
      localStorage.setItem('buttonDetailDefault', themeConfig['buttonDetailDefault'])
      localStorage.setItem('buttonDetailHover', themeConfig['buttonDetailHover'])
      localStorage.setItem('depositBtnHover', themeConfig['depositBtnHover'])
      localStorage.setItem('buttonPositionDefault', themeConfig['buttonPositionDefault'])
      localStorage.setItem('buttonPositionHover', themeConfig['buttonPositionHover'])
      localStorage.setItem('tabActive', themeConfig['tabActive'])
      localStorage.setItem('tabHover', themeConfig['tabHover'])
      localStorage.setItem('tabDefault', themeConfig['tabDefault'])
      localStorage.setItem('cardDefault', themeConfig['cardDefault'])
      localStorage.setItem('cardEmphasize', themeConfig['cardEmphasize'])
      localStorage.setItem('cardEnter', themeConfig['cardEnter'])
      localStorage.setItem('cardAsset', themeConfig['cardAsset'])
      localStorage.setItem('cardTop', themeConfig['cardTop'])
      localStorage.setItem('cardTopReserve', themeConfig['cardTopReserve'])
      localStorage.setItem('cardCenter', themeConfig['cardCenter'])
      localStorage.setItem('cardCenterHover', themeConfig['cardCenterHover'])
      localStorage.setItem('moreBg', themeConfig['moreBg'])
      localStorage.setItem('moreBgReserve', themeConfig['moreBgReserve'])
      localStorage.setItem('moreBgReserveHover', themeConfig['moreBgReserveHover'])
      localStorage.setItem('borderGradient', themeConfig['borderGradient'])
      localStorage.setItem('greenBg', themeConfig['greenBg'])
      localStorage.setItem('redBg', themeConfig['redBg'])
      localStorage.setItem('redColor', themeConfig['redColor'])
      localStorage.setItem('textDefault', themeConfig['textDefault'])
      localStorage.setItem('textDefaultStats', themeConfig['textDefaultStats'])
      localStorage.setItem('textActive', themeConfig['textActive'])
      localStorage.setItem('textEffect', themeConfig['textEffect'])
      localStorage.setItem('textTips', themeConfig['textTips'])
      localStorage.setItem('textWarning', themeConfig['textWarning'])
      localStorage.setItem('borderDefault', themeConfig['borderDefault'])
      localStorage.setItem('h5Stats', themeConfig['h5Stats'])
      localStorage.setItem('cardTopTrans', themeConfig['cardTopTrans'])
      changeStyle(themeConfig)
    } else {
      const themeConfig = {
        termGradient: localStorage.getItem('termGradient'),
        primaryColor: localStorage.getItem('primaryColor'),
        backgroundColor: localStorage.getItem('backgroundColor'),
        themeColor: localStorage.getItem('themeColor'),
        buttonDefault: localStorage.getItem('buttonDefault'),
        buttonHover: localStorage.getItem('buttonHover'),
        buttonDisabled: localStorage.getItem('buttonDisabled'),
        buttonDetailDefault: localStorage.getItem('buttonDetailDefault'),
        buttonDetailHover: localStorage.getItem('buttonDetailHover'),
        depositBtnHover: localStorage.getItem('depositBtnHover'),
        buttonPositionDefault: localStorage.getItem('buttonPositionDefault'),
        buttonPositionHover: localStorage.getItem('buttonPositionHover'),
        tabActive: localStorage.getItem('tabActive'),
        tabHover: localStorage.getItem('tabHover'),
        tabDefault: localStorage.getItem('tabDefault'),
        cardDefault: localStorage.getItem('cardDefault'),
        cardEmphasize: localStorage.getItem('cardEmphasize'),
        cardEnter: localStorage.getItem('cardEnter'),
        cardAsset: localStorage.getItem('cardAsset'),
        cardTop: localStorage.getItem('cardTop'),
        cardTopReserve: localStorage.getItem('cardTopReserve'),
        cardCenter: localStorage.getItem('cardCenter'),
        cardCenterHover: localStorage.getItem('cardCenterHover'),
        moreBg: localStorage.getItem('moreBg'),
        moreBgReserve: localStorage.getItem('moreBgReserve'),
        moreBgReserveHover: localStorage.getItem('moreBgReserveHover'),
        borderGradient: localStorage.getItem('borderGradient'),
        redBg: localStorage.getItem('redBg'),
        redColor: localStorage.getItem('redColor'),
        textDefault: localStorage.getItem('textDefault'),
        textDefaultStats: localStorage.getItem('textDefaultStats'),
        textActive: localStorage.getItem('textActive'),
        textEffect: localStorage.getItem('textEffect'),
        textTips: localStorage.getItem('textTips'),
        textWarning: localStorage.getItem('textWarning'),
        borderDefault: localStorage.getItem('borderDefault'),
        h5Stats: localStorage.getItem('h5Stats'),
        cardTopTrans: localStorage.getItem('cardTopTrans')
      }
      changeStyle(themeConfig)
    }
  }

  const seleteDefaultTheme = () => {
    setTheme('default')
  }

  const selectSuiTheme = () => {
    setTheme('sui')
  }

  const selectSui2Theme = () => {
    setTheme('sui2')
  }

  return {
    seleteDefaultTheme,
    selectSuiTheme,
    selectSui2Theme
  }
}
