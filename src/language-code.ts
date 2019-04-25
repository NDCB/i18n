import * as languages from "iso-639-1";

/**
 * Determines whether or not an ISO 639-1 language code is valid.
 * @param language The language code to validate.
 */
const isLanguageValid = (language: string): boolean =>
  languages.default.validate(language);

/**
 * A class that represents ISO 639-1 language codes using the flyweight pattern.
 */
export class LanguageCode {
  /**
   * Retrieves a valid language code from a string representation of a language
   * code.
   * @param code The string code to parse. It is converted to lower case.
   * @throws If the given code is not an ISO 639-1 language code.
   * @returns The corresponding language code.
   */
  public static from(code: string): LanguageCode {
    code = code.toLowerCase();
    const definedLanguageCodes = LanguageCode.getDefinedLanguageCodes();
    if (definedLanguageCodes.has(code)) {
      return definedLanguageCodes.get(code);
    }
    if (!isLanguageValid(code)) {
      throw new Error(`Invalid ISO 639-1 language code: ${code}`);
    }
    const languageCode = new LanguageCode(code);
    LanguageCode.addLanguageCode(languageCode);
    return languageCode;
  }

  /**
   * The previously constructed valid language codes.
   */
  private static codes: Map<string, LanguageCode> = new Map();

  /**
   * @returns The previously constructed valid language codes.
   */
  private static getDefinedLanguageCodes(): Map<string, LanguageCode> {
    return LanguageCode.codes;
  }

  /**
   * Adds a language code to the mapping of constructed ones.
   * @param code The code to add.
   */
  private static addLanguageCode(code: LanguageCode): void {
    LanguageCode.codes.set(code.toString(), code);
  }

  /**
   * Constructs a language code using its string representation.
   * @param code The string representation of the language code.
   */
  private constructor(private readonly code: string) {}

  /**
   * @returns A string representation of this language code.
   */
  public toString(): string {
    return this.code;
  }
}
