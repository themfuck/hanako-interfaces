import { defineNuxtConfig } from 'nuxt/config'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import removeConsole from 'vite-plugin-remove-console'
import path from 'path'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // mode: 'spa',
  srcDir: './src',
  ssr: false,
  buildDir: 'dist',
  app: {
    head: {
      title: 'Cetus-Empower liquidity.Built for DeFi.',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, user-scalable=0'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'keywords'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Swap, earn, and build on the pioneer MOVE-based liquidity protocol.'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico?t=1234'
        }
      ],
      script: [
        { src: 'https://at.alicdn.com/t/c/font_3580402_nsrlexcd2d.js?spm=a313x.7781069.1998910419.57&file=font_3580402_nsrlexcd2d.js' }
      ]
    }
  },
  dir: {
    public: 'static'
  },
  loadingIndicator: {
    name: 'pulse',
    color: '#68FFD8',
    background: '#000'
  },
  // css: ['@/assets/css/base.less', '@/assets/css/antd.less', '@/assets/css/common.less'],
  css: ['@/assets/css/antd.less', '@/assets/css/common.less'],
  alias: {},
  // buildModules: ['@pinia/nuxt'],
  modules: ['@pinia/nuxt'],
  clipboard: {
    autoSetContainer: true
  },
  // build: {
  //   postcss: {
  //     postcssOptions: {
  //       autoprefixer: {}
  //     }
  //   }
  // },
  vite: {
    define: {
      'process.env': {}
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            // 'primaryColor': '#ff0000'
            hack: `true; @import (reference) "${path.resolve('src/assets/css/base.less')}";`
          },
          javascriptEnabled: true
        }
      }
    },
    plugins: [
      Components({
        resolvers: [AntDesignVueResolver()]
      }),
      removeConsole()
    ],
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true
            // buffer: true
          }),
          NodeModulesPolyfillPlugin()
        ]
      },
      // exclude: ['@solana/web3.js']
      exclude: ['@openblockhq/dappsdk']
    }
  },
  privateRuntimeConfig: {
    BASE_URL: '' // Default to an empty string, automatically loaded at runtime using process.env.API_SECRET
  }
})
