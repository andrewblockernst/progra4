# HTML and CSS Fundamentals

## Introduction to Web Development

Modern web development is built on three core technologies: HTML (structure), CSS (presentation), and JavaScript (behavior). This document focuses on HTML and CSS, which together form the foundation of every website.

### Learning Objectives
- Understand the basic structure of HTML documents.
- Learn how to use CSS to style HTML elements.
- Explore modern CSS features and best practices.
- Gain insights into web accessibility and responsive design.

### The Role of HTML and CSS in Modern Web Development

#### HTML's Role
HTML (HyperText Markup Language) is the backbone of the web. It:
- Provides semantic structure to web content.
- Ensures accessibility for all users.
- Helps search engines understand content.
- Creates the foundation for progressive enhancement.
- Supports cross-platform compatibility.

In modern web development, HTML5 introduces:
- Semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`)
- Native support for multimedia (`<video>`, `<audio>`)
- Enhanced form capabilities
- Support for web components

#### CSS's Role
CSS (Cascading Style Sheets) has evolved from simple styling to a powerful layout and design system. Modern CSS can:
- Create responsive layouts using Flexbox and Grid.
- Handle animations and transitions.
- Implement modern design systems.
- Support dark/light themes.
- Enable progressive enhancement.
- Optimize performance through various techniques.

## HTML (HyperText Markup Language)

### What is HTML?
HTML is the standard markup language for creating web pages. It describes the structure of web content using a system of elements and tags.

### Basic HTML Structure
```html
<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    <h1>This is a heading</h1>
    <p>This is a paragraph.</p>
</body>
</html>
```

### Common HTML Elements

#### Text Elements
- `<h1>` to `<h6>`: Headings (h1 being the highest level)
- `<p>`: Paragraphs
- `<span>`: Inline text container
- `<div>`: Block-level container
- `<strong>` or `<b>`: Bold text
- `<em>` or `<i>`: Italic text
- `<br>`: Line break
- `<hr>`: Horizontal rule

#### Links and Images
- `<a>`: Hyperlinks
- `<img>`: Images
- `<figure>`: Container for images with captions
- `<figcaption>`: Caption for figures

#### Lists
- `<ul>`: Unordered list
- `<ol>`: Ordered list
- `<li>`: List item
- `<dl>`: Description list
- `<dt>`: Description term
- `<dd>`: Description details

#### Forms
- `<form>`: Form container
- `<input>`: Input field
- `<label>`: Form label
- `<button>`: Button
- `<select>`: Dropdown list
- `<textarea>`: Multi-line text input

#### Tables
- `<table>`: Table container
- `<tr>`: Table row
- `<th>`: Table header
- `<td>`: Table data cell
- `<thead>`: Table header section
- `<tbody>`: Table body section

### HTML Attributes
- `class`: For CSS styling
- `id`: Unique identifier
- `src`: Source for images/scripts
- `href`: Hyperlink reference
- `alt`: Alternative text for images
- `type`: Input type
- `name`: Form element name
- `value`: Input value

### Important Modern Concepts

#### Accessibility
##### What is Accessibility?
Web accessibility means designing and developing websites that can be used by everyone, regardless of their abilities or disabilities. This includes people with:
- Visual impairments (blindness, low vision, color blindness)
- Hearing impairments
- Motor/mobility limitations
- Cognitive disabilities
- Age-related limitations

##### Why is Accessibility Important?
1. **Inclusivity**: Making the web accessible ensures that all users, regardless of their abilities, can access and interact with online content effectively.
2. **Legal Requirements**: Many countries have laws requiring websites to be accessible (e.g., ADA in the US, EAA in EU), making accessibility a legal obligation.
3. **Business Benefits**:
   - Larger audience reach
   - Better SEO performance
   - Enhanced brand reputation
   - Reduced legal risks
   - Improved user experience for all users
4. **Social Responsibility**: Creating accessible websites contributes to a more inclusive digital world and demonstrates corporate social responsibility.

Key Implementation Areas:
- Use semantic HTML elements
- Provide sufficient color contrast
- Ensure keyboard navigation
- Support screen readers
- Implement ARIA attributes when needed

#### ARIA (Accessible Rich Internet Applications)
ARIA attributes provide additional semantic information about elements and interactions to assistive technologies. Here are key ARIA concepts:

1. **ARIA Roles**
   ```html
   <div role="alert">Important notification</div>
   <div role="navigation">Main menu</div>
   <button role="tab">Settings</button>
   ```

2. **ARIA States and Properties**
   ```html
   <button aria-expanded="false">Show more</button>
   <input aria-required="true" type="text">
   <div aria-hidden="true">Hidden content</div>
   ```

3. **Common ARIA Patterns**:
   - Landmarks: Define regions of the page
   ```html
   <div role="banner">Header content</div>
   <main role="main">Main content</main>
   <div role="complementary">Sidebar</div>
   ```
   
   - Live Regions: Announce dynamic content changes
   ```html
   <div aria-live="polite">Updated content here</div>
   ```

   - Dialog patterns
   ```html
   <div role="dialog" aria-labelledby="dialogTitle">
     <h2 id="dialogTitle">Dialog heading</h2>
   </div>
   ```

Best Practices for ARIA:
- Use native HTML elements and attributes when possible
- Only add ARIA when necessary
- Test with screen readers
- Maintain ARIA states during interactions
- Ensure ARIA attributes have valid values

Remember: No ARIA is better than bad ARIA. Always prefer semantic HTML elements over ARIA when available.

## CSS (Cascading Style Sheets)

### What is CSS?
CSS is the language used to style and layout web pages. It describes how HTML elements should be displayed.

### Ways to Include CSS
1. Inline CSS (within HTML elements)
2. Internal CSS (within `<style>` tag in head)
3. External CSS (linked file)

### CSS Selectors
1. Element selector: `p { }`
2. Class selector: `.classname { }`
3. ID selector: `#idname { }`
4. Attribute selector: `[attribute] { }`
5. Pseudo-class selector: `:hover { }`
6. Pseudo-element selector: `::before { }`
7. Combinators:
   - Descendant: `div p`
   - Child: `div > p`
   - Adjacent sibling: `div + p`
   - General sibling: `div ~ p`

### CSS Properties

#### Box Model
- `width`: Element width
- `height`: Element height
- `margin`: Outer spacing
- `padding`: Inner spacing
- `border`: Border around element
- `box-sizing`: Box model calculation method

#### Layout
- `display`: Display type (block, inline, flex, grid)
- `position`: Positioning method
- `float`: Floating behavior
- `clear`: Clear floating elements
- `overflow`: Overflow behavior

#### Colors and Background
- `color`: Text color
- `background-color`: Background color
- `background-image`: Background image
- `background-size`: Background size
- `background-position`: Background position
- `background-repeat`: Background repeat

#### Typography
- `font-family`: Font family
- `font-size`: Font size
- `font-weight`: Font weight
- `font-style`: Font style
- `text-align`: Text alignment
- `line-height`: Line height
- `letter-spacing`: Letter spacing

#### Flexbox
- `flex-direction`: Main axis direction
- `justify-content`: Main axis alignment
- `align-items`: Cross axis alignment
- `flex-wrap`: Wrapping behavior
- `flex-grow`: Growth factor
- `flex-shrink`: Shrink factor
- `flex-basis`: Initial size

#### Grid
- `grid-template-columns`: Column definition
- `grid-template-rows`: Row definition
- `grid-gap`: Gap between grid items
- `grid-column`: Column placement
- `grid-row`: Row placement
- `grid-area`: Grid area placement

#### Transitions and Animations
- `transition`: Transition properties
- `animation`: Animation properties
- `transform`: Transform properties
- `@keyframes`: Animation keyframes

### CSS Units
- Absolute units: px, pt, cm, mm, in
- Relative units: em, rem, %, vh, vw
- Viewport units: vh, vw, vmin, vmax

### CSS Specificity
1. Inline styles
2. IDs
3. Classes, attributes, and pseudo-classes
4. Elements and pseudo-elements

### Media Queries
```css
@media screen and (max-width: 768px) {
    /* Styles for screens smaller than 768px */
}
```

### CSS Variables (Custom Properties)
```css
:root {
    --primary-color: #007bff;
}

.element {
    color: var(--primary-color);
}
```

### CSS Best Practices
1. Use meaningful class names
2. Follow a consistent naming convention
3. Keep selectors simple and specific
4. Use CSS variables for repeated values
5. Organize CSS with comments
6. Consider mobile-first approach
7. Use appropriate units
8. Minimize use of !important
9. Consider performance implications
10. Use modern CSS features when appropriate

### Practical Example: Modern Landing Page
Here's a simple example combining HTML and CSS to create a modern landing page section:

See the complete code example in [examples/index.html](./examples/index.html).

This example demonstrates:
- Modern HTML5 semantic structure
- CSS custom properties (variables)
- Flexbox and Grid layouts
- Responsive design
- Modern CSS features (transitions, gradients)
- Mobile-first approach

### Additional Resources
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web) for in-depth documentation on HTML and CSS.
- [W3Schools](https://www.w3schools.com/) for interactive tutorials and examples.
- [CSS Tricks](https://css-tricks.com/) for tips and tricks on CSS.

### Feedback
We welcome your feedback! Please let us know how we can improve this document to better serve your learning needs.