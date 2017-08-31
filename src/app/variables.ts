export const Variables: {[key: string]: any} = {
  replaceString: "###",
  useLogs: true,
  translator: {
    languageDefault: "en",
    languageList: [
      {
        name: "English",
        code: "en"
      }
    ],
    languageUrl: "./assets/i18n/",
    languageExtension: ".json"
  },
  routerDebug: false,
  images: {
    backgroundUrl: "./assets/background/hannah-grey.jpg",
    logoUrl: "./assets/logo/logo.png",
    iconUrl: "./assets/logo/logo-small.png"
  }
};
