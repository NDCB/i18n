import { assert } from "chai";

import { LanguageCode } from "../src/language-code";

describe("LanguageCode", () => {
  describe("#from(string)", () => {
    it("yields valid language codes", () => {
      for (const validLanguageCode of ["fr", "en", "es"]) {
        assert.doesNotThrow(() => LanguageCode.from(validLanguageCode));
      }
    });
    it("throws if the given code is invalid", () => {
      for (const invalidLanguageCode of ["french", "english"]) {
        assert.throws(() => LanguageCode.from(invalidLanguageCode));
      }
    });
  });
  describe("#toString()", () => {
    const languageCodeFixture = LanguageCode.from("fr");
    it("does not throw", () => {
      assert.doesNotThrow(() => languageCodeFixture.toString());
    });
  });
});
