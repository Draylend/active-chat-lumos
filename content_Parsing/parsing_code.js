
class code_parsing extends ActiveChat 
{
    /*steps: 
        1) go through each and every line in active chat and find out which parts start in '<' and end in '>'
        2) based on the parts that it starts and ends in, separate them and mark them as part of a separate variable
        3) no need to render yet in the chatbox, but make sure that they are separate 


        pseudocode: 
        1. parse markdown into some intermediate format
        2. create a function to determine which texts are parsed 
            for every node:
                if the node contains the tags
                {
                    extract the node and add it to an empty set for parsed blocks
                }
                else
                {
                    keep them within the text-block set
                }
        3. create a code for finding out the things that are in between

    */
    parse(chat_message)
    {
        let regular_text = " ";
        let parsed_content = " ";
        let inside_text = false;
        for (let c of chat_message)
        {
            if (c == '<')
            {
                inside_text == true;
            }
            if (c == '>')
            {
                inside_text = false;
            }
            if (inside_text)
            {
                parsed_content+=c;
            }
            else
            {
                regular_text += c;
            }
        }
    }
    
}


