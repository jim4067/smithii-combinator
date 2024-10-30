# smithii-combinator

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run main.ts
```

This project was created using `bun init` in bun v1.1.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

We use the [sharp.js](https://sharp.pixelplumbing.com/api-composite) to composite the different image layers together.

## usage

1. Create an `images` directory with all your image layers defined in those directories e.g

```bash
images
├── back          # Background layer (REQUIRED)
│   ├── Aqua.png
│   ├── Champagne.png
│   └── ...       # Additional background colors
├── eyes          # eyes
│   ├── Angry.png
│   ├── Aviator Black.png
│   └── ...       # More eye options
├── head          # Head accessories and styles
│   ├── Afro.png
│   ├── Beanie.png
│   └── ...       # More head styles
├── mouth         # Mouth expressions and accessories
│   ├── Alien.png
│   ├── Beard Black.png
│   └── ...       # More mouth styles
└── outfit        # Outfits and costumes
    ├── Akhtar.png
    ├── Angel.png
    └── ...       # Additional layers
```

2. Create an `imagesOutput` directory where the generated images will be output to.

3. Define the images layer paths directory, starting with the background layer,

```typescript
const layerPaths: LayerPath = {
	background: "./images/back/",
	skin: "./images/skin/",
	outfit: "./images/outfit/",
	// .. additional layers
};
```

> [!NOTE]  
> Your paths might be different depending on where you created and placed your `images` directory.

4. Check out the examples in the [examples](./src/example.ts) file for the three available ways to generate the images.

-   The first example generates equal proportion of with the layers provided.
-   The second example generates weighted images based on the values defined in the [`weights.json`](./weights.json) file.
-   The third example generates random images with a specified count.
