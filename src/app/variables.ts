export const Variables: {[key: string]: any} = {
  "apiUrl": "http://localhost/soloAppMaster/api",
  "replaceString": "###",
  "useLogs": true,
  "translator": {
    "languageDefault": "en",
    "languageList": [
      {
        "id": 1,
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
  "dateFormat": "Do MMM YYYY",
  "genderList": [
    {
      "id": 0,
      "name": "MALE"
    },
    {
      "id": 1,
      "name": "FEMALE"
    }
  ],
  "positionList": [
    {
      "id": 1,
      "name": "DENTIST",
      "languages": [
        "en"
      ]
    },
    {
      "id": 2,
      "name": "HYGIENIST",
      "languages": [
        "en"
      ]
    },
    {
      "id": 3,
      "name": "ZMF",
      "languages": []
    },
    {
      "id": 4,
      "name": "ZMP",
      "languages": []
    },
    {
      "id": 5,
      "name": "ZFA",
      "languages": []
    },
    {
      "id": 3,
      "name": "OTHER",
      "languages": [
        "en"
      ]
    }
  ],
  "soloMed": {
    "apiKey": "6Kpm,sncYfemFsTr",
    "additionalDescription": "customer",
    "apiUrl": "https://www.solo-med.de/csiteapi/v1/solomed/customer/"
  },
  "passwordRegex": /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/
};
