class ParsingTreeNode
{
    constructor(type, value = null, attributes = {})
    {
        this.type = type;
        this.value = value;
        this.attributes = attributes;
        this.children = [];
        this.parent = null;
    }


    addChildNode(childNode)
    {
        childNode.parent = this;
        this.children.push(childNode);
    }
}

//Option 1: Recursion Code with DOM Parser
function parse(chat_message, parent = null)
{
    if (typeof chat_message == "string")
    {
        const parser = new DOMParser();
        const parseInfo = parser.parseFromString(chat_message, "text/html");
        const root = new ParsingTreeNode("root");
        parse(parseInfo.body, root);
        return root;
    }
    if (!parent)
    {
        parent = new ParsingTreeNode("root");
    }
    const childNodes = chat_message.childNodes;
    for (let i = 0; i < childNodes.length; i++)
    {
        if (childNodes[i].nodeType == Node.TEXT_NODE)
        {
            const regular_text = childNodes[i].textContent;

            if (regular_text && regular_text.trim().length > 0)
            {
                parent.addChildNode(new ParsingTreeNode("text", regular_text.trim()));
            }
        }
        else if (childNodes[i].nodeType == Node.ELEMENT_NODE)
        {
            const attributes = {};

            for (let j = 0; j < childNodes[i].attributes.length; j++)
            {
                const attr = childNodes[i].attributes[j];
                attributes[attr.name] = attr.value;
            }

            const tagNode = new ParsingTreeNode("tag", childNodes[i].tagName.toLowerCase(),
                attributes
            );

            parent.addChildNode(tagNode);

            parse(childNodes[i], tagNode);
        }
    }
    return parent;
}

//Option 2: Recursion Without DOM Parser
//maybe add section for attributes??
/*function parse(chat_message, node = null)
{
    if (!node)
    {
        node = new ParsingTreeNode("root");
        this.index = 0;
    }

    let regular_text = "";

    for (; this.index < chat_message.length; this.index++)
    {
        if (chat_message[this.index] === '<')
        {
            if (regular_text.length > 0)
            {
                node.addChildNode(new ParsingTreeNode("text", regular_text));
                regular_text = "";
            }

            let index = chat_message.indexOf(">", this.index);

            if (index === -1)
            {
                regular_text += "<";
                continue;
            }

            let parsed_content =
                chat_message.substring(this.index + 1, index).trim();

            // validate tag
            if (!/^\/?[a-zA-Z]/.test(parsed_content))
            {
                regular_text += "<";
                continue;
            }

            // closing tag
            if (parsed_content.startsWith("/"))
            {
                if (regular_text.length > 0)
                {
                    node.addChildNode(new ParsingTreeNode("text", regular_text));
                    regular_text = "";
                }
                this.index = index;
                return;     
            }
            else
            {
                let tagNode = new ParsingTreeNode("tag", parsed_content);
                node.addChildNode(tagNode);
                this.index = index + 1;
                this.parse(chat_message, tagNode);
                this.index = index;

            }
        }
        else
        {
            regular_text += chat_message[this.index];
        }
    }

    if (regular_text.length > 0)
    {
        node.addChildNode(new ParsingTreeNode("text", regular_text));
    }

    return node;
}*/


