# i18n

[![Documentation](https://img.shields.io/website-up-down-green-red/https/ndcb.github.io/i18n.svg?label=documentation)](https://ndcb.github.io/i18n/)
[![Build Status](https://travis-ci.org/NDCB/i18n.svg)](https://travis-ci.org/NDCB/i18n)
[![Test Coverage](https://api.codeclimate.com/v1/badges/30b7117b6d8ec31987dc/test_coverage)](https://codeclimate.com/github/NDCB/i18n/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/30b7117b6d8ec31987dc/maintainability)](https://codeclimate.com/github/NDCB/i18n/maintainability)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

---

A simple object-oriented localization utility.

---

## Installation

Using npm:

```sh
npm install https://github.com/NDCB/i18n/releases/download/v1.0.0/i18n-v1.0.0.tgz
```

## Usage

This utility provides classes to represent standard language, country and locale codes.
These are used to define locale.
The actual phrases used in the localization need to be specified as locale values.
As such, a subclass of `AbstractLocale` needs to be implemented to provide these values.

The values of a locale correspond to an object as follows.
The keys of the object correspond to the source phrases, and the values either correspond to the localized phrase, or a mapping of localized phrases mapped by multiplicities.
These multiplicities are either single values, or intervals formatted as `a..b` for `[a, b]`, where `b` may be `*` for intervals `[a, Infinity)`.

```ts
interface LocaleValues {
  [phrase: string]: string | { [multiplicity: string]: string };
}
```

Then, using an instance `locale` of such a class, with french localized values from english:

```js
// Localize simple phrases
locale.__("Hello World!") //=> "Bonjour l'univers!"
// Localize phrases with parameters
locale.__("Hi %1$s!", "Marc-Antoine") //=> "Salut Marc-Antoine!"
// Localize phrases with a quantifier
locale.__n("Articles published: %1$d", quantity) //=> "Articles publiés: 10"
// Localize a moment
locale.__m("2019-05-04") //=> "4 mai 2019"
```

## About

### Building the documentation

```sh
npm run doc
```

### Running the tests

```sh
npm run test
```

### Building the library

```sh
npm run build
```

### Authors

- **Marc-Antoine Ouimet** - [MartyO256](https://github.com/MartyO256)

### License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md)
file for details.
