# Schema.org Structured Data Implementation

## What Was Added

Five schema partials were created to provide rich structured data across your Hugo site:

### 1. **Organization Schema** (`layouts/partials/schema/organization.html`)
- **Appears on:** All pages
- **Purpose:** Establishes MindSing as a brand entity in Google's Knowledge Graph
- **Provides:** Company name, logo, description, contact info
- **Customize:** Add social media profiles to the `sameAs` array

### 2. **BlogPosting Schema** (`layouts/partials/schema/blogposting.html`)
- **Appears on:** Individual blog post pages only
- **Purpose:** Enables rich article cards in search results
- **Provides:** Title, description, author, publisher, dates, images, keywords
- **Uses:** Front matter fields (title, description, featured_image, author, tags)

### 3. **Breadcrumb Schema** (`layouts/partials/schema/breadcrumb.html`)
- **Appears on:** All pages except homepage
- **Purpose:** Shows breadcrumb navigation in search results
- **Provides:** Hierarchical page navigation path
- **Automatically generates** breadcrumbs based on page structure

### 4. **WebSite Schema** (`layouts/partials/schema/website.html`)
- **Appears on:** Homepage only
- **Purpose:** Defines the overall website entity
- **Provides:** Site name, URL, description, publisher info
- **Note:** Can be extended with SearchAction for site search functionality

### 5. **Service Schema** (`layouts/partials/schema/service.html`)
- **Appears on:** Service pages (`/services/*`)
- **Purpose:** Marks service offerings for service-related searches
- **Provides:** Service name, description, provider, area served
- **Type:** ProfessionalService

## How to Customize

### Adding Social Media Profiles

Edit `web/layouts/partials/schema/organization.html`:

```json
"sameAs": [
  "https://twitter.com/mindsing",
  "https://www.linkedin.com/company/mindsing",
  "https://github.com/mindsing"
]
```

### Customizing Blog Author Info

In your blog post front matter, use the `author` field:

```yaml
---
title: "Your Blog Post Title"
author: "Your Name"
---
```

If omitted, defaults to "MindSing"

### Testing Your Schema

1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. **Schema Markup Validator:** https://validator.schema.org/
3. **View Page Source:** Look for `<script type="application/ld+json">` blocks

### What This Enables

✅ **Organization Knowledge Panel** - Your brand info in Google search  
✅ **Article Rich Cards** - Enhanced blog post listings with images  
✅ **Breadcrumb Navigation** - Visual navigation path in search results  
✅ **Service Visibility** - Better ranking for service-related queries  
✅ **Brand Entity Recognition** - Google connects all your content to MindSing  

## Next Steps (Optional)

### 1. Add SearchAction to WebSite Schema
If you implement site search, add this to `website.html`:

```json
"potentialAction": {
  "@type": "SearchAction",
  "target": "https://mindsing.com/search?q={search_term_string}",
  "query-input": "required name=search_term_string"
}
```

### 2. Add FAQ Schema
For pages with frequently asked questions, create `schema/faq.html`

### 3. Add HowTo Schema
For tutorial/guide blog posts, create `schema/howto.html`

### 4. Add Review/Rating Schema
For case studies or testimonials, add review schema

## Files Modified

- `web/layouts/_default/baseof.html` - Added schema partial includes
- `web/config.json` - Added site description parameter
- `web/layouts/partials/schema/` - New directory with 5 schema partials

## Validation

After deploying, verify your schema implementation:
1. Visit any page on your site
2. View page source (Cmd+Option+U)
3. Search for "application/ld+json"
4. Copy the JSON and paste into https://validator.schema.org/

All schema should validate without errors.
