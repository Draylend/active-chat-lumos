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

    accept(visitor, currActivity = null)
    {
        currActivity = visitor(this, currActivity);
        for (let i = 0; i < this.children.length; i++)
        {
            this.children[i].accept(visitor, currActivity);
        }
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

//Milestone 3.1 (implement an accept method for visitor pattern)
function visitor(node, currActivity = null)
{
    //function that allows chat interaction tags to
    //modify the visual state of an existing activity
    if (node.type == "text")
    {
        console.log(node.value);
    }
    if (node.type == "tag")
    {
        if (node.value == "chat-activity")
        {
            currActivity = node;
            console.log("Chat Activity");
        }
        if (node.value === "mcq")
        {
            console.log("MCQ component")
        }
        if (node.value == "chat-interaction")
        {
            const userChoice = node.attributes.userChoice;
            if (currActivity && userChoice)
            {
                currActivity.attributes.selected = userChoice;
            }
            console.log("Chat interaction modified");
        }
    }
    return currActivity;
}
