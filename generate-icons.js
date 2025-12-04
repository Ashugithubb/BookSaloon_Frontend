const fs = require('fs');
const path = require('path');

// Create a salon-themed SVG icon with scissors
const createSVGIcon = (size) => {
  const iconSize = size * 0.5; // scissors size relative to canvas
  const center = size / 2;

  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.22}"/>
  
  <!-- Scissors Icon -->
  <g transform="translate(${center}, ${center})">
    <!-- Left handle circle -->
    <circle cx="${-iconSize * 0.25}" cy="${-iconSize * 0.3}" r="${iconSize * 0.12}" fill="none" stroke="white" stroke-width="${size * 0.04}"/>
    <!-- Right handle circle -->
    <circle cx="${iconSize * 0.25}" cy="${-iconSize * 0.3}" r="${iconSize * 0.12}" fill="none" stroke="white" stroke-width="${size * 0.04}"/>
    
    <!-- Left blade -->
    <path d="M ${-iconSize * 0.25} ${-iconSize * 0.3} L ${-iconSize * 0.15} ${iconSize * 0.35}" 
          stroke="white" stroke-width="${size * 0.05}" stroke-linecap="round" fill="none"/>
    <!-- Right blade -->
    <path d="M ${iconSize * 0.25} ${-iconSize * 0.3} L ${iconSize * 0.15} ${iconSize * 0.35}" 
          stroke="white" stroke-width="${size * 0.05}" stroke-linecap="round" fill="none"/>
    
    <!-- Center pivot -->
    <circle cx="0" cy="0" r="${iconSize * 0.08}" fill="white"/>
  </g>
</svg>`;
};

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
  const svg = createSVGIcon(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png.svg`), svg);
  console.log(`✅ Created icon-${size}x${size}.png.svg`);
});

// Create apple-touch-icon (180x180)
const appleSVG = createSVGIcon(180);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png.svg'), appleSVG);
console.log('✅ Created apple-touch-icon.png.svg');

console.log('\n✅ All salon-themed icons created with scissors symbol!');
console.log('Purple-pink gradient background with white scissors icon.');
