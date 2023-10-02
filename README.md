# meta

Typescript utilities to encode metadata in the form of JSON into a string using [ZWSP](https://en.wikipedia.org/wiki/Zero-width_space), [NBSP](https://en.wikipedia.org/wiki/Non-breaking_space), and [ZWJ](https://en.wikipedia.org/wiki/Zero-width_joiner). Decoding is also supported.

Meta is supposed to be ran with Bun, and is untested with other runtimes. The `Bun` API is not specifically imported, so it should be compatible.

## Known Issues
- Most text processing applications parse some character combinations as *newlines*, causing unintended formatting
- Encryption is not currently supported