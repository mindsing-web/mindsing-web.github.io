---
title: "From Figma to Drupal: Building Design Systems that Scale"
slug: "figma-to-drupal-design-systems"
description: "A practical guide to creating and implementing design systems that bridge the gap between Figma designs and Drupal CMS—maintaining consistency from design to production."
featured_image: '../images/pacific-northwest-mountains.jpg'
author: "[Brian Danin](https://www.briandanin.com)"
tags: ["Design Systems", "Figma", "Drupal", "Component Architecture", "UI Development", "Design Tokens", "Twig"]
promoted: true
---

The handoff between design and development is where beautiful visions go to die. Designers create pixel-perfect interfaces in Figma. Developers build functional components in Drupal. And somewhere in between, consistency evaporates like morning dew.

**The problem isn't lack of talent—it's lack of system.**

A design system is the bridge between Figma and your CMS, ensuring that what designers envision is what developers build, and what gets deployed stays consistent as your site grows. But most organizations approach design systems backwards: they try to document what exists rather than establishing a shared language from the start.

Here's how to build a design system that actually scales—from Figma artboards to Drupal production.

## What a Design System Actually Is

**A design system is not:**
- ❌ A style guide (though it includes one)
- ❌ A component library (though it contains one)
- ❌ Brand guidelines (though it incorporates them)
- ❌ A Figma file (though it lives there too)

**A design system is:**
✅ **A shared language** between design and development  
✅ **A set of reusable components** with consistent behavior  
✅ **Design tokens** that define visual properties programmatically  
✅ **Documentation** that explains when and how to use each piece  
✅ **Governance** that ensures consistency over time  

**Most importantly:** A design system is a **single source of truth** that exists in both design tools and production code, kept in sync through deliberate process.

## The Token Foundation

Design tokens are the atomic units of your design system—the named values that define visual properties across your entire system.

### What Are Design Tokens?

Instead of hardcoding values everywhere:

```css
/* ❌ Bad: Magic numbers everywhere */
.button {
  padding: 12px 24px;
  background: #0066CC;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
}

.card {
  padding: 24px;
  background: #0066CC;
  border-radius: 8px;
}
```

Use named tokens that represent decisions:

```css
/* ✅ Good: Semantic tokens */
.button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.card {
  padding: var(--spacing-lg);
  background: var(--color-primary);
  border-radius: var(--radius-md);
}
```

### Token Categories

**Color Tokens:**
```json
{
  "color": {
    "brand": {
      "primary": "#0066CC",
      "secondary": "#2D7738",
      "accent": "#F59E0B"
    },
    "neutral": {
      "900": "#1F2937",
      "700": "#374151",
      "500": "#6B7280",
      "300": "#D1D5DB",
      "100": "#F3F4F6"
    },
    "semantic": {
      "success": "#2D7738",
      "warning": "#F59E0B",
      "error": "#DC2626",
      "info": "#0066CC"
    }
  }
}
```

**Spacing Tokens:**
```json
{
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "12px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px",
    "3xl": "64px"
  }
}
```

**Typography Tokens:**
```json
{
  "typography": {
    "font-family": {
      "sans": "Inter, -apple-system, sans-serif",
      "serif": "Georgia, serif",
      "mono": "Consolas, monospace"
    },
    "font-size": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px"
    },
    "font-weight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    },
    "line-height": {
      "tight": "1.25",
      "base": "1.5",
      "relaxed": "1.75"
    }
  }
}
```

**Border Radius Tokens:**
```json
{
  "radius": {
    "none": "0",
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
  }
}
```

**Shadow Tokens:**
```json
{
  "shadow": {
    "sm": "0 1px 2px rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px rgba(0, 0, 0, 0.15)"
  }
}
```

### Implementing Tokens in Figma

**1. Create Figma Variables (Figma's native token system):**

In Figma, create variable collections:
- **Colors** → Map to color tokens
- **Spacing** → Use for consistent padding/margins
- **Typography** → Font sizes, weights, line heights
- **Border Radius** → Consistent corner rounding

**2. Use Figma Styles for Typography and Colors:**

Create text styles that reference your tokens:
- `Heading/H1` → font: sans, size: 4xl, weight: bold, line-height: tight
- `Heading/H2` → font: sans, size: 3xl, weight: bold, line-height: tight
- `Body/Large` → font: sans, size: lg, weight: normal, line-height: relaxed
- `Body/Base` → font: sans, size: base, weight: normal, line-height: base

**3. Export Tokens Programmatically:**

Use plugins like **Figma Tokens** or **Design Tokens** to export your Figma variables as JSON:

```bash
# Install Figma Tokens plugin
# Configure token sets
# Export to tokens.json
```

Output:
```json
{
  "global": {
    "color": {
      "primary": {
        "value": "#0066CC",
        "type": "color"
      }
    },
    "spacing": {
      "md": {
        "value": "12px",
        "type": "spacing"
      }
    }
  }
}
```

## Building Components in Figma

### Component Architecture

Structure your Figma components to match your planned Drupal component architecture:

**Atomic Design Hierarchy:**

**Atoms** (smallest units):
- Buttons
- Input fields
- Labels
- Icons
- Badges

**Molecules** (simple combinations):
- Form fields (label + input + error message)
- Search box (input + button)
- Card header (title + badge)

**Organisms** (complex combinations):
- Navigation bar
- Hero section
- Card (header + body + footer)
- Form (multiple fields + submit button)

**Templates** (page layouts):
- Article page
- Landing page
- List page
- Dashboard

### Figma Component Best Practices

**1. Use Component Properties (Variants + Props):**

```
Button (Component Set)
├─ Variant: Primary
│  ├─ State: Default
│  ├─ State: Hover
│  ├─ State: Disabled
│  └─ Size: Small, Medium, Large
├─ Variant: Secondary
│  ├─ State: Default
│  ├─ State: Hover
│  └─ ...
└─ Variant: Ghost
   └─ ...
```

**2. Use Auto Layout:**

Configure auto layout properties that match your CSS:
- **Padding:** Use spacing tokens (xs, sm, md, lg)
- **Gap:** Space between items
- **Flex direction:** Row or column
- **Alignment:** Flex start, center, end

**3. Name Components to Match Code:**

```
// Figma component name
Button/Primary/Medium/Default

// Becomes Drupal component
components/button/button--primary.html.twig
```

**4. Create Component Documentation in Figma:**

Use Figma's description field to document:
- **When to use:** "Use primary buttons for main actions"
- **Accessibility:** "Must have accessible label"
- **States:** "Supports default, hover, focus, disabled"
- **Props:** "Required: text. Optional: icon, size"

## Translating Design to Drupal

### Drupal Component Architecture

Drupal's component structure maps well to design systems:

**Directory Structure:**
```
web/themes/custom/yourtheme/
├── components/
│   ├── atoms/
│   │   ├── button/
│   │   │   ├── button.twig
│   │   │   ├── button.scss
│   │   │   └── button.yml (component metadata)
│   │   ├── input/
│   │   └── icon/
│   ├── molecules/
│   │   ├── card/
│   │   ├── form-field/
│   │   └── search-box/
│   ├── organisms/
│   │   ├── header/
│   │   ├── footer/
│   │   └── hero/
│   └── templates/
│       ├── page/
│       └── node/
├── assets/
│   ├── tokens/
│   │   └── tokens.json (exported from Figma)
│   ├── scss/
│   │   ├── _tokens.scss (generated from tokens.json)
│   │   └── _variables.scss
│   └── js/
└── patterns/
    └── pattern-lab/ (optional: living style guide)
```

### Converting Tokens to Drupal/SCSS

**1. Transform JSON tokens to SCSS variables:**

Use a build tool like **Style Dictionary** or **Theo**:

```javascript
// build-tokens.js
const StyleDictionary = require('style-dictionary');

const sd = StyleDictionary.extend({
  source: ['assets/tokens/**/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'assets/scss/',
      files: [{
        destination: '_tokens.scss',
        format: 'scss/variables'
      }]
    },
    css: {
      transformGroup: 'css',
      buildPath: 'assets/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables'
      }]
    }
  }
});

sd.buildAllPlatforms();
```

**Input (tokens.json):**
```json
{
  "color": {
    "primary": { "value": "#0066CC" }
  },
  "spacing": {
    "md": { "value": "12px" }
  }
}
```

**Output (_tokens.scss):**
```scss
$color-primary: #0066CC;
$spacing-md: 12px;

:root {
  --color-primary: #{$color-primary};
  --spacing-md: #{$spacing-md};
}
```

**2. Use tokens in component styles:**

```scss
// components/atoms/button/button.scss
@import '../../../assets/scss/tokens';

.button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-sm);
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: white;
  transition: all 0.2s;

  &:hover {
    background: var(--color-primary-dark);
    border-color: var(--color-primary-dark);
  }

  &--secondary {
    background: transparent;
    color: var(--color-primary);
    
    &:hover {
      background: var(--color-primary-light);
    }
  }

  &--large {
    padding: var(--spacing-lg) var(--spacing-xl);
    font-size: var(--font-size-lg);
  }
}
```

### Building Twig Components

**Button Component Example:**

```twig
{# components/atoms/button/button.twig #}
{%
  set classes = [
    'button',
    variant ? 'button--' ~ variant,
    size ? 'button--' ~ size,
    disabled ? 'button--disabled',
  ]
%}

<button 
  class="{{ classes|join(' ')|trim }}"
  type="{{ type|default('button') }}"
  {{ disabled ? 'disabled' }}
  {{ attributes }}
>
  {% if icon %}
    {% include '@atoms/icon/icon.twig' with {
      name: icon,
      size: 'sm'
    } %}
  {% endif %}
  {{ text }}
</button>
```

**Component Metadata (button.yml):**
```yaml
'$schema': 'https://git.drupalcode.org/project/sdc/-/raw/1.x/src/metadata.schema.json'
name: Button
description: 'Reusable button component with variants'
props:
  type: object
  properties:
    text:
      type: string
      title: Button Text
      description: The text displayed in the button
      required: true
    variant:
      type: string
      title: Variant
      description: Visual style of the button
      enum:
        - primary
        - secondary
        - ghost
      default: primary
    size:
      type: string
      title: Size
      enum:
        - small
        - medium
        - large
      default: medium
    icon:
      type: string
      title: Icon
      description: Optional icon name
    disabled:
      type: boolean
      title: Disabled
      default: false
    type:
      type: string
      title: Button Type
      enum:
        - button
        - submit
        - reset
      default: button
```

**Using the Component:**

```twig
{# In a template or another component #}
{% include '@atoms/button/button.twig' with {
  text: 'Get Started',
  variant: 'primary',
  size: 'large',
  icon: 'arrow-right'
} %}
```

### Card Component (More Complex Example)

**Figma Structure:**
```
Card (Component Set)
├─ Header
│  ├─ Title (text)
│  └─ Badge (optional)
├─ Body
│  └─ Content (slot)
└─ Footer
   └─ Actions (slot)
```

**Drupal Implementation:**

```twig
{# components/molecules/card/card.twig #}
{%
  set classes = [
    'card',
    variant ? 'card--' ~ variant,
  ]
%}

<article class="{{ classes|join(' ')|trim }}" {{ attributes }}>
  {% if header %}
    <header class="card__header">
      <h3 class="card__title">{{ header.title }}</h3>
      {% if header.badge %}
        {% include '@atoms/badge/badge.twig' with header.badge %}
      {% endif %}
    </header>
  {% endif %}

  <div class="card__body">
    {{ body }}
  </div>

  {% if footer %}
    <footer class="card__footer">
      {{ footer }}
    </footer>
  {% endif %}
</article>
```

**Card SCSS:**
```scss
// components/molecules/card/card.scss
@import '../../../assets/scss/tokens';

.card {
  background: white;
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  &__header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-neutral-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-neutral-900);
  }

  &__body {
    padding: var(--spacing-lg);
    color: var(--color-neutral-700);
    line-height: var(--line-height-relaxed);
  }

  &__footer {
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-neutral-100);
    border-top: 1px solid var(--color-neutral-200);
  }

  &--featured {
    border: 2px solid var(--color-primary);
    box-shadow: var(--shadow-lg);
  }
}
```

**Usage:**
```twig
{% include '@molecules/card/card.twig' with {
  variant: 'featured',
  header: {
    title: 'Featured Article',
    badge: {
      text: 'New',
      variant: 'success'
    }
  },
  body: content,
  footer: include('@atoms/button/button.twig', {
    text: 'Read More',
    variant: 'secondary'
  })
} %}
```

## Keeping Figma and Drupal in Sync

The biggest challenge with design systems: **maintaining consistency over time**.

### Workflow for Updates

**1. Design Changes Start in Figma:**
- Update design tokens in Figma variables
- Update component designs
- Document changes in component descriptions

**2. Export Tokens:**
```bash
# Export tokens from Figma using plugin
# Place in assets/tokens/tokens.json
```

**3. Generate Code:**
```bash
# Run token build script
npm run build-tokens

# Output: Updated _tokens.scss with new values
```

**4. Update Components:**
- Review component styles for token usage
- Update any hardcoded values to use tokens
- Test components in Storybook or Pattern Lab

**5. Document Changes:**
```markdown
## Changelog

### 2025-10-27
- Updated primary color from #0055B8 to #0066CC
- Added new spacing token: 3xl (64px)
- Button component: Added 'large' size variant
- Card component: Updated shadow from md to lg on hover
```

### Automation Opportunities

**GitHub Actions Workflow:**

```yaml
# .github/workflows/design-tokens.yml
name: Update Design Tokens

on:
  push:
    paths:
      - 'assets/tokens/**'

jobs:
  build-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build tokens
        run: npm run build-tokens
      
      - name: Commit generated files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add assets/scss/_tokens.scss
          git commit -m "chore: Update generated token files" || echo "No changes"
          git push
```

**Figma API Integration (Advanced):**

```javascript
// sync-figma-tokens.js
const Figma = require('figma-api');
const fs = require('fs');

const api = new Figma.Api({
  personalAccessToken: process.env.FIGMA_TOKEN
});

async function syncTokens() {
  // Fetch Figma file
  const file = await api.getFile(process.env.FIGMA_FILE_ID);
  
  // Extract variables/styles
  const tokens = extractTokensFromFile(file);
  
  // Write to tokens.json
  fs.writeFileSync(
    'assets/tokens/tokens.json',
    JSON.stringify(tokens, null, 2)
  );
  
  console.log('Tokens synced from Figma');
}

syncTokens();
```

## Documentation and Governance

### Living Style Guide

Use **Storybook** or **Pattern Lab** to create a living documentation site:

**Storybook Example:**

```javascript
// components/atoms/button/button.stories.js
import button from './button.twig';
import './button.scss';

export default {
  title: 'Atoms/Button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost']
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    disabled: {
      control: 'boolean'
    }
  }
};

const Template = (args) => button(args);

export const Primary = Template.bind({});
Primary.args = {
  text: 'Primary Button',
  variant: 'primary',
  size: 'medium'
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'Secondary Button',
  variant: 'secondary',
  size: 'medium'
};

export const Large = Template.bind({});
Large.args = {
  text: 'Large Button',
  variant: 'primary',
  size: 'large'
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  text: 'Button with Icon',
  variant: 'primary',
  icon: 'arrow-right'
};
```

**Run Storybook:**
```bash
npm run storybook
# Opens http://localhost:6006 with component playground
```

### Governance Model

**Who owns what:**

**Design Team:**
- Owns Figma source of truth
- Proposes new components and patterns
- Documents design decisions
- Approves visual changes

**Development Team:**
- Owns Drupal implementation
- Ensures technical feasibility
- Maintains component code quality
- Approves technical changes

**Product/Content Team:**
- Validates component usefulness
- Provides real-world usage feedback
- Requests new patterns based on needs

**Design System Core Team (Cross-functional):**
- Reviews all proposed changes
- Maintains documentation
- Ensures consistency
- Manages releases

### Contribution Process

**1. Propose New Component:**
```markdown
## Component Proposal: Alert Banner

### Use Case
Display important messages to users (errors, warnings, success, info)

### Variants Needed
- Error (red)
- Warning (amber)
- Success (green)
- Info (blue)

### Props
- message (string, required)
- variant (enum, required)
- dismissible (boolean, optional)
- icon (string, optional)

### Design
[Link to Figma prototype]

### Questions for Review
- Should this be dismissible by default?
- Do we need an "action" prop for CTA buttons?
```

**2. Design Review:**
- Design team creates Figma component
- Reviews with stakeholders
- Approves for development

**3. Development:**
- Dev creates Drupal component
- Matches Figma specifications
- Writes Storybook documentation
- Creates unit tests

**4. Review & Merge:**
- Design team verifies visual match
- Code review by senior dev
- Merge to design system
- Update changelog

## Real-World Implementation Tips

### Start Small, Scale Gradually

**Phase 1: Foundation (Month 1)**
- Establish design tokens
- Create 3-5 atoms (button, input, heading, paragraph, link)
- Set up build process
- Document workflow

**Phase 2: Core Components (Months 2-3)**
- Build essential molecules (form field, card, navigation item)
- Create 2-3 organisms (header, footer, hero)
- Establish pattern library
- Train team on usage

**Phase 3: Expansion (Months 4-6)**
- Add domain-specific components
- Refine based on real usage
- Optimize workflow
- Improve documentation

### Common Pitfalls to Avoid

❌ **Trying to document everything upfront**
- Start with what you need, expand as you grow

❌ **Making components too generic**
- "One-size-fits-all" becomes "fits-nothing-well"

❌ **Making components too specific**
- Too many variants = maintenance nightmare

❌ **Not involving developers early**
- Beautiful designs that are impossible to build

❌ **No clear governance**
- Everyone adding components = chaos

❌ **Treating it as one-time project**
- Design systems are living, evolving systems

### Success Metrics

**Efficiency Metrics:**
- Time to build new page (should decrease)
- Component reuse rate (should increase)
- Design-to-dev handoff time (should decrease)

**Quality Metrics:**
- Visual consistency across site (audit periodically)
- Accessibility compliance rate
- Performance scores (smaller CSS, less duplication)

**Adoption Metrics:**
- % of pages using design system components
- % of new features built with system
- Team satisfaction scores

## Tools and Resources

**Design Tools:**
- **Figma** - Design and prototyping
- **Figma Tokens** - Plugin for token management
- **Design Tokens** - Alternative token plugin

**Build Tools:**
- **Style Dictionary** - Transform tokens to multiple formats
- **Theo** - Salesforce's token tool
- **Token Transformer** - Figma Tokens → Style Dictionary

**Component Development:**
- **Storybook** - Component playground and documentation
- **Pattern Lab** - Alternative to Storybook
- **Drupal SDC** - Single Directory Components module

**Version Control:**
- **Abstract** - Version control for Figma (if needed)
- **Git** - Version control for code
- **GitHub/GitLab** - Repository hosting

**Documentation:**
- **Storybook Docs** - Auto-generated documentation
- **Zeroheight** - Design system documentation platform
- **Notion/Confluence** - General documentation

## The Bottom Line

A design system isn't about restricting creativity—it's about **creating a shared language** that makes teams faster and products better.

**With a well-implemented design system:**
- ✅ Designers spend time solving problems, not reinventing buttons
- ✅ Developers build faster with reusable components
- ✅ Products stay visually consistent as they scale
- ✅ New team members onboard quicker
- ✅ Accessibility and performance improve across the board

**The key is the bridge:** Figma and Drupal must speak the same language through design tokens, shared naming conventions, and documented patterns.

**Start with tokens.** Build atoms. Compose molecules. Document as you go. Govern with intention.

Your design system will never be "done"—but that's the point. It should evolve as your product and team evolve, always staying slightly ahead of your current needs.

Ready to build a design system that bridges Figma and Drupal? [Let's map out your component architecture](/booking) and create a system that scales with your ambitions.

**Great design systems don't constrain—they liberate teams to move faster with confidence.**
