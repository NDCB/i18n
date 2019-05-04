import * as countries from "i18n-iso-countries";
import * as languages from "iso-639-1";
import moment from "moment";
import { vsprintf } from "sprintf-js";

import { CountryCode } from "./country-code";
import { LanguageCode } from "./language-code";
import { LocaleCode } from "./locale-code";
import { Multiplicity, MultiplicityFactory } from "./multiplicity";

/**
 * The locale values used to localize phrases.
 */
export interface LocaleValues {
  /**
   * Localized phrases indexed by their corresponding localizable phrase. These
   * phrases are formatted using `sprintf.js`. Phrases with a quantifier have
   * additional mappings by multiplicity of the quantifier. See the following
   * for more details on the format:
   * https://github.com/alexei/sprintf.js#format-specification.
   * @see [[Multiplicity]] The format of quantity mappings.
   */
  [phrase: string]: string | { [multiplicity: string]: string };
}

/**
 * Retrieves the native language name of a language.
 * @param language The ISO 639-1 language code.
 */
const nativeLanguageName = (language: LanguageCode): string =>
  languages.default.getNativeName(language.toString());

/**
 * Retrieves the native country name of a country in a given language.
 * @param country The ISO 3166-1 country code.
 * @param language The ISO 639-1 language code.
 */
const nativeCountryName = (
  country: CountryCode,
  language: LanguageCode,
): string => countries.getName(country.toString(), language.toString());

/**
 * A locale is used for the localization of a layout.
 */
export abstract class AbstractLocale {
  /**
   * A multiplicity factory, used for phrases with quantifiers.
   */
  private readonly multiplicityFactory: MultiplicityFactory = new MultiplicityFactory();

  /**
   * Constructs a locale with parsed localized values.
   * @param code The locale code.
   */
  public constructor(private readonly code: LocaleCode) {
    moment.locale(code.toString());
  }

  /**
   * Localizes a phrase using the given parameters. The phrase is formatted
   * using `sprintf.js`. See the following for more details on the format:
   * https://github.com/alexei/sprintf.js#format-specification.
   * @param phrase The phrase to localize.
   * @param parameters The parameters to replace in the phrase.
   * @returns The localized phrase.
   */
  public __(phrase: string, ...parameters: any[]): string {
    return vsprintf(this.getValue(phrase) as string, parameters);
  }

  /**
   * Localizes a phrase with a quantifier using the given parameters. The phrase
   * should have localized values mapped by multiplicity of this quantity. The
   * phrase is formatted using `sprintf.js`. See the following for more details
   * on the format: https://github.com/alexei/sprintf.js#format-specification.
   * @param phrase The phrase to localize.
   * @param quantity The variable quantity to use in the localization.
   * @param parameters The parameters to replace in the phrase.
   * @see [[Multiplicity]] The format of quantity mappings.
   * @returns The localized phrase.
   */
  public __n(phrase: string, quantity: number, ...parameters: any[]): string {
    parameters.unshift(quantity);
    const translatedPhrases = this.getValue(phrase) as {
      [multiplicity: string]: string;
    };
    const matchingMultiplicityToken: string = this.getMultiplicityToken(
      translatedPhrases,
      quantity,
    );
    const translatedPhrase = translatedPhrases[matchingMultiplicityToken];
    return vsprintf(translatedPhrase, parameters);
  }

  /**
   * Localizes a UTC moment with a given format. See the following for more
   * details on the format: https://momentjs.com/docs/#/displaying/format/.
   * @param token The UTC moment token to localize.
   * @param format The format to display the localized moment in.
   * @returns The localized moment formatted as specified.
   */
  public __m(token: string, format: string = "LL"): string {
    const m = moment.utc(token);
    m.locale(this.getLocaleCode().toString());
    return m.format(format);
  }

  /**
   * Returns the ISO 639-1 language code of this locale.
   */
  public getLanguageCode(): LanguageCode {
    return this.getLocaleCode().getLanguageCode();
  }

  /**
   * Returns the ISO 3166-1 country code of this locale.
   */
  public getCountryCode(): CountryCode {
    return this.getLocaleCode().getCountryCode();
  }

  /**
   * Returns the locale code of this locale.
   */
  public getLocaleCode(): LocaleCode {
    return this.code;
  }

  /**
   * Retrieves the native language name of the locale.
   */
  public getNativeLanguageName(): string {
    return nativeLanguageName(this.getLanguageCode());
  }

  /**
   * Retrieves the native country name of the locale in its language.
   */
  public getNativeCountryName(): string {
    return nativeCountryName(this.getCountryCode(), this.getLanguageCode());
  }

  /**
   * The localized values.
   */
  protected abstract values(): LocaleValues;

  /**
   * Retrieves a defined value from this locale's values.
   * @param phrase The phrase to localize.
   * @throws If the phrase is undefined.
   */
  private getValue(phrase: string): string | { [phrase: string]: string } {
    const value = this.values()[phrase];
    if (!value) {
      throw new Error(`Undefined phrase: ${phrase}`);
    }
    return value;
  }

  /**
   * Retrieves the defined multiplicity that best matches the given quantity.
   * @param translatedPhrases The translated phrase mappings by multiplicity.
   * These should be ordered in ascending order of left bounds.
   * @param quantity The quantity used in the phrase's localization.
   * @throws If there is no corresponding multiplicity.
   */
  private getMultiplicityToken(
    translatedPhrases: { [multiplicity: string]: string },
    quantity: number,
  ): string {
    let matchingMultiplicityToken = null;
    for (const multiplicityToken in translatedPhrases) {
      if (translatedPhrases.hasOwnProperty(multiplicityToken)) {
        const currentMultiplicity: Multiplicity = this.multiplicityFactory.parseMultiplicity(
          multiplicityToken,
        );
        if (currentMultiplicity.includes(quantity)) {
          matchingMultiplicityToken = multiplicityToken;
        }
      }
    }
    if (!matchingMultiplicityToken) {
      throw new Error(
        `No corresponding multiplicity found for quantity ${quantity}: ${translatedPhrases}`,
      );
    }
    return matchingMultiplicityToken;
  }
}
