import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient} from "@angular/common/http";
import {Variables} from "./variables";
import {LoggerProvider} from "../providers/logger-provider";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, Variables.translator.languageUrl, Variables.translator.languageExtension);
}

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    let keysSpl = params.key.split("."),
      key = keysSpl[keysSpl.length - 1];

    LoggerProvider.Warning("[TRANSLATOR]: Missing translation for '" + params.key + "'.");

    key = key.replace(/_/g, " ");

    return key.charAt(0) + key.slice(1).toLowerCase();
  }
}
