export type App = {
  dark: "dark" | "light",
  siteName: string,
}

const defaultConfig: App = {
  dark: 'light',
  siteName: 'Semi Admin'
}
export {defaultConfig}