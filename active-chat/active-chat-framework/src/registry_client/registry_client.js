import { code_parsing } from "./.parsing_code.js";

class activity_discover extends code_parsing 
{
    constructor() 
    {
        super();
    }

    discover_activities(node) 
    {
        if (node.type === "tag" && !node.attributes.known) 
        {
            const tagName = node.value.replace(/<|\/?>/g, "").trim().split(/\s+/)[0];
            node.attributes.known = true;

            this.fetchWebComponents(tagName)
                .then(() => 
                {
                    for (let i = 0; i < node.children.length; i++) 
                    {
                        this.discover_activities(node.children[i]);
                    }
                })
                .catch(err => 
                {
                    console.error(`Error while loading <${tagName}>:`, err);
                    for (let i = 0; i < node.children.length; i++) 
                    {
                        this.discover_activities(node.children[i]);
                    }
                });
        } 
        else
        {
            for (let i = 0; i < node.children.length; i++) 
            {
                this.discover_activities(node.children[i]);
            }
        }
    }

    fetchWebComponents(tagName) 
    {
        const url = `http://localhost:8090/components/${tagName}.js`;
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

export { activity_discover };
