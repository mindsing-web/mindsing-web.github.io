# Hugo Shortcodes

This document describes the custom shortcodes available in this Hugo site and how to use them.

## What are Shortcodes?

Shortcodes are simple snippets you can use inside your Markdown content files to add complex HTML without writing raw HTML. They're called using the `{{< shortcode >}}` syntax.

## Available Shortcodes

### YouTube Video Embed

Embeds a responsive YouTube video player.

**Location:** `/web/layouts/shortcodes/youtube.html`

**Usage:**
```
{{< youtube "VIDEO_ID" >}}
```

**Parameters:**
- `VIDEO_ID` (required): The YouTube video ID from the URL

**Examples:**

From URL `https://youtu.be/WzG9vDnizRg`:
```
{{< youtube "WzG9vDnizRg" >}}
```

From URL `https://www.youtube.com/watch?v=WzG9vDnizRg`:
```
{{< youtube "WzG9vDnizRg" >}}
```

**Features:**
- Fully responsive (maintains 16:9 aspect ratio)
- Includes proper iframe attributes for security and accessibility
- Styled with `.video` and `.video--youtube` classes

**CSS Classes:**
- `.video` - Outer wrapper with margin
- `.video__wrapper` - Responsive container maintaining aspect ratio
- `.video--youtube` - Specific styling for YouTube embeds

---

### Partial (Hugo Built-in)

Includes a partial template from `/web/layouts/partials/`.

**Usage:**
```
{{< partial "partial-name.html" >}}
```

**Example:**
```
{{< partial "privacy-banner.html" >}}
```

---

## Creating New Shortcodes

To create a new shortcode:

1. Create an HTML file in `/web/layouts/shortcodes/`
2. Use Hugo template syntax to define the output
3. Access parameters with `.Get 0` (positional) or `.Get "name"` (named)
4. Document it in this file

**Example shortcode structure:**

```html
{{- $param := .Get 0 -}}
{{- if not $param -}}
  {{- errorf "Shortcode requires a parameter" -}}
{{- end -}}

<div class="my-shortcode">
  <!-- Your HTML here -->
  {{ $param }}
</div>
```

## Shortcode Best Practices

1. **Always validate required parameters** - Use `errorf` to provide helpful error messages
2. **Use semantic HTML** - Follow accessibility guidelines
3. **Add CSS classes** - Make shortcodes styleable and maintainable
4. **Keep them simple** - Complex logic belongs in partials or templates
5. **Document thoroughly** - Update this README when adding new shortcodes

## Related Documentation

- [Hugo Shortcodes Documentation](https://gohugo.io/content-management/shortcodes/)
- [Hugo Template Functions](https://gohugo.io/functions/)
- Project CSS: `/web/assets/scss/app.scss`
