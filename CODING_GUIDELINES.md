# MindSing Hugo Coding Guidelines

## CSS/Styling Best Practices

### 1. Use Tachyons First
- Always prefer Tachyons utility classes for styling
- Examples: `w-100`, `mb3`, `ph3`, `flex-l`, `overflow-hidden`
- Reference: https://tachyons.io/

### 2. Custom Classes Second
- If Tachyons doesn't provide what you need, create custom classes
- Add custom styles to `/web/assets/scss/app.scss`
- Use semantic, descriptive class names (e.g., `promoted-blog-image`)

### 3. Avoid Inline Styles
- **Never use inline `style` attributes**
- Inline styles make code harder to maintain and override
- They prevent consistent theming and responsive design

### 4. Avoid `!important`
- Only use `!important` as a last resort
- If you need it, there's usually a better solution with specificity
- Document why it's needed if you must use it

### 5. Responsive Design Patterns
- Use Tachyons breakpoint suffixes:
  - `-ns` = not small (30em and up)
  - `-m` = medium (30em - 60em)
  - `-l` = large (60em and up)
- Example: `w-100 w-third-l` (full width on mobile, 1/3 on large screens)

### 6. SCSS Organization
- Import order in `app.scss`:
  1. Variables (`vars.scss`)
  2. Buttons, components
  3. Global styles
  4. Component-specific styles
- Use comments to organize sections
- Keep related styles grouped together

## Hugo Template Best Practices

### 1. Use Partials for Reusable Components
- Create partials in `/web/layouts/partials/`
- Keep templates DRY (Don't Repeat Yourself)
- Examples: `summary-promoted.html`, `summary-with-image.html`

### 2. Filter Content Appropriately
- Use `where` to filter pages by section, type, or parameters
- Example: `{{ where .Site.RegularPages "Section" "!=" "blog" }}`
- Filter by front matter: `{{ where $pages "Params.promoted" true }}`

### 3. Front Matter Conventions
- Use lowercase for boolean flags: `promoted: true`
- Be consistent with naming conventions
- Document custom front matter fields

### 4. Performance Considerations
- Limit the number of items in loops with `first`
- Example: `{{ range first 3 $blogPosts }}`
- Cache partial results when possible

## Project-Specific Patterns

### Blog Posts
- Category pages stored in `/content/en/blog/category/`
- Filter them out from main blog listings
- Use `promoted: true` in front matter for featured posts

### Image Handling
- Use `GetFeaturedImage.html` partial function
- Set consistent image heights for card layouts
- Use `object-fit: cover` for responsive cropping

### Layout Breakpoints
- Small: < 30em (mobile)
- Medium: 30em - 60em (tablet)
- Large: > 60em (desktop)

## Common Patterns

### Three-Column Layout (Desktop)
```html
<section class="flex-l flex-wrap">
  <div class="w-100 w-third-l ph2-l mb4">
    <!-- Content -->
  </div>
</section>
```

### Fixed-Height Image Containers
```scss
.image-container {
  height: 200px;
  
  img {
    object-fit: cover;
  }
}
```

### Filtering Blog Posts
```go
{{ $blogPosts := where .Site.RegularPages "Section" "blog" }}
{{ $blogPosts = where $blogPosts "Params.promoted" true }}
{{ range first 3 $blogPosts }}
  <!-- Display posts -->
{{ end }}
```

## Remember
1. Tachyons → Custom Classes → Inline Styles (never)
2. No `!important` unless absolutely necessary
3. Use semantic class names
4. Keep responsive design in mind
5. Comment complex sections
6. Test on mobile and desktop
