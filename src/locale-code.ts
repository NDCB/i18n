import { CountryCode } from "./country-code";
import { LanguageCode } from "./language-code";

/**
 * A locale code is a couple comprised of a valid ISO 639-1 language code and a
 * valid ISO 3166-1 country code. These codes are constructed using the
 * flyweight pattern.
 */
export class LocaleCode {
  /**
   * Retrieves a locale code that matches the given delimited language and
   * country codes.
   * @param code The ISO 639-1 language and ISO 3166-1 country codes delimited
   * by the delimiter.
   * @param delimiter The delimiter.
   * @throws If the delimited language and country codes is malformed.
   * @throws If the language code is invalid.
   * @throws If the country code is invalid.
   */
  public static from(code: string, delimiter: string = "-"): LocaleCode {
    const definedLocaleCodes = LocaleCode.getDefinedLocaleCodes();
    if (definedLocaleCodes.has(code)) {
      return definedLocaleCodes.get(code);
    }
    const tokens = code.split(delimiter);
    if (tokens.length !== 2) {
      throw new Error(`Malformed code, must have two tokens: ${code}`);
    }
    const languageCode = LanguageCode.from(tokens[0]);
    const countryCode = CountryCode.from(tokens[1]);
    const localeCode = new LocaleCode(languageCode, countryCode);
    LocaleCode.addLocaleCode(localeCode);
    return localeCode;
  }

  /**
   * The previously constructed valid locale codes.
   */
  private static codes: Map<string, LocaleCode> = new Map();

  /**
   * @returns The previously constructed valid locale codes.
   */
  private static getDefinedLocaleCodes(): Map<string, LocaleCode> {
    return LocaleCode.codes;
  }

  /**
   * Adds a locale code to the mapping of constructed ones.
   * @param code The code to add.
   */
  private static addLocaleCode(code: LocaleCode): void {
    LocaleCode.codes.set(code.toString(), code);
  }

  /**
   * Constructs a locale code using its language and country codes.
   * @param languageCode The language code of the locale.
   * @param countryCode The country code of the locale.
   */
  private constructor(
    private readonly languageCode: LanguageCode,
    private readonly countryCode: CountryCode,
  ) {}

  /**
   * Returns the ISO 3166-1 country code of this locale code.
   */
  public getCountryCode(): CountryCode {
    return this.countryCode;
  }

  /**
   * Returns the ISO 639-1 language code of this locale code.
   */
  public getLanguageCode(): LanguageCode {
    return this.languageCode;
  }

  /**
   * Constructs a string representation of this locale code. This representation
   * is formatted as the ISO 639-1 language code followed by the ISO 3166-1
   * country code, delimited by the given delimiter.
   * @param delimiter The delimiter between the language and country codes.
   * @returns The string representation of this locale code.
   */
  public toString(delimiter: string = "-"): string {
    return `${this.getLanguageCode().toString()}${delimiter}${this.getCountryCode().toString()}`;
  }
}
