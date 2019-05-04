import { assert } from "chai";
import { sprintf } from "sprintf-js";

import { AbstractLocale, LocaleCode } from "../src";
import { LocaleValues } from "../src/abstract-locale";

const unlocalized = "Some untranslated phrase.";

const nullaryEn = "Hello World!";
const nullaryFr = "Bonjour l'univers!";

const unaryEn = "Hello %1$s!";
const unaryFr = "Bonjour %1$s!";

const unaryParameter = "Marc-Antoine";

const numericEn = "%1$d people liked this";
const numeric0Fr = "Personne n'a aimé cela.";
const numeric1Fr = "%1$d personne a aimé cela.";
const numeric2IFr = "%1$d personnes ont aimé cela.";
const invalidQuantity = -1;

const languageCode = "fr";
const countryCode = "CA";
const localeCode = `${languageCode}-${countryCode}`;

export class LocaleFixture extends AbstractLocale {
  public constructor() {
    super(LocaleCode.from(localeCode));
  }
  protected values(): LocaleValues {
    return {
      [nullaryEn]: nullaryFr,
      [unaryEn]: unaryFr,
      [numericEn]: {
        "0": numeric0Fr,
        "1": numeric1Fr,
        "2..*": numeric2IFr,
      },
    };
  }
}

describe("AbstractLocale", () => {
  const localeFixture = new LocaleFixture();
  describe("#__", () => {
    it("translates a defined nullary phrase", () => {
      assert.strictEqual(localeFixture.__(nullaryEn), nullaryFr);
    });
    it("translates a defined unary phrase", () => {
      assert.strictEqual(
        localeFixture.__(unaryEn, unaryParameter),
        sprintf(unaryFr, unaryParameter),
      );
    });
    it("throws an error if the phrase is not defined in the locale", () => {
      assert.throws(() => localeFixture.__(unlocalized));
    });
  });
  describe("#__n", () => {
    it("translates single multiplicity phrases", () => {
      assert.strictEqual(
        localeFixture.__n(numericEn, 0),
        sprintf(numeric0Fr, 0),
      );
      assert.strictEqual(
        localeFixture.__n(numericEn, 1),
        sprintf(numeric1Fr, 1),
      );
    });
    it("translates interval multiplicity phrases", () => {
      for (let i = 2; i <= 10; i++) {
        assert.strictEqual(
          localeFixture.__n(numericEn, i),
          sprintf(numeric2IFr, i),
        );
      }
    });
    it("throws if there is no matching multiplicity", () => {
      assert.throws(() => localeFixture.__n(numericEn, invalidQuantity));
    });
    it("throws if the phrase is not defined in the locale", () => {
      assert.throws(() => localeFixture.__n(unlocalized, 0));
    });
  });
  describe("#__m", () => {
    it("does not throw", () => {
      assert.doesNotThrow(() => localeFixture.__m(new Date().toUTCString()));
    });
    it("does not throw with a specified format", () => {
      assert.doesNotThrow(() =>
        localeFixture.__m(new Date().toUTCString(), "LLLL"),
      );
    });
  });
  describe("#getLanguageCode", () => {
    it("returns the langauge code", () => {
      assert.strictEqual(
        localeFixture.getLanguageCode().toString(),
        languageCode,
      );
    });
  });
  describe("#getCountryCode", () => {
    it("returns the country code", () => {
      assert.strictEqual(
        localeFixture.getCountryCode().toString(),
        countryCode,
      );
    });
  });
  describe("#getLocaleCode", () => {
    it("returns the locale code", () => {
      assert.strictEqual(localeFixture.getLocaleCode().toString(), localeCode);
    });
  });
  describe("#getNativeLanguageName", () => {
    it("does not throw", () => {
      assert.doesNotThrow(() => localeFixture.getNativeLanguageName());
    });
  });
  describe("#getNativeCountryName", () => {
    it("does not throw", () => {
      assert.doesNotThrow(() => localeFixture.getNativeCountryName());
    });
  });
});
