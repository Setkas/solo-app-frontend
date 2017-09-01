export const Variables: {[key: string]: any} = {
  "apiUrl": "http://localhost/soloAppMaster/api",
  "replaceString": "###",
  "useLogs": true,
  "translator": {
    "languageDefault": "en",
    "languageList": [
      {
        "name": "English",
        "code": "en"
      }
    ],
    "languageUrl": "./assets/i18n/",
    "languageExtension": ".json"
  },
  "routerDebug": false,
  "images": {
    "backgroundUrl": "./assets/background/hannah-grey.jpg",
    "logoUrl": "./assets/logo/logo.png",
    "iconUrl": "./assets/logo/logo-small.png"
  },
  "cookiePrefix": "sa_",
  "invalidStatusCodes": [
    401,
    402,
    403,
    405,
    406,
    407,
    410,
    503,
    504,
    505
  ],
  "dateFormat": "Do MMM YYYY"
};
