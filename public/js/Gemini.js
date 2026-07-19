const Gemini = async (prompt, temp = 1.8, capability = 'text') => {
    let MODELS = [];
    let payload = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ],
        generationConfig: {
            temperature: temp,
        }
    };
    if (typeof prompt === "object") {
        payload['contents'] = prompt
    }

    if (capability === "text") {
        // MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];
        MODELS = [
            'gemma-4-31b-it',
            // 'gemma-3-27b-it',
        ];
    } 
    if (capability === "image") {
        MODELS = ['gemini-2.5-flash-image', 'gemini-2.0-flash-preview-image-generation'];
        payload['generationConfig'] = {
            responseModalities: ['IMAGE', 'TEXT']
        };
    }

    for (let keyIndex = 0; keyIndex < KEYS.length; keyIndex++) {
        const apiKey = KEYS[keyIndex];

        for (let modelIndex = 0; modelIndex < MODELS.length; modelIndex++) {
            const model = MODELS[modelIndex];
            
            try {
                console.log('fetching', apiKey);
                
                let response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                    {
                        method: "POST",
                        body: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json",
                            "x-goog-api-key": apiKey,
                        }
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(
                        `[GEMINI.js] HTTP ${response.status} ${response.statusText}`,
                        errorText
                    );
                    continue; // try next model
                }

                const responseJson = await response.json();
                let parts = responseJson?.candidates?.[0]?.content.parts;
                let rawText = parts[parts.length - 1].text;
                // let rawText = responseJson?.candidates?.[0]?.content?.parts?.[0]?.text;
                console.log(responseJson);
                

                if (!rawText) {
                    console.error("[GEMINI.js] Missing response text", responseJson);
                    continue; // try next model
                }

                let realResponse;
                try {
                    realResponse = JSON.parse(
                        rawText
                            .replace(/```(json)?/gi, "")
                            .replace(/```/g, "")
                            .replace(/^[^{\[]*/, "")
                            .replace(/[^}\]]*$/, "")
                            .trim()
                    );
                } catch (parseErr) {
                    console.error("[GEMINI.js] JSON Parse Error:", parseErr);
                    console.error("Raw returned text:", rawText);
                    continue; // try next model
                }

                return realResponse; // if successful
            } catch (err) {
                console.error(
                    `[GEMINI.js] Request failed: model=${model}, keyIndex=${keyIndex}`,
                    err
                );

                continue; // try next model
            }
        }

        console.warn(`[GEMINI.js] All models failed with keyIndex=${keyIndex}. Trying next key...`);
    }

    throw new Error("All API keys and models failed.");
};
