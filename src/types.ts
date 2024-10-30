/**
 * Represents a single layer.
 */
export type LayerPath = { [layerName: string]: string };

/**
 * Represents different layers and and array of
 * the full paths of the images inside each layer directory.
 */
export type UnfurledLayers = { [key: string]: string[] };

/**
 * Represents a Weight object
 */
export type Weights = {
	[layer: string]: {
		[image: string]: number;
	};
};

/**
 * Weighted image object
 */
export type WeightedImage = {
	path: string;
	weight: number;
};
