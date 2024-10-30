import fs, { readdirSync } from "fs";
import path from "path";
import sharp from "sharp";

import type {
	LayerPath,
	UnfurledLayers,
	WeightedImage,
	Weights,
} from "./types";

/**
 * Retrieve Images from specified directory.
 *
 * @param dir directory path to search images in.
 * @returns array of paths of files inside the directory.
 */
export function getImagePaths(dir: string): string[] {
	return fs
		.readdirSync(dir)
		.filter((file) => fs.statSync(path.join(dir, file)).isFile())
		.map((file) => path.join(dir, file));
}

/**
 * @param dir - directory to be created
 * todo(Jimii): to be used if images output dir doesn't exist and if json dir doesn't exists
 */
export const createDirIfNotExists = (dir: string): string[] => [""];

/**
 * Return layers and the full images paths of their children.
 *
 * @param layerPath layer path to generate full images paths from.
 *
 * @returns image layers and image paths inside said layers.
 *
 */
export function unfurlLayerPaths(layerPaths: LayerPath): UnfurledLayers {
	const unfurledLayers: UnfurledLayers = {};
	for (const [category, dirPath] of Object.entries(layerPaths)) {
		unfurledLayers[category] = getImagePaths(dirPath);
	}
	return unfurledLayers;
}

/**
 * Generate layers with the weights associated to them from the weights.json file.
 *
 * @param layerPath image layer path to and associated image weight.
 * @param Weights specifies the different weights for the images.
 *
 * @returns unfurled images with full paths and associated weights object.
 *
 * todo(Jimii): define a default weight.json path to read from
 */
export function getWeightedLayers(
	layerPaths: LayerPath,
	weights: Weights
): Record<string, WeightedImage[]> {
	const weightedLayers: Record<string, WeightedImage[]> = {};

	for (const [category, dirPath] of Object.entries(layerPaths)) {
		const images = getImagePaths(dirPath);
		weightedLayers[category] = images.map((imagePath) => ({
			path: imagePath,
			weight: weights[category]?.[path.basename(imagePath)] || 1,
		}));
	}

	return weightedLayers;
}

/**
 * Read `weights.json` config file.
 *
 * @param path  path to weights.json config file.
 * @returns Weight object.
 */
export function readWeightsObject(path: string): Weights {
	return JSON.parse(fs.readFileSync("./weights.json", "utf8"));
}

/**
 * Composite the different image layers together.
 *
 * @param combinations composited image paths.
 * @param outputDir output directory for composited images. defaults to `imagesOutput`.
 */
export async function generateImages(
	combinations: UnfurledLayers[],
	outputDir: string = "imagesOutput"
) {
	combinations.slice(0, 10).map(async (item, index) => {
		const layer = Object.values(item).map((layer) => ({
			input: layer.toString(),
		}));

		const rootLayer = Object.values(item)[0];

		await sharp(rootLayer.toString())
			.composite(layer)
			.toFile(path.join(outputDir, `${index}.png`));
	});
}

/**
 * Generate offchain metadata object.
 *
 * @param unfurledLayer - The object containing the composited image paths.
 * @param index - The index of the current image.
 * @param image - image uri string.
 * @param properties - An object representing external files and category of project.
 *                    (// todo(Jimii)).
 * @param description - A brief description of the project.
 * @param externalUrl - external image url for the project.
 * @param animationUrl - An optional URL for an animation related to the image.
 *                      This parameter is optional and can be omitted.
 */
export function generateOffchainJsonMD(
	unfurledLayer: UnfurledLayers,
	index: number,
	image: string,
	properties: any, // todo(Jimii)
	description: string = "",
	externalUrl: string = "",
	animationUrl?: string
) {
	const attributes = Object.entries(unfurledLayer).map((attr) => {
		const trait_type = attr[0];
		const value: string[] = [...attr[1]].join("").split("/");
		const attrValue = value[value.length - 1].split(".png")[0];

		return {
			trait_type,
			value: attrValue,
		};
	});

	return {
		name: `#${index}`,
		description,
		image,
		animation_url: animationUrl,
		external_url: externalUrl,
		attributes,
		properties,
	};
}

/**
 * Write generated offchain metadata object to a file.
 *
 * @param index asset no.
 * @param metadata metadata details to write to file.
 */
export function writeToMetadataFile(index: number, metadata: any) {
	fs.writeFileSync(
		path.join("json", `${index}.json`),
		JSON.stringify(metadata, null, 2)
	);
}
