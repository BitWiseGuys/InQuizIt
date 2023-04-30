/**
 * Author: Andrew Kerr
 * Date: 3/06/2023
 * Description: Defines a HTML/Vue tag, v-metatag, that parses an encoded string, formats it and displays the formatted string.
 */

window.diagrams = window.diagrams ? window.diagrams : {};

/**
 * Parses the given string into an array of string's/objects' (the strings are raw text and objects are made up of tags, an optional identifier and an optional attribute).
 * @param {String} text
 * @returns 
 */
function Parse(text) {
    var result = [];
    var string = "";
    var mode = 0;
    var object = undefined;
    for(var i in text) {
        var c = text[i];
        // Check to see if we are in raw text mode.
        if(mode == 0) {
            // Check if we can transition into a tag.
            if(c == '{') {
                // Transition (and setup) for our next mode.
                mode = 1;
                object = {};
                // Store our leading string (if we have one).
                if(string.length) {
                    result.push(string);
                    string = "";
                }
            }
            // Check if we can transition into a selection
            else if(c == '[') {
                // Transition (and setup) for our next mode.
                mode = 5;
                // Store our leading string (if we have one).
                if(string.length) {
                    result.push(string);
                    string = "";
                }
            }
            // Otherwise we simply add to our raw text string.
            else string += c;
        }
        // Check to see if we are in tag mode.
        else if(mode == 1) {
            // Check if we can transition into an identifier.
            if(c == ':') {
                // Check to make sure we had a tag before transitioning.
                if(string.length == 0) {
                    console.error("Transitioning from tag to identifier without providing a tag name.");
                    return [undefined, i];
                }
                // Transition into our identifier mode (if applicable).
                if(string.indexOf("gen-") == 0) {
                    mode = 2;
                    object['tag'] = string;
                }
                else if(string.indexOf("image") == 0) {
                    mode = 6;
                    object['type'] = "image";
                }
                else if(string.indexOf("diagram") == 0) {
                    mode = 6;
                    object['type'] = "diagram";
                }
                string = "";
            }
            // Check if we have completed our tag.
            else if(c == '}') {
                // Check to make sure we had a tag before transitioning.
                if(string.length == 0) {
                    console.error("Transitioning from tag to identifier without providing a tag name.");
                    return [undefined, i];
                }
                // Switch back to the raw text mode and store our object.
                mode = 0;
                object['tag'] = string;
                result.push({ type: "generator", content: object });
                string = "";
            }
            // Otherwise we add our character to our 'attribute' string.
            else string += c;
        }
        // Check to see if we are in identifier mode.
        else if(mode == 2) {
            // Check to see if we can transition into attribute mode.
            if(c == '(') {
                // Check to make sure we had an identifer before transitioning.
                if(string.length == 0) {
                    console.error("Transitioning from identifer to attribute without providing an identifier name.");
                    return [undefined, i];
                }

                // Transition into our identifier mode.
                mode = 3;
                object['identifier'] = string;
                string = "";
            }
            // Check to see if we are transitioning into raw text mode.
            else if(c == '}') {
                // Check to make sure we had an identifer before transitioning.
                if(string.length == 0) {
                    console.error("Transitioning from identifer to attribute without providing an identifier name.");
                    return [undefined, i];
                }

                // Transition into our raw text mode.
                mode = 0;
                object['identifier'] = string;
                string = "";
                result.push({ type: "generator", content: object });
            }
            // Otherwise append character to attribute string.
            else string += c;
        }
        // Check to see if we are in attribute mode.
        else if(mode == 3) {
            // Check to see if we can transition into ending-tag mode.
            if(c == ')') {
                // Check to make sure we had an attribute before transitioning.
                if(string.length == 0) {
                    console.error("Transitioning from attribute to ending-tag without providing an attribute name.");
                    return [undefined, i];
                }

                // Transition into our ending-tag mode.
                mode = 4;
                object['attribute'] = string;
                string = "";
            }
            // Otherwise append character to attribute string.
            else string += c;
        }
        else if(mode == 4) {
            // Check to see if we have found our ending tag.
            if(c == '}') {
                // Transition into our raw text mode.
                mode = 0;
                // Store any trailing info so that we can use it for further parsing if necessary.
                if(string.length) object['trailing'] = string;
                string = "";
                result.push({ type: "generator", content: object });
            }
            else string += c;
        }
        else if(mode == 5) {
            // Check to see if we have found our ending tag.
            if(c == ']') {
                // Transition into our raw text mode.
                mode = 0;
                // Store our string as an array.
                if(string.length) result.push({ type: "selectable", content: string});
                string = "";
            }
            else string += c;
        }
        else if(mode == 6) {
            // Check to see if we have found our ending tag.
            if(c == '}') {
                // Transition into our raw text mode.
                mode = 0;
                // Store our string as an array.
                if(string.length) result.push({ type: object['type'], data: string});
                string = "";
            }
            else string += c;
        }
    }
    // Check to see if we ended up failing to close a tag.
    if(mode != 0)
        console.warn("Might be missing an ending '}' to close off a metatag.");
    else if(string.length != 0)
        result.push(string);
    return [result, undefined];
}

// Formats the given text (using context data supplied by the given context) into a
//   formatted string. The basic structure is {tag:id(attr)} where: tag is any kind of
//   tag; id is an optional identifier (for multiple elements of this tag); and attr
//   is an optional attribute of the tag represented by the identifier.
function FormatText(text, ctx, root, onClick) {
    root.innerHTML = "";
    // We can only format the text if we have a way of creating/modifying/using persistant data.
    if(typeof(ctx) != 'object') return text;
    // Parse the text and give us some data to work with.
    var [parts, error] = Parse(text);
    // Did we fail to parse our text?
    if(error != undefined) {
        console.error(`Failed to parse '${text}' into a valid metatag structure, error at index: ${error}.`);
        return undefined;
    }
    // Finally we need to resolve our parts into elements.
    var element = undefined;
    for(var i in parts) {
        var part = parts[i];
        if(typeof(part) == 'object') {
            // Are we working with selectable text?
            if(part.type == "selectable") {
                part = part.content;
                // Ensure we have an element to work with.
                element = root.appendChild(document.createElement("button"));
                element.addEventListener("click",onClick);
                FormatText(part,ctx,element);
                element = undefined;
            }
            else if(part.type == "image") {
                // Ensure we have an element to work with.
                element = root.appendChild(document.createElement("img"));
                element.src = part.data;
                element = undefined;
            }
            else if(part.type == "diagram") {
                // Ensure we have an element to work with.
                element = root.appendChild(document.createElement("canvas"));
                element.routine = window.diagrams[part.data];
                if(element.routine) element.routine(element, { action: "init" });
                element = undefined;
            }
            // Are we working with a generator?
            else if(part.type == "generator") {
                part = part.content;
                // Ensure we have an element to work with.
                if(!element) element = root.appendChild(document.createElement("span"));
                // Ensure we have a cache to work with.
                if(!ctx.cached) ctx.cached = {};
                if(!ctx.images) ctx.images = {};
                // Check to see if we have an identifier.
                if(part['identifier'] != undefined) {
                    // Check if we already have this info cached.
                    if(ctx.cached[part['tag']] && ctx.cached[part['tag']][part['identifier']]) {
                        if(part['attribute']) {
                            element.innerHTML += ctx.cached[part['tag']][part['identifier']][part['attribute']];
                        }
                        else {
                            var obj = ctx.cached[part['tag']][part['identifier']];
                            if(typeof(obj) == "object") {
                                if(typeof(obj.stringify) == 'function')
                                    element.innerHTML += obj.stringify();
                                else {
                                    console.warn("Metatag is showing cached object to the end-user, should either have attribute or stringify function.", part, obj);
                                    element.innerHTML += "<"+part['tag']+":"+part['identifier']+">";
                                }
                            }
                            else element.innerHTML += obj;
                        }
                    }
                    // Otherwise we will have to generate it.
                    else {
                        // Ensure we have a cache for this data.
                        if(!ctx.cached[part['tag']]) ctx.cached[part['tag']] = {};
                        // Do we have generators?
                        if(window.generators) {
                            // Check for a generator and generate the content.
                            window.generators.forEach((generator) => {
                                if(generator.name == part['tag']) {
                                    // Generate our content.
                                    var content = generator.generate(ctx.cached[part['tag']], generator.param);
                                    ctx.cached[part['tag']][part['identifier']] = content;
                                    // Append to the end of our result.
                                    if(part['attribute']) {
                                        element.innerHTML += content[part['attribute']];
                                    }
                                    else {
                                        let obj = content;
                                        if(typeof(obj) == "object") {
                                            if(typeof(obj.stringify) == 'function')
                                                element.innerHTML += obj.stringify();
                                            else {
                                                console.warn("Metatag is showing recent cached object to the end-user, should either have attribute or stringify function.", part, obj);
                                                element.innerHTML += "<"+part['tag']+":"+part['identifier']+">";
                                            }
                                        }
                                        else element.innerHTML += obj;
                                    }
                                }
                            });
                        }
                        // Did we fail to generate the content.
                        if(!ctx.cached[part['tag']][part['identifier']]) {
                            console.warn("Metatag is showing unresolved part to end-user, missing a generator for our content.", part);
                            element.innerHTML += "&lt;"+part['tag']+":"+part['identifier']+"&gt;";
                        }
                    }
                }
            }
        }
        else {
            if(!element) element = root.appendChild(document.createElement("span"));
            element.innerHTML += part;
        }
    }
}

// When called will create a content generator (a content generator is
//  responsible for generating content for a question, an example would
//  be our built in person generator which generates a random person
//  to be used within the question). A content generator needs a name,
//  a function that will generate the content (first argument is an
//  array of the content already generated by this generator, second
//  argument is the optional param passed into the create content
//  generator), also an optional param that is passed to the generate
//  function.
function CreateContentGenerator(strName, fnGenerate, optionalParam) {
    var obj = {};
    obj.name = strName;
    obj.generate = fnGenerate;
    obj.param = optionalParam;
    return obj;
}
window.CreateContentGenerator = CreateContentGenerator;

Vue.component("vMetatag", {
    props: ["text", "context"],
    template:`
    <span ref="content"></span>
    `,
    watch: {
        text(newValue) {
            // Reset our context.
            for(var i in this.context)
                delete this.context[i];
            FormatText(newValue, this.context, this.$refs.content, this.clicked);
        }
    },
    methods: {
        refresh() {
            // Reset our context.
            for(var i in this.context)
                delete this.context[i];
            FormatText(this.text, this.context, this.$refs.content, this.clicked);
        },
        clicked(e) {
            this.$emit("answered", e.srcElement.innerHTML, e.srcElement);
        }
    }
})