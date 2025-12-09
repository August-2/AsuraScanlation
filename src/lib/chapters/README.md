# Chapter Images Guide

This folder contains separate image files for each comic's chapter pages.

## Files

- `comic1.ts` - Shadow Monarch chapter pages
- `comic2.ts` - Tower of Gods chapter pages
- `comic3.ts` - Return of the Disaster-Class Hero chapter pages
- `comic4.ts` - Leveling Up Alone chapter pages
- `comic5.ts` - The Beginning After The End chapter pages
- `comic6.ts` - Omniscient Reader chapter pages

## How to Customize

### Option 1: Replace Individual URLs

Open any file and replace the URLs:

```typescript
export const comic1ChapterPages = [
  "https://your-image-url.com/page1.png",
  "https://your-image-url.com/page2.png",
  "https://your-image-url.com/page3.png",
  "https://your-image-url.com/page4.png",
  "https://your-image-url.com/page5.png",
];
```

### Option 2: Add More Pages

You can add as many page images as you want:

```typescript
export const comic1ChapterPages = [
  "https://image1.png",
  "https://image2.png",
  "https://image3.png",
  "https://image4.png",
  "https://image5.png",
  "https://image6.png",
  "https://image7.png",
  "https://image8.png",
  // Add more...
];
```

The system will randomly cycle through these images for each chapter.

### Where to Get Images

1. **Upload to Discord** → Right-click → Copy Image Address
2. **Upload to Imgur** → Copy direct link
3. **Use Unsplash URLs** (already provided as examples)
4. **Host on your own server**

### Image Requirements

- **Format**: .png, .jpg, .webp, .gif
- **Size**: Recommended 600-800px wide × 1000-1500px tall (vertical manhwa panels)
- **Aspect Ratio**: Portrait/vertical (for scrolling reader)
- **URL**: Must be publicly accessible

## How It Works

Each chapter will display 3-5 pages (varies by chapter number) using images from the array in a rotating pattern.

For example, Chapter 1 might show pages [0,1,2], Chapter 2 shows [1,2,3], etc.

## Tips for Figma Prototyping

1. Use high-quality images (at least 600px wide)
2. Keep all pages for one comic in a consistent style
3. Use vertical/portrait images for best scrolling experience
4. You can use the same images across multiple comics or make each unique
