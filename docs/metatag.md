# MetaTag Format

## Selecting Text [ ]
Using brackets '[' and ']' we can make text highlightable/selectable. Any '[' with a leading '*' will be determined as the correct choice when the user selects it. Any '[' or ']' with a leading '\\' is treated as a literal and isn't considered Selecting Text.

## Generators {gen-'name':'id'[:'attribute']}
Using curly brackets '{' and '}' we can generate a noun or attribute (or really anything) and place it inplace of this tag. Generators must include the literal 'gen-' followed by the generator type ('noun', 'adjective') in the tag and must include an identifer('id'), that is used to cache the generated object. Optionally an attribute can be defined to gather a specific attribute from the generated object (if omitted the object is converted to a string and displayed).