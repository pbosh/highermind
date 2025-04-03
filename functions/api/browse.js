export async function onRequest(context) {
    try {
        // Read the config-browse.json file
        const response = await fetch('https://93b333f8.hm-website-2cx.pages.dev/config-browse.json');
        const config = await response.json();
        
        let models = config.models;
        
        // Randomize the models array if randomizeLayout is true
        if (config.randomizeLayout) {
            models = [...models].sort(() => Math.random() - 0.5);
        }
        
        return new Response(JSON.stringify({
            models: models, // Send all models
            initialBatchSize: config.initialBatchSize,
            batchSize: config.batchSize,
            itemWidth: config.itemWidth,
            padding: config.padding,
            randomizeLayout: config.randomizeLayout
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to load browse data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
} 