import fs, { readdirSync } from "fs";

import {
	generateImages,
	generateOffchainJsonMD,
	getWeightedLayers,
	unfurlLayerPaths,
} from "./helpers";
import {
	generateAndWriteMDFile,
	generateEqualWeightedCombinations,
	generateRandomCombinations,
	generateWeightedCombinations,
	uploadAssetsPinata,
} from "./main";
import type { LayerPath, Weights } from "./types";

/* Define our image layers */
const layerPaths: LayerPath = {
	background: "./images/back/",
	skin: "./images/skin/",
	outfit: "./images/outfit/",
};

/* example metadata to use */
const exampleMd = {
	image: "https://famousfoxes.com/hd/6908.png",
	properties: {
		creators: [
			{
				address: "3pMvTLUA9NzZQd4gi725p89mvND1wRNQM3C8XEv1hTdA",
				share: 100,
			},
		],
		files: [
			{
				type: "image/png",
				url: "https://famousfoxes.com/hd/6908.png",
			},
		],
	},
	description: "this is a description example",
	external_url: "example.external uri",
};

// /**
//  * -------------------------------------------- example one
//  *
//  * generates combinations in equal proportions
//  */
// const unfurledLayers = unfurlLayerPaths(layerPaths);
// // ! debug: sliced first 10 items
// const combinations = generateEqualWeightedCombinations(unfurledLayers).slice(
// 	0,
// 	10
// );
// generateImages(combinations).then().catch(console.error);
// uploadAssetsPinata(
// 	combinations,
// 	exampleMd.properties,
// 	exampleMd.description,
// 	exampleMd.external_url,
// 	"image/png"
// );
// // generateAndWriteMDFile(
// // 	combinations,
// // 	exampleMd.image,
// // 	exampleMd.properties,
// // 	exampleMd.description,
// // 	exampleMd.external_url
// // );

// /**
//  *  -------------------------------------------- example two
//  *
//  * generates weighted combinations.
//  */
// // Load weights from weights.json, use `readWeightsObject` function instead
// const weights: Weights = JSON.parse(fs.readFileSync("./weights.json", "utf8"));

// let weightedLayers = getWeightedLayers(layerPaths, weights);
// // ! debug: sliced first 10 items
// const weightedCombinations = generateWeightedCombinations(weightedLayers).slice(
// 	0,
// 	10
// );
// generateImages(weightedCombinations).then().catch(console.error);
// generateAndWriteMDFile(
// 	weightedCombinations,
// 	exampleMd.image,
// 	exampleMd.properties,
// 	exampleMd.description,
// 	exampleMd.external_url
// );

// /**
//  * -------------------------------------------- example three
//  *
//  * generates random combinations.
//  */
// const unfurledLayers = unfurlLayerPaths(layerPaths);
// const randomCombinations = generateRandomCombinations(unfurledLayers, 10);
// generateImages(randomCombinations).then().catch(console.error);
// generateAndWriteMDFile(
// 	randomCombinations,
// 	exampleMd.image,
// 	exampleMd.properties,
// 	exampleMd.description,
// 	exampleMd.external_url
// );
