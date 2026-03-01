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
    const parser = new DOMParser();
    const parseInfo = parser.parseFromString(chat_message, "text/html");
    const root = new ParsingTreeNode("root");
    parse(parseInfo.body, root);
    return root;
}
