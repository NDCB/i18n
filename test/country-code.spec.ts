import { assert } from "chai";

import { CountryCode } from "../src/country-code";

describe("CountryCode", () => {
  describe("#from(string)", () => {
    it("yields valid country codes", () => {
      for (const validCountryCode of ["CA", "FR", "CA", "US"]) {
        assert.doesNotThrow(() => CountryCode.from(validCountryCode));
      }
    });
    it("throws if the given code is invalid", () => {
      for (const invalidCountryCode of ["CANADA", "FRANCE"]) {
        assert.throws(() => CountryCode.from(invalidCountryCode));
      }
    });
  });
  describe("#toString()", () => {
    const countryCodeFixture = CountryCode.from("CA");
    it("does not throw", () => {
      assert.doesNotThrow(() => countryCodeFixture.toString());
    });
  });
});
