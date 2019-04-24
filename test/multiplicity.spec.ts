import { assert } from "chai";

import {
  IntervalMultiplicity,
  MultiplicityFactory,
  SingleMultiplicity,
} from "../src/multiplicity";

describe("Multiplicity", () => {
  describe("SingleMultiplicity", () => {
    const correspondingValue = 0;
    const nonCorrespondingValues = [-Infinity, -10, -1, 1, 10, Infinity, NaN];
    const singleMultiplicityFixture = new SingleMultiplicity(
      correspondingValue,
    );
    describe("#includes(number)", () => {
      it("includes the corresponding value", () => {
        assert.isTrue(singleMultiplicityFixture.includes(correspondingValue));
      });
      it("does not include non-corresponding values", () => {
        for (const nonCorrespondingValue of nonCorrespondingValues) {
          assert.isFalse(
            singleMultiplicityFixture.includes(nonCorrespondingValue),
          );
        }
      });
    });
    describe("#toString()", () => {
      it("does not throw", () => {
        assert.doesNotThrow(() => singleMultiplicityFixture.toString());
      });
    });
  });
  describe("IntervalMultiplicity", () => {
    const includedValues = [0, 1, 7, 10, Infinity];
    const nonIncludedValues = [NaN, -Infinity, -10, -7, -1];
    const minimum = 0;
    const maximum = Infinity;
    const intervalMultiplicityFixture = new IntervalMultiplicity(
      minimum,
      maximum,
    );
    describe("constructor(number, number)", () => {
      it("throws if the minimum is larger than the maximum", () => {
        const maximum = minimum - 1;
        assert.throws(() => new IntervalMultiplicity(minimum, maximum));
      });
    });
    describe("includes(number)", () => {
      it("includes corresponding values", () => {
        for (const includedValue of includedValues) {
          assert.isTrue(intervalMultiplicityFixture.includes(includedValue));
        }
      });
      it("does not include non-corresponding values", () => {
        for (const nonIncludedValue of nonIncludedValues) {
          assert.isFalse(
            intervalMultiplicityFixture.includes(nonIncludedValue),
          );
        }
      });
    });
    describe("#toString()", () => {
      it("does not throw", () => {
        assert.doesNotThrow(() => intervalMultiplicityFixture.toString());
      });
    });
  });
  describe("MultiplicityFactory", () => {
    const multiplicityFactoryFixture = new MultiplicityFactory();
    describe("parseMultiplicity(string | number)", () => {
      it("parses a number single multiplicity", () => {
        const multiplicity = multiplicityFactoryFixture.parseMultiplicity(0);
        assert.isTrue(multiplicity instanceof SingleMultiplicity);
        assert.isTrue(multiplicity.includes(0));
      });
      it("parses a string single multiplicity", () => {
        const multiplicity = multiplicityFactoryFixture.parseMultiplicity("0");
        assert.isTrue(multiplicity instanceof SingleMultiplicity);
        assert.isTrue(multiplicity.includes(0));
      });
      it("parses a closed interval multiplicity", () => {
        const multiplicity = multiplicityFactoryFixture.parseMultiplicity(
          "0..5",
        );
        assert.isTrue(multiplicity instanceof IntervalMultiplicity);
        assert.isFalse(multiplicity.includes(-1));
        assert.isTrue(multiplicity.includes(0));
        assert.isTrue(multiplicity.includes(5));
        assert.isFalse(multiplicity.includes(6));
      });
      it("parses an open interval multiplicity", () => {
        const multiplicity = multiplicityFactoryFixture.parseMultiplicity(
          "1..*",
        );
        assert.isTrue(multiplicity instanceof IntervalMultiplicity);
        assert.isFalse(multiplicity.includes(0));
        assert.isTrue(multiplicity.includes(1));
        assert.isTrue(multiplicity.includes(Infinity));
      });
      it("throws if an interval multiplicity token is malformed", () => {
        assert.throws(() =>
          multiplicityFactoryFixture.parseMultiplicity("a..b..c"),
        );
      });
    });
  });
});
