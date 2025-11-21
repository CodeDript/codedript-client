# Assets Folder

This folder contains all static assets for the Code Dript application.

## Structure

```
assets/
├── images/         → Application images and photos
├── icons/          → SVG icons and icon sets
├── fonts/          → Custom font files
└── README.md       → This file
```

## Usage

### Importing Images

```typescript
import logoImage from '../assets/images/logo.png';

// In component
<img src={logoImage} alt="Code Dript Logo" />
```

### Background Images in CSS Modules

```css
.hero {
  background-image: url('../../assets/images/hero-bg.jpg');
}
```

## Recommended Asset Formats

- **Images**: PNG, JPG, WebP
- **Icons**: SVG (preferred), PNG
- **Fonts**: WOFF2, WOFF, TTF

## Optimization Tips

1. Compress images before adding them
2. Use WebP format for better performance
3. Use SVG for icons when possible
4. Include 1x, 2x, and 3x versions for responsive images

## Adding Hero Background Images

To add custom background images to hero sections:

1. Place images in `assets/images/`
2. Update the hero component CSS module:

```css
.hero {
  background-image: url('../../assets/images/your-hero-bg.jpg');
}
```

## Example Hero Background Usage

```typescript
// In HeroMain.module.css
.hero {
  background-image: url('../../assets/images/hero-main-bg.jpg');
  /* or use gradients as currently implemented */
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```
