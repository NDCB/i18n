import * as countries from "i18n-iso-countries";

/**
 * Determines whether or not an ISO 3166-1 country code is valid.
 * @param country The country code to validate.
 */
const isCountryValid = (country: string): boolean => countries.isValid(country);

/**
 * A class that represents ISO 3166-1 country codes using the flyweight pattern.
 */
export class CountryCode {
  /**
   * Retrieves a valid country code from a string representation of a country
   * code.
   * @param code The string code to parse. It is converted to upper case.
   * @throws If the given code is not an ISO 3166-1 country code.
   * @returns The corresponding country code.
   */
  public static from(code: string): CountryCode {
    code = code.toUpperCase();
    const definedCountryCodes = CountryCode.getDefinedCountryCodes();
    if (definedCountryCodes.has(code)) {
      return definedCountryCodes.get(code);
    }
    if (!isCountryValid(code)) {
      throw new Error(`Invalid ISO 3166-1 country code: ${code}`);
    }
    const countryCode = new CountryCode(code);
    CountryCode.addCountryCode(countryCode);
    return countryCode;
  }

  /**
   * The previously constructed valid country codes.
   */
  private static codes: Map<string, CountryCode> = new Map();

  /**
   * @returns The previously constructed valid country codes.
   */
  private static getDefinedCountryCodes(): Map<string, CountryCode> {
    return CountryCode.codes;
  }

  /**
   * Adds a country code to the mapping of constructed ones.
   * @param code The code to add.
   */
  private static addCountryCode(code: CountryCode): void {
    CountryCode.codes.set(code.toString(), code);
  }

  /**
   * Constructs a country code using its string representation.
   * @param code The string representation of the country code.
   */
  private constructor(private readonly code: string) {}

  /**
   * @returns A string representation of this country code.
   */
  public toString(): string {
    return this.code;
  }
}
