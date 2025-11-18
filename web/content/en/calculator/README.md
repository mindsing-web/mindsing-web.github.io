---
draft: true
---

# Calculator: URL Token Behavior

This README explains how the calculator serializes form values into an opaque token placed in the browser URL so results can be saved and later decoded to repopulate the form.

Where implemented:
 - Helpers are in `web/assets/js/form__helpers.js`.
 - The DIME calculator uses these helpers in `web/assets/js/form__dime-calculator.js`.

What it does:
 - When the calculator `Calculate` button is clicked the DIME calculator now creates an opaque token: a base64url-encoded JSON blob containing the serialized form values.
 - The token is written to the query string as `?{token}` (for example `?eyJhb...`) using `history.replaceState()` so the page does not reload.
 - The token is reversible — it can be decoded back into the original form values.

Programmatic usage:
 - Create token from a form:
  - `var token = await window.formHelpers.createTokenFromForm(form);` (returns a Promise; use `await` or `.then()`)
 - Write token to the URL query string:
   - `window.formHelpers.writeTokenToQuery(token);` (writes `?{token}`)
 - Decode token into an object:
   - `var values = window.formHelpers.decodeTokenToObject(token);`
  - `var values = await window.formHelpers.decodeTokenToObject(token);` (returns a Promise resolving to the object)
 - Populate a form from a token:
   - `window.formHelpers.populateFormFromToken(token, form);`
 - Utilities:
   - `window.formHelpers.base64UrlEncode(str)` and `base64UrlDecode(str)` are also available.

Signing and salts
 - To prevent casual decoding of tokens, pages can include a `token_salt` value in their front matter and the form can carry the same value in a `data-token-salt` attribute.
 - When a salt is provided, tokens are signed with HMAC-SHA256(payload, salt) and written as `{payload}.{sig}` where `payload` is base64url(JSON) and `sig` is the base64url HMAC.
 - Verification is supported: call `window.formHelpers.decodeTokenToObject(token, { salt: '<page-salt>' })`. If verification fails an empty object is returned.

How to generate salts for pages
 - Use a cryptographically secure random string. Example (Node):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''))"
```

 - Or on macOS / Linux (OpenSSL):

```bash
openssl rand -base64 32 | tr '+/' '-_' | tr -d '='
```

 - The salt can be any reasonably long random string (at least 32 bytes before encoding recommended). Store it in the page front matter as `token_salt` and set the same value on the `<form>` as `data-token-salt`.

Security notes
 - The salt is required for verification; without it tokens are trivially decodable because the payload is just base64url(JSON).
 - The salt should be treated as a secret for pages where you want to prevent casual decoding. It should be stored in source (front matter) but not exposed publicly if you need strong secrecy (note: if the page is public, front matter may be visible in the repo).

Password protection and encrypted sharing
 - Calculator pages can be password-protected by adding a `password: "yourpassword"` field to the front matter.
 - When a user unlocks protected content by entering the correct password, the plaintext password is automatically stored in localStorage under the key `password_gate:{page-id}` (where `{page-id}` is the `data-protect-id` attribute).
 - This stored password enables encrypted sharing functionality: when the Calculate button is clicked, the form data is encrypted using AES-GCM with the stored password and embedded in a shareable URL.
 - Encrypted share URLs have the format: `?ct=...&iv=...&salt=...#key=password` where the ciphertext is in the query string and the decryption key is in the URL fragment.
 - The "Add Key" functionality allows users to paste encrypted ciphertext (starting with `ct=...`) to decrypt and populate the form, automatically triggering calculation.
 - The password storage system ensures that encrypted keys can be decrypted even after page refreshes, as long as the user has previously unlocked the content.

How password protection works:
 1. Hugo generates a SHA-256 hash of the password and places it in the DOM as `data-protect-password-hash`
 2. User enters password, which gets hashed client-side and compared to the stored hash
 3. On successful unlock: password is stored in localStorage, hash is removed from DOM for security
 4. The plaintext password in localStorage is used for encrypting/decrypting shared form data

Automatic population on page load
 - If you want the page to auto-populate the form when a token is present in the URL, call `formHelpers.populateFormFromToken(token, form)` on load. If the token is signed and a salt is present, pass the salt when decoding via `decodeTokenToObject`.

How to opt-in any form (auto-bind):
 - Add the attribute `data-hash-on-submit` to a `<form>` element and call `formHelpers.initHashOnSubmit()` for dynamically injected content. (The helper exists primarily for the readable-fragment workflow; DIME uses the token flow programmatically.)
 - If you want the form to be submitted normally after hashing, add `data-submit-after-hash="true"`.

Notes & troubleshooting:
 - Sensitive fields such as passwords and file inputs are ignored by the serializer.
 - Check that fields have either `name` or `id` attributes — those are used as keys.
 - If you want the token to be included in a sharable link, copy the full URL including the `?{token}` part.

If you want, I can also add automatic token decoding on page load to repopulate the calculator if a token exists in the URL. Would you like that?
