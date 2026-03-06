class ActivityDiscover
{
    constructor() {}

    fetchWebComponents(tagName) 
    {
        const BASE_URL = window.CONFIG.COMPONENTS_URL;
        const validTag = /^[a-z0-9\-]+$/i;
        if (!validTag.test(tagName))
        {
            throw new Error(`Invalid component name: ${tagName}`);
        }
        const url = `${BASE_URL}/${tagName}/index.js`;


        return import(url)
            .then(() => 
            {
                console.log(`Loaded <${tagName}/> component.`);
            })
            .catch(err => 
            {
                console.error(`Failed to load <${tagName}/> component:`, err);
                throw err; 
            });
    }
}

export { ActivityDiscover };
    
