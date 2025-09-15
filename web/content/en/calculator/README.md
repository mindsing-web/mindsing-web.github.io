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
   - `var token = window.formHelpers.createTokenFromForm(form);`
 - Write token to the URL query string:
   - `window.formHelpers.writeTokenToQuery(token);` (writes `?{token}`)
 - Decode token into an object:
   - `var values = window.formHelpers.decodeTokenToObject(token);`
 - Populate a form from a token:
   - `window.formHelpers.populateFormFromToken(token, form);`
 - Utilities:
   - `window.formHelpers.base64UrlEncode(str)` and `base64UrlDecode(str)` are also available.

How to opt-in any form (auto-bind):
 - Add the attribute `data-hash-on-submit` to a `<form>` element and call `formHelpers.initHashOnSubmit()` for dynamically injected content. (The helper exists primarily for the readable-fragment workflow; DIME uses the token flow programmatically.)
 - If you want the form to be submitted normally after hashing, add `data-submit-after-hash="true"`.

Notes & troubleshooting:
 - Sensitive fields such as passwords and file inputs are ignored by the serializer.
 - Check that fields have either `name` or `id` attributes — those are used as keys.
 - If you want the token to be included in a sharable link, copy the full URL including the `?{token}` part.

If you want, I can also add automatic token decoding on page load to repopulate the calculator if a token exists in the URL. Would you like that? 