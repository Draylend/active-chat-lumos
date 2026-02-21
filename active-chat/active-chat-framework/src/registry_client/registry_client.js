class ActivityDiscover
{
    constructor() {}

    fetch(node)
    {
        if (node.type !== "tag")
        {
            return false;
        }
        const tag = node.value;
        if (tag === "chat-activity"||tag === "chat-interaction")
        {
            return false;
        }
        return true;
    }

    discover_activities(node) 
    {
        if (this.fetch(node)) 
        {
            const tagName = node.value;

            this.fetchWebComponents(tagName)
                .then(() => 
                {
                })
                .catch(err => 
                {
                    console.error(`Error while loading <${tagName}>:`, err);
                });
        }
        for (let i = 0; i < node.children.length; i++) 
        {
            this.discover_activities(node.children[i]);
        }    
    }

    fetchWebComponents(tagName) 
    {
        const BASE_URL = window.CONFIG.COMPONENTS_URL;
        const validTag = /^[a-z0-9\-]+$/i;
        if (!validTag.test(tagName))
        {
            throw new Error(`Invalid component name: ${tagName}`);
        }
        const url = `${BASE_URL}/${tagName}.js`;


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
    
