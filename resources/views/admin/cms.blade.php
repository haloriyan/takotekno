@extends('layouts.admin')

@section('title', "Dashboard")
    
@section('content')
    hehe
@endsection

@section('javascript')
<script>
    let KEYS = @json(config('services.gemini.keys'));
</script>
<script src="/js/Gemini.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    let isGenerating = false;
    let pexelKey = "sJhSe2KadFB1v1WezLZS3AeFxFsdiuFIDPJbKgvWVgT182MGJWt5tFPt";
    let subjects = [];
    let categories = @json($categories);
    console.log(categories);

    let additionalPrompts = [];

    const setGenerating = (val) => {
        isGenerating = val;
    }
    const api = axios.create({timeout: 0});

    const runGenerator = async () => {
        if (isGenerating) return;
        setGenerating(true);

        console.log('running');
        

        subjects = [
            categories[rand(0, categories.length - 1)]['name'],
            categories[rand(0, categories.length - 1)]['name']
        ];
        

        try {
            
            const prepareResponse = await api.post(`/api/v2/preparation`, {
                subjects,
            });
            const prepareRes = prepareResponse.data;
            const previousContents = prepareRes.contents;
            console.log(previousContents);
            
            let contentLevel = "expert";
            let contentLanguage = "bahasa indonesia";
            
            let thePrompt = "YOU ARE " + contentLevel.toUpperCase() + " in " + subjects.join(',') + " subjects and want to create one instagram carousel posts for " + contentLevel.toUpperCase() + " audience. Write them in this EXACTLY JSON format\n" +
                '```[{"title": "ARTICLE_TITLE","cover": "KEYWORDS","short_description": "DESCRIBE_WHAT_THIS_ARTICLE_ABOUT", "slides": [{"title": "SLIDE_ITEM_TITLE", "body": "SLIDE_ITEM_BODY"}] }]```\n\n' +
                "IMPORTANT notes :\n" +
                "- Give me only the json, don't say anything\n"+
                "- The contents shall be related to UMKM (small entreprises) context\n"+
                "- Don't response me with anything but that exactly json i'm expecting\n"+
                "- Minimum slide count is 6, but you can do as much as it needed (it can be longer than 10 slides)\n" +
                "- MAKE SURE Use " + contentLanguage + " for the content language (title, body, and short_description's value), and english for cover keywords\n";

            if (additionalPrompts.length > 0) {
                additionalPrompts.map(prmpt => {
                    thePrompt += "- " + prmpt + "\n";
                });
            }

            thePrompt += "- Gimme 1 to 3 words (NOT KEYWORD) that i can use to find an image in pexels\n" +
            "- Limit short description UP TO 10 words. BUT you can use longer text on slide body than usual instagram post slide.\n"+
            "- Avoid 'meta writing' like 'slide one', 'part one', 'first section', etc.\n";

            if (previousContents.length > 0) {
                thePrompt += "- Make sure NOT IN SIMILAR CONTEXT with any of this previous contents ```" + JSON.stringify(previousContents) + "```";
            }


            console.log(thePrompt);
            
            let contents = await Gemini(thePrompt);

            console.log("Content generated\n", JSON.stringify(contents));
            
            let c = 0;
            for (const cont of contents) {
                // getting image
                console.log('start getting image of ', c);
                
                const keyword = cont.cover.split(",")[0];
                const response = await api.get(
                    `https://api.pexels.com/v1/search?query=${keyword}&per_page=1`,
                    { headers: { Authorization: pexelKey } }
                );

                console.log(response.headers.get('X-Ratelimit-Remaining'));
                
                
                const photo = response.data.photos?.[0];
                if (!photo) return;

                const imageData = {
                    coverImage: photo.src.large,
                    photographer: photo.photographer,
                    photographer_url: photo.photographer_url,
                };

                cont['cover'] = photo.src.large;
                cont['photographer'] = photo.photographer;
                cont['photographer_url'] = photo.photographer_url;

                await storeContent(cont);

                c++;
                
            }
            
            
            
        } catch (err) {
            console.log(err);
        } finally {
            setGenerating(false);
        }
    }

    const storeContent = async (konten) => {
        console.log('prepare storing content', konten);
        
        const response = await api.post(`/api/v2/store`, {
            konten, subjects,
        });

        console.log('content stored');
        
        const res = response.data;
    }

    // (async () => {
    //     let res = await Gemini("who is mia khalifa?");
    //     console.log(res);
        
    // })();

    let int = setInterval(() => {
        if (isGenerating) {
            return;
        }

        runGenerator();
    }, 1000);
</script>
@endsection