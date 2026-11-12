# Requirements — spectral telegraph interface (Costume-grade UI in a Resurrection entry)

## Introduction
The UI must be unforgettable, but every spooky element must carry information.
DEAD LETTER is submitted to **Resurrection**; the haunting interface is there to
score Design and Presentation, not to change category.

## Requirements (EARS)
- **U1** WHEN a tape is committed, THE System SHALL render n strip cards with a QR
  code, a DATA/PARITY label, an index, and human-readable telegram groups.
- **U2** WHEN a strip is torn (click or keyboard), THE System SHALL visually mark
  it TORN, exclude it from the surviving set, and update the health badge.
- **U3** THE System SHALL show a loss budget `n − k` and SHALL label the tape
  `INTACT`, `x/n ALIVE`, or `UNRECOVERABLE` as strips are lost.
- **U4** WHEN resurrection succeeds, THE System SHALL display the exact message,
  a `VERIFIED · SHA-256` stamp, strips received/used/lost/discarded, fingerprint
  and a plain-language explanation.
- **U5** WHEN resurrection fails, THE System SHALL show `REFUSED` and the reason,
  and SHALL NOT display a guessed message.
- **U6** THE System SHALL provide a single "One-click demo" control that performs
  compose → tear → verified resurrection without any user input.
- **U7** THE System SHALL be usable with keyboard only, SHALL announce state via
  `aria-live`, SHALL respect `prefers-reduced-motion`, and SHALL fit a 390px screen.
- **U8** WHEN printed, THE System SHALL print only the surviving paper strips on
  white with the app chrome hidden.
- **U9** THE System SHALL load no external fonts, scripts, images or stylesheets.

## Correctness properties
| ID | Property |
| --- | --- |
| **UP1** | For every tape, `renderTape()` creates exactly n strip cards. |
| **UP2** | For every torn set, the number of strips sent to intake equals `n − |torn|`. |
| **UP3** | A successful one-click demo always ends with a VERIFIED stamp and a torn strip count > 0. |

`tests/ui-smoke.test.mjs` asserts UP1–UP3 against the built bundle in jsdom.
