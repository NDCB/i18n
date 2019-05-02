import { assert } from "chai";

import { LocaleCode } from "../src/locale-code";

describe("LocaleCode", () => {
  describe("#from(string)", () => {
    it("yields valid locale codes", () => {
      for (const validLocaleCode of ["fr-CA", "en-CA", "fr-FR"]) {
        assert.doesNotThrow(() => LocaleCode.from(validLocaleCode));
      }
    });
    it("yields valid locale codes with defined delimiter", () => {
      for (const validLocaleCode of ["fr_CA", "en_CA", "fr_FR"]) {
        assert.doesNotThrow(() => LocaleCode.from(validLocaleCode, "_"));
      }
    });
    it("throws if the given code is invalid", () => {
      for (const invalidLocaleCode of [
        "french-CANADA",
        "eng_CAD",
        "fr-CA-QC",
      ]) {
        assert.throws(() => LocaleCode.from(invalidLocaleCode));
      }
    });
  });
  describe("#toString()", () => {
    const localeCodeFixture = LocaleCode.from("fr-CA");
    it("does not throw", () => {
      assert.doesNotThrow(() => localeCodeFixture.toString());
      assert.doesNotThrow(() => localeCodeFixture.toString("_"));
    });
  });
});
