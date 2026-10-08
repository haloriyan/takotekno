import axios from "axios";
import config from "../config";

const Gemini = async (prompt, temp = 0.8, capability = "text") => {
	let MODELS = [];

	let payload = {
		contents: [
			{
				parts: [{ text: prompt }]
			}
		],
		generationConfig: {
			temperature: temp,
			// Forces the model to return syntactically valid JSON natively
			responseMimeType: "application/json",
		}
	};

	if (typeof prompt === "object") {
		payload.contents = prompt;
	}

	// Set models based on capability
	if (capability === "text") {
		MODELS = [
			"gemma-4-31b-it",
			"gemma-4-26b-a4b-it"
		];
	}

	if (capability === "image") {
		MODELS = ["imagen-4"];

		payload.generationConfig = {
			responseModalities: ["IMAGE", "TEXT"]
		};
	}

	const KEYS = config.gkeys;

	// Tracks keys that have failed during THIS Gemini() call only.
	// A new Gemini() call gets a completely new Set.
	const failedKeys = new Set();

	const tryRequest = async () => {
		// Only use keys that haven't failed yet
		const availableKeys = KEYS.filter(
			key => !failedKeys.has(key)
		);

		// All keys have failed
		if (availableKeys.length === 0) {
			throw new Error("All API keys and models failed.");
		}

		// Pick a random key from the remaining keys
		const apiKey = availableKeys[
			Math.floor(Math.random() * availableKeys.length)
		];

		for (let modelIndex = 0; modelIndex < MODELS.length; modelIndex++) {
			const model = MODELS[modelIndex];

			try {
				const response = await axios.post(
					`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
					payload,
					{
						headers: {
							"Content-Type": "application/json",
							"x-goog-api-key": apiKey,
						}
					}
				);

				const parts = response?.data?.candidates?.[0]?.content?.parts;

				if (!parts || parts.length === 0) {
					console.error(
						`[GEMINI.js] Missing content parts for model=${model}`,
						response?.data
					);

					continue;
				}

				// If handling image generation, return the raw response
				if (capability === "image") {
					return response?.data;
				}

				// Gemma isolation:
				// Extract the part that is NOT the model's internal thoughts
				const finalPart = parts.find(p => !p.thought);
				const rawText = finalPart
					? finalPart.text
					: parts[0].text;

				if (!rawText) {
					console.error(
						"[GEMINI.js] Extracted text segment is empty"
					);

					continue;
				}

				let realResponse;

				try {
					// Clean JSON from possible markdown wrappers
					const cleanedText = rawText
						.replace(/```(json)?/gi, "")
						.replace(/```/g, "")
						.replace(/^[^{\[]*/, "")
						.replace(/[^}\]]*$/, "")
						.trim();

					realResponse = JSON.parse(cleanedText);
				} catch (parseErr) {
					// JSON parsing failed.
					// Try another model/key.
					continue;
				}

				// Success
				return realResponse;

			} catch (err) {
				const status = err?.response?.status;

				// console.error(
				// 	`[GEMINI.js] Request failed: model=${model}, status=${status}`
				// );

				continue;
			}
		}

		// Every model failed for this key.
		// Mark the key as failed so it cannot be selected again
		// during this Gemini() invocation.
		failedKeys.add(apiKey);

		console.warn(
			`[GEMINI.js] Key failed. ${failedKeys.size}/${KEYS.length} keys exhausted.`
		);

		// Try another random key recursively.
		return tryRequest();
	};

	return tryRequest();
};

export default Gemini;