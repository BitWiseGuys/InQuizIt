# InQuizIt
## Project Outline


## Question Format
Questions are stored as plaintext. However, some helpful features have been included to allow for diversity within the question. The following table helps include variations within the question:

| Format               | Specification                              |
|----------------------|--------------------------------------------|
| {gen}                | One time generation, generates content and then toString's it.
| {gen(attribute)}     | One time generation, generates content and then uses the given attribute.
| {gen:id}             | Cached generation, generates content (stores it within the question cache) and then toString's it. 
| {gen:id(attribute)}  | Cached generation, generates content (stores it within the question cache) and then uses the given attribute.
| {var:id}             | Cached variable usage, uses stored information from question and toString's it.
| {var:id(attribute)}  | Cached variable usage, uses stored information from question and uses it's attribute.