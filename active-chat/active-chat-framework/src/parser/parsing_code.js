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

class code_parsing
{
    parse(chat_message) 
    {
        let root = new ParsingTreeNode("root");
        let stack = [root];
        let regular_text = "";

        for (let i = 0; i < chat_message.length; i++) 
        {
            let currentNode = stack[stack.length - 1];

            if (chat_message[i] === "<") 
            {
                if (regular_text.length > 0) 
                {
                    currentNode.addChildNode(new ParsingTreeNode("text", regular_text));
                    regular_text = "";
                }

                let depth = 1;
                let index = i + 1;

                while (index < chat_message.length && depth > 0)
                {
                    if (chat_message[index] === "<") 
                    {
                        depth++;
                    }
                    else if (chat_message[index] === ">") 
                    {
                        depth--;
                    }
                    index++;
                }

                if (depth !== 0) 
                {
                    regular_text += "<";
                    continue;
                }

                let fullTag = chat_message.substring(i, index);
                let tagNode = new ParsingTreeNode("tag", fullTag);
                if (fullTag.startsWith("<chat-activity") || fullTag.startsWith("<chat-interaction")) 
                {
                    tagNode.attributes.known = true;
                }
                currentNode.addChildNode(tagNode);
                i = index - 1;
            } 
            else 
            {
                regular_text += chat_message[i];
            }
        }

        // flush any remaining regular text
        if (regular_text.length > 0) 
        {
            stack[stack.length - 1].addChildNode(
                new ParsingTreeNode("text", regular_text)
            );
        }

        return root;
    }
}
