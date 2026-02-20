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
/*
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
*/
//This is the other version of the initial code parsing code that I created that works similar to the tree structure mentioned during discussion on 02/17/26. 
parse(chat_message)
{
    let root = new ParsingTreeNode("root");
    let stack = [root];

    let regular_text = "";

    for (let i = 0; i < chat_message.length; i++)
    {
        let currentNode = stack.at(-1);

        if (chat_message[i] === '<')
        {
            if (regular_text.length > 0)
            {
                currentNode.addChildNode(
                    new ParsingTreeNode("text", regular_text)
                );
                regular_text = "";
            }

            let index = chat_message.indexOf(">", i);

            if (index === -1)
            {
                regular_text += "<";
                continue;
            }

            let parsed_content =
                chat_message.substring(i + 1, index).trim();

            // validate tag
            if (!/^\/?[a-zA-Z]/.test(parsed_content))
            {
                regular_text += "<";
                continue;
            }

            // closing tag
            if (parsed_content.startsWith("/"))
            {
                let tagName = parsed_content.slice(1);

                while (stack.length > 1 &&
                       stack.at(-1).value !== tagName)
                {
                    stack.pop();
                }

                if (stack.length > 1)
                    stack.pop();
            }
            else
            {
                let tagNode =
                    new ParsingTreeNode("tag", parsed_content);

                currentNode.addChildNode(tagNode);
                stack.push(tagNode);
            }

            i = index;
        }
        else
        {
            regular_text += chat_message[i];
        }
    }

    if (regular_text.length > 0)
    {
        stack.at(-1).addChildNode(
            new ParsingTreeNode("text", regular_text)
        );
    }

    return root;
}

