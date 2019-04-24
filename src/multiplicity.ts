/**
 * Represents a multiplicity of things attributed to a localized phrase
 * involving a numerical value.
 */
export abstract class Multiplicity {
  /**
   * Determines whether or not a given numerical value is included in this
   * multiplicity.
   * @param value The value to check.
   * @returns Whether or not a given numerical value is included in this
   * multiplicity.
   */
  public abstract includes(value: number): boolean;
}

/**
 * A single multiplicity is a multiplicity that includes only one value.
 */
export class SingleMultiplicity extends Multiplicity {
  /**
   * Constructs a single multiplicity of the given value.
   * @param value The sole value of this multiplicity.
   */
  constructor(private readonly value: number) {
    super();
  }

  /**
   * Determines whether or not a given numerical value corresponds to the value
   * of this single multiplicity.
   * @param value The value to check.
   * @returns Whether or not a given numerical value corresponds to the value of
   * this single multiplicity.
   */
  public includes(value: number): boolean {
    return this.getValue() === value;
  }

  /**
   * @returns The unique value of this single multiplicity.
   */
  public getValue(): number {
    return this.value;
  }

  /**
   * @returns A string representation of this multiplicity.
   */
  public toString(): string {
    return `${this.getValue()}`;
  }
}

/**
 * An interval multiplicity is a multiplicity that includes the values in a
 * closed interval.
 */
export class IntervalMultiplicity extends Multiplicity {
  /**
   * @returns The delimiter used inbetween the minimum and the maximum of an
   * interval multiplicity.
   */
  public static getDelimiter(): string {
    return IntervalMultiplicity.delimiter;
  }

  /**
   * The delimiter used inbetween the minimum and the maximum of an interval
   * multiplicity.
   */
  private static readonly delimiter: string = "..";

  /**
   * Constructs an interval multiplicity from the given minimum to the given
   * maximum inclusively.
   * @param minimum The minimum of the interval.
   * @param maximum The maximum of the interval. This may be infinite.
   * @throws If the given minimum is greater than the given maximum.
   */
  constructor(
    private readonly minimum: number,
    private readonly maximum: number,
  ) {
    super();
    if (minimum > maximum) {
      throw new Error(
        `Minimum multiplicity value must not be greater than the maximum: ${this.toString()}`,
      );
    }
  }

  /**
   * Determines whether or not a given numerical value is within the interval of
   * this interval multiplicity, that is, if it is greater than or equal to the
   * minimum, and smaller than or equal to the maximum.
   * @param value The value to check.
   * @returns Whether or not a given numerical value is within the interval of
   * this interval multiplicity.
   */
  public includes(value: number): boolean {
    return this.getMinimum() <= value && value <= this.getMaximum();
  }

  /**
   * @returns The minimum of the interval.
   */
  public getMinimum(): number {
    return this.minimum;
  }

  /**
   * @returns The maximum of the interval.
   */
  public getMaximum(): number {
    return this.maximum;
  }

  /**
   * @returns A string representation of this interval multiplicity, using the
   * interval multiplicity delimiter.
   */
  public toString(): string {
    return `${this.getMinimum()}${IntervalMultiplicity.getDelimiter()}${this.getMaximum()}`;
  }
}

/**
 * A multiplicity factory builds multiplicities from string tokens.
 */
export class MultiplicityFactory {
  /**
   * Parses a multiplicity string token. A single multiplicity is parsed if the
   * string corresponds to a number. An interval multiplicity is parsed if the
   * string is of the form `a..b`, where `a` is a number, and `b` is either a
   * number or `*`, which is replaced with `Infinity`.
   * @param token The token to parse.
   * @returns The parsed multiplicity.
   */
  public parseMultiplicity(token: string | number): Multiplicity {
    if (this.isSingleMultiplicity(token)) {
      return this.parseSingleMultiplicity(token);
    }
    return this.parseIntervalMultiplicity(token as string);
  }

  private isSingleMultiplicity(token: string | number): boolean {
    return (
      typeof token === "number" ||
      !token.includes(IntervalMultiplicity.getDelimiter())
    );
  }

  private parseSingleMultiplicity(token: string | number): SingleMultiplicity {
    return new SingleMultiplicity(
      typeof token === "number" ? token : this.parseInteger(token),
    );
  }

  private parseIntervalMultiplicity(token: string): IntervalMultiplicity {
    const tokens = token.split(IntervalMultiplicity.getDelimiter());
    if (tokens.length !== 2) {
      throw new Error(
        `Malformed multiplicity, must be "a${IntervalMultiplicity.getDelimiter()}b": ${token}`,
      );
    }
    const minimum = this.parseInteger(tokens[0]);
    const maximum = this.parseInteger(tokens[1]) || Infinity;
    return new IntervalMultiplicity(minimum, maximum);
  }

  /**
   * Parses a decimal integer from a string.
   * @param token The string to parse.
   * @returns The parsed number.
   */
  private parseInteger(token: string): number {
    return parseInt(token, 10);
  }
}
