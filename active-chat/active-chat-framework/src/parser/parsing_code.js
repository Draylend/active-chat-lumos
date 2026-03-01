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
    
/*
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
            const activityId = node.attributes["activity-id"];

            const activityElement = document.querySelector(`[activity-id="${activityId}"]`);

            if (activityElement)
            {
                const options = activityElement.querySelectorAll("[id]");

                options.forEach(option => option.classList.remove("selected"));

                const selectedOption = activityElement.querySelector(`#${userChoice}`);

                if (selectedOption)
                {
                    selectedOption.classList.add("selected");
                }
                console.log("Chat interaction modified");
            }
        }
    }
    return currActivity;
}*/
