import {
	generateOffchainJsonMD,
	getImagePaths,
	uploadImagePinata,
	uploadJsonPinata,
	writeToMetadataFile,
} from "./helpers";
import type { LayerPath, UnfurledLayers, WeightedImage } from "./types";

/**
 * Generates combinations in equal proportions
 *
 * @param unfurledLayers - the different layers and the full images paths of images inside them.
 *
 * @returns layer combinations.
 *
 */
export function generateEqualWeightedCombinations(
	unfurledLayers: UnfurledLayers
): UnfurledLayers[] {
	const layerNames: string[] = Object.keys(unfurledLayers);
	const combinations: UnfurledLayers[] = [];
	const stack: { current: LayerPath; index: number }[] = [
		{ current: {}, index: 0 },
	];

	while (stack.length > 0) {
		const { current, index } = stack.pop()!;

		// Base case: all layers processed
		if (index === layerNames.length) {
			combinations.push(current as unknown as UnfurledLayers);
			continue;
		}

		const layer: string = layerNames[index];

		// Process each image in the current layer
		for (const image of unfurledLayers[layer]) {
			const newCurrent = { ...current, [layer]: image };
			stack.push({ current: newCurrent, index: index + 1 });
		}
	}

	return combinations;
}

/**
 * Generates weighted combinations.
 *
 * @param weightedUnfurledLayers - weighted unfurled layers.
 * @param targetCount - combinations count to generate.
 *
 * @returns weighted combinations.
 *
 */
export function generateWeightedCombinations(
	weightedUnfurledLayers: Record<string, WeightedImage[]>,
	targetCount?: number
): UnfurledLayers[] {
	const layerNames: string[] = Object.keys(weightedUnfurledLayers);
	const combinations: UnfurledLayers[] = [];
	const stack: { current: any; index: number }[] = [
		{ current: {}, index: 0 },
	];

	if (targetCount) {
		// Generate specific number of combinations
		for (let i = 0; i < targetCount; i++) {
			const current: any = {};
			for (const layer of layerNames) {
				const weightedImages = weightedUnfurledLayers[layer];
				const totalWeight = weightedImages.reduce(
					(sum, img) => sum + img.weight,
					0
				);
				const randomWeight = Math.random() * totalWeight;
				let accumulatedWeight = 0;
				for (const img of weightedImages) {
					accumulatedWeight += img.weight;
					if (accumulatedWeight >= randomWeight) {
						current[layer] = img.path;
						break;
					}
				}
			}
			combinations.push(current);
		}
	} else {
		// Generate all possible combinations
		while (stack.length > 0) {
			const { current, index } = stack.pop()!;

			if (index === layerNames.length) {
				combinations.push(current);
				continue;
			}

			const layer: string = layerNames[index];
			const weightedImages = weightedUnfurledLayers[layer];

			for (const img of weightedImages) {
				const newCurrent = { ...current, [layer]: img.path };
				stack.push({ current: newCurrent, index: index + 1 });
			}
		}
	}

	return combinations;
}

/**
 * Generates randomized combinations.
 *
 * @param unfurledLayers -  unfurled layers.
 * @param count - combinations count to generate.
 *
 * @returns weighted combinations.
 *
 */
export function generateRandomCombinations(
	unfurledLayers: UnfurledLayers,
	count: number
): UnfurledLayers[] {
	const layerNames: string[] = Object.keys(unfurledLayers);
	const combinations: UnfurledLayers[] = [];

	for (let i = 0; i < count; i++) {
		const current: any = {};
		for (const layer of layerNames) {
			const images = unfurledLayers[layer];
			current[layer] = images[Math.floor(Math.random() * images.length)];
		}
		combinations.push(current);
	}

	return combinations;
}

/**
 *
 * Generates off-chain metadata object and write to json dir
 * for each combination generated.
 *
 * @param combinations -  combination to use to generate the md.
 * @param image - image uri string.
 * @param properties - An object representing external files and category of project.
 *                    (// todo(Jimii)).
 * @param description - A brief description of the project.
 * @param externalUrl - external image url for the project.
 * @param animationUrl - An optional URL for an animation related to the image.
 *                      This parameter is optional and can be omitted.
 *
 */
export function generateAndWriteMDFile(
	combinations: UnfurledLayers[],
	image: string,
	properties: any,
	description: string,
	externalUrl: string,
	animationUrl?: string
) {
	combinations.map((item, index) => {
		const md = generateOffchainJsonMD(
			item,
			index,
			image,
			properties,
			description,
			externalUrl,
			animationUrl
		);

		writeToMetadataFile(index, md);
	});
}

/**
 *
 * upload the image and generated json metadata to Pinata
 *
 * assumes that the images have already been generated,
 * and named in the `imagesOutput`
 *
 *
 * @param combinations -  combination to use to generate the md.
 * @param properties - An object representing external files and category of project.
 *                    (// todo(Jimii)).
 * @param description - A brief description of the project.
 * @param externalUrl - external image url for the project.
 * @param mimeType - file type.
 * @param animationUrl - An optional URL for an animation related to the image.
 * @param outputDir - Optional, if the generated images are output in a different directory.
 *
 */
export async function uploadAssetsPinata(
	combinations: UnfurledLayers[],
	properties: any,
	description: string,
	externalUrl: string,
	mimeType: string,
	animationUrl?: string,
	outputDir: string = "imagesOutput"
) {
	console.log("uploading assets.....");
	const uploadAll = combinations.map(async (item, index) => {
		const imagePath = `./${outputDir}/${index}.${
			mimeType.split("/").pop() as string
		}`;

		try {
			await new Promise((r) => setTimeout(r, 2000));
			const image = await uploadImagePinata(imagePath, mimeType);
			await new Promise((r) => setTimeout(r, 2000));

			// generate json
			const metadata = generateOffchainJsonMD(
				item,
				index,
				image,
				properties,
				description,
				externalUrl,
				animationUrl
			);

			// upload json
			let jsonUri = await uploadJsonPinata(metadata, `${index}.json`);
			console.log(index, "->", jsonUri);
		} catch (err) {
			console.error(`Error uploading -> ${index}:`, err);
			throw err;
		}
	});

	// Wait for all uploads to complete
	try {
		await Promise.all(uploadAll);
	} catch (error) {
		console.error("Error uploading assets:", error);
		throw error;
	}
}
