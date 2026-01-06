# Lumina X1 - Premium 3D Interactive Product Experience

A stunning scroll-driven 3D interactive product showcase built with Three.js and GSAP. Experience the future of interactive sound with dynamic lighting, parallax depth, and smooth animations.

## Features

- **Scroll-Driven 3D Animation**: Interactive 3D product that responds to user scroll
- **Dynamic Lighting**: Multiple light sources creating stunning visual effects
- **Parallax Mouse Effects**: Subtle camera movements following mouse position
- **Smooth Animations**: GSAP ScrollTrigger for buttery-smooth transitions
- **Premium Design**: Modern glassmorphism UI with gradient text effects
- **Responsive Layout**: Optimized for all screen sizes

## Technologies Used

- **Three.js (v0.182.0)**: 3D graphics rendering
- **GSAP (v3.14.2)**: Advanced animations
- **Vanilla JavaScript**: No framework dependencies
- **Modern CSS**: Glassmorphism, gradients, and custom scrollbar styling

## Project Structure

```
new-project/
├── index.html          # Main HTML file
├── style.css           # Styling and layout
├── main.js             # Three.js scene and animations
├── assets/             # 3D models and media assets
│   └── model.glb       # (Optional) 3D model file
├── README.md           # Project documentation
└── .gitignore          # Git ignore rules
```

## Getting Started

### Option 1: Simple HTTP Server (Recommended)

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Option 2: Direct Opening

Simply open `index.html` in a modern web browser. All dependencies are loaded via CDN.

## Customization

### Changing Product Geometry

Edit `main.js` around line 38-64 to modify the core sphere, rings, or add new geometries:

```javascript
const coreGeo = new THREE.SphereGeometry(0.8, 64, 64);
// Change to other geometries like BoxGeometry, TorusKnotGeometry, etc.
```

### Adjusting Colors & Materials

Modify material properties in `main.js`:

```javascript
const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111,        // Base color
    emissive: 0x220033,     // Glow color
    metalness: 0.8,         // Metallic effect
    roughness: 0.1          // Surface roughness
});
```

### Scroll Animation Timeline

Customize scroll-triggered animations in `main.js` starting at line 121:

```javascript
tl.to(productGroup.rotation, { x: 0.5, y: 1.5, z: 0.2, duration: 2 }, "s1")
  .to(productGroup.position, { x: -1.5, z: 1, duration: 2 }, "s1");
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Performance Tips

1. Reduce `particlesCount` if experiencing lag (line 67 in main.js)
2. Lower `renderer.setPixelRatio()` for better performance on high-DPI displays
3. Adjust shadow quality in renderer settings

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

Created with ❤️ using Three.js and GSAP

---

**Ready to upgrade your reality?** 🚀
