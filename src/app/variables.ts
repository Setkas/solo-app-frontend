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
  "passwordRegex": "^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])[\\w]{6,}$",
  "helpEmail": "hotline@solo-app.com",
  "authLevels": {
    "GUEST": 0,
    "CLIENT": 1,
    "USER": 2,
    "MODERATOR": 3,
    "ADMIN": 4
  },
  "stixList": [
    {
      "value": 0,
      "preview": "./assets/stix/stix-small-0.png"
    },
    {
      "value": 1,
      "preview": "./assets/stix/stix-small-1.png"
    },
    {
      "value": 2,
      "preview": "./assets/stix/stix-small-2.png"
    },
    {
      "value": 3,
      "preview": "./assets/stix/stix-small-3.png"
    },
    {
      "value": 4,
      "preview": "./assets/stix/stix-small-4.png"
    },
    {
      "value": 5,
      "preview": "./assets/stix/stix-small-5.png"
    },
    {
      "value": 6,
      "preview": "./assets/stix/stix-small-6.png"
    },
    {
      "value": 7,
      "preview": "./assets/stix/stix-small-7.png"
    },
    {
      "value": 8,
      "preview": "./assets/stix/stix-small-8.png"
    },
    {
      "value": 9,
      "preview": "./assets/stix/stix-small-9.png"
    },
    {
      "value": 10,
      "preview": "./assets/stix/stix-small-10.png"
    },
    {
      "value": 11,
      "preview": "./assets/stix/stix-small-11.png"
    },
    {
      "value": 12,
      "preview": "./assets/stix/stix-small-12.png"
    },
    {
      "value": 14,
      "preview": "./assets/stix/stix-small-14.png"
    },
    {
      "value": 15,
      "preview": "./assets/stix/stix-small-15.png"
    },
    {
      "value": 16,
      "preview": "./assets/stix/stix-small-16.png"
    },
    {
      "value": 17,
      "preview": "./assets/stix/stix-small-17.png"
    },
    {
      "value": 18,
      "preview": "./assets/stix/stix-small-18.png"
    }
  ],
  "setupDefaults": {
    "client_history": 2,
    "client_reminder": 0,
    "notes_history": 3,
    "therapy_color": 4
  },
  "clientReminders": [
    {
      "name": "NO",
      "value": 0
    },
    {
      "name": "MONTH_BEFORE",
      "value": 1
    },
    {
      "name": "2_MONTHS_BEFORE",
      "value": 2
    },
    {
      "name": "3_MONTHS_BEFORE",
      "value": 3
    }
  ]
};
