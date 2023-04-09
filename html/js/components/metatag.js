/**
 * Author: Andrew Kerr
 * Date: 3/06/2023
 * Description: Defines a HTML/Vue tag, v-metatag, that parses an encoded string, formats it and displays the formatted string.
 */

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
                // Transition into our identifier mode.
                mode = 2;
                object['tag'] = string;
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
                result.push(object);
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
                result.push(object);
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
                result.push(object);
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
function FormatText(text, ctx) {
    // We can only format the text if we have a way of creating/modifying/using persistant data.
    if(typeof(ctx) != 'object') return text;
    // Parse the text and give us some data to work with.
    var [parts, error] = Parse(text);
    // Did we fail to parse our text?
    if(error != undefined) {
        console.error(`Failed to parse '${text}' into a valid metatag structure, error at index: ${error}.`);
        return undefined;
    }
    // Finally we need to resolve our parts back into a string.
    var result = "";
    for(var i in parts) {
        var part = parts[i];
        if(typeof(part) != 'string') {
            // Ensure we have a cache to work with.
            if(!ctx.cached) ctx.cached = {};
            // Check to see if we have an identifier.
            if(part['identifier'] != undefined) {
                // Check if we already have this info cached.
                if(ctx.cached[part['tag']] && ctx.cached[part['tag']][part['identifier']]) {
                    if(part['attribute']) {
                        result += ctx.cached[part['tag']][part['identifier']][part['attribute']];
                    }
                    else {
                        var obj = ctx.cached[part['tag']][part['identifier']];
                        if(typeof(obj.stringify) == 'function')
                            result += obj.stringify();
                        else {
                            console.warn("Metatag is showing cached object to the end-user, should either have attribute or stringify function.", part, obj);
                            result += "<"+part['tag']+":"+part['identifier']+">";
                        }
                    }
                }
                // Otherwise we will have to generate it.
                else {
                    // Ensure we have a cache for this data.
                    if(!ctx.cached[part['tag']]) ctx.cached[part['tag']] = {};
                    // Do we have generators?
                    if(ctx.generators) {
                        // Check for a generator and generate the content.
                        ctx.generators.forEach((generator) => {
                            if(generator.name == part['tag']) {
                                // Generate our content.
                                var content = generator.generate(ctx.cached[part['tag']], generator.param);
                                ctx.cached[part['tag']][part['identifier']] = content;
                                // Append to the end of our result.
                                if(part['attribute']) {
                                    result += content[part['attribute']];
                                }
                                else {
                                    let obj = content;
                                    if(typeof(obj.stringify) == 'function')
                                        result += obj.stringify();
                                    else {
                                        console.warn("Metatag is showing recent cached object to the end-user, should either have attribute or stringify function.", part, obj);
                                        result += "<"+part['tag']+":"+part['identifier']+">";
                                    }
                                }
                            }
                        });
                    }
                    // Did we fail to generate the content.
                    if(!ctx.cached[part['tag']][part['identifier']]) {
                        console.warn("Metatag is showing unresolved part to end-user, missing a generator for our content.", part);
                        result += "<"+part['tag']+":"+part['identifier']+">";
                    }
                }
            }
        }
        else result += part;
    }
    return result;
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
    <span>{{formatted}}</span>
    `,
    data() {
        return {
            formatted: FormatText(this.text, this.context),
        };
    },
    watch: {
        text(newValue) {
            this.formatted = FormatText(newValue, this.context);
        }
    }
})

// process(tag, id, attr) {
//     // Check if we need to look in the answer unit.
//     if(tag == "answer") {
//         // answers must be indexed by a number.
//         var index = Number(id);
//         if(id.length && index != NaN)
//             return (this.answer[index] ? this.answer[index] : "''");
//         return "''";
//     }
//     // Otherwise we look in our metadata section.
//     else {
//         if(tag == "person") {
//             var index = Number(id);
//             if(id.length && index != NaN) {
//                 if(this.metadata) {
//                     // Ensure we have an array of people.
//                     if(!this.metadata["people"]) this.metadata["people"] = [];
//                     // Check if we have the cached person, otherwise create one.
//                     if(!this.metadata["people"][id])
//                         this.metadata["people"][id] = CreatePerson();
//                     // Return the specific attribute that was requested or convert it to a string, or we simply return the entire structure (todo: not a good idea to return the whole structure).
//                     return (attr.length ? this.metadata["people"][id][attr] : (this.metadata["people"][id]["toString"] ? this.metadata["people"][id]["toString"]() : this.metadata["people"][id]));
//                 }
//             }
//         }
//         else {
//             // Do we have metatable values to work with?
//             if(this.question.metadata) {
//                 // Do we have an identifier that we can associate with this group?
//                 if(id.length) {
//                     // Ensure we have a space for this tag.
//                     if(!this.metadata[tag]) this.metadata[tag] = {};
//                     // Ensure we have a space for this id/tag.
//                     if(!this.metadata[tag][id])  {
//                         // Check if we can initialize it.
//                         // if(this.question.metadata[tag] && this.question.metadata[tag][id]) 
//                         this.metadata[tag][id] = this.question.metadata[tag][id];
//                         // // Otherwise try to fallback to a default value.
//                         // else if(this.question.metadata[tag]["default"]);
//                         //     this.metadata[tag][id] = this.question.metadata[tag]["default"];
//                         // Finally we can 'process' this if it has a special value.
//                         if(this.metadata[tag][id] != undefined) {
//                             var value = this.metadata[tag][id];
//                             if(value.startsWith("range")) {
//                                 value = value.substring(6, value.length - 1);
//                                 var vals = value.split("-");
//                                 if(vals.length >= 2) {
//                                     vals[0] = Number(vals[0]);
//                                     vals[1] = Number(vals[1]);
//                                     console.log(vals);
//                                     if(vals[0] && vals[1])
//                                         this.metadata[tag][id] = Math.floor(Math.random() * (vals[1]-vals[0])) + vals[0];
//                                 }
//                             }
//                         }
//                     }
//                     // Return the value if we have one otherwise fallback to debug response.
//                     if(this.metadata[tag][id])
//                         return this.metadata[tag][id];
//                 }
//                 // Otherwise simple computed value.
//                 else {
//                     // Ensure we have an array of computed values to work with.
//                     if(!this.metadata["computed"]) this.metadata["computed"] = [];
//                     // Check if our value is contained in here.
//                     if(!this.metadata["computed"][tag]) {
//                         // Pick one at random.
//                         if(this.question["metadata"][tag]) {
//                             // Pick randomly.
//                             var vals = this.question["metadata"][tag];
//                             this.metadata["computed"][tag] = vals[Math.floor(Math.random() * vals.length)];
//                         }
//                     }
//                     // Return the value if we have one otherwise fallback to debug response.
//                     if(this.metadata["computed"][tag])
//                         return this.metadata["computed"][tag];
//                 }
//             }
//         }
//         return "<"+tag+":"+id+"("+attr+")>";
//     }
// },
// parse(line) {
//     var string = "";
//     var mode = 0; // 0: Normal, 1: Special Tag, 2: Identifier, 3: Attribute, 4: End tag
//     var tag = "";
//     var id = "";
//     var attr = "";
//     for(i in line) {
//         var c = line[i];
//         if(mode == 0) {
//             if(c == '{') {
//                 mode = 1;
//                 tag = "";
//                 id = "";
//                 attr = "";
//             }
//             else string += c;
//         }
//         else if(mode == 1) {
//             if(c == ':')
//                 mode = 2;
//             else if(c == '}') {
//                 mode = 0;
//                 string += this.process(tag, id, attr);
//             }
//             else tag += c;
//         }
//         else if(mode == 2) {
//             if(c == '(')
//                 mode = 3;
//             else if(c == '}') {
//                 mode = 0;
//                 string += this.process(tag, id, attr);
//             }
//             else id += c;
//         }
//         else if(mode == 3) {
//             if(c == ')') {
//                 mode = 4;
//                 string += this.process(tag, id, attr);
//             }
//             else attr += c;
//         }
//         else if(mode == 4) {
//             if(c == '}') {
//                 mode = 0;
//             }
//         }
//     }
//     return string;
// },