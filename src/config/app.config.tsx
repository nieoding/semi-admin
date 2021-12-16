export type App = {
  dark: "dark" | "light",
  siteName: string,
}

const defaultConfig: App = {
  dark: 'light',
  siteName: 'Semi Design Admin'
}
export {defaultConfig}