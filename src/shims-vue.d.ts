/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/components/Three/Modules/Interactive/SelectionBox';
declare module '@/components/Three/Modules/Interactive/SelectionHelper';
