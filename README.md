# PixDocs
A very simple way to extract documentation for JS files

There are other systems out there, but they do not quite do what I want. This will go though a list of files, and pull out the comments flagged, together with  the function signature.

It does assume a specific format for comments, as illustrated below:

```
//@DOC
// Removes the element el from the array, ary.
// Unlike arraySubtract, no new array is created; the original aray is modified, and nothing is returned.
//
// This has been unit tested
function arrayRemove(ary, el) {
  let index = ary.indexOf(el)
  if (index !== -1) {
    ary.splice(index, 1)
  }
}



const ns = {

  //@DOC
  // Returns a new array based on ary, but including only those objects for which the attribute attName is equal to value.
  // To filter for objects that do not have the attribute you can filter for the value undefined.
  var arrayFilterByAttribute = function(ary, attName, value) {
    return ary.filter(el => el[attName] === value)
  }

}
```

Comments must be directly before the function (there cannot be any lines that are not comments). The first line of comments must be `\\DOC`. There cannot be anything other than spaces before the comment.

Lines are combined into a single paragraph, except where there is a blank line (as seen in the first example above).

Functions inside a name space (object, etc.) must be indented for the system to flag it as such - and if it is not in a name space, do not indent (technically this only applies to the first line, `\\DOC`). Only one kevel of name spacing is implemented.

It is assumed the output is for Github Wiki, therefore you can include some markdown, as the Wiki will handle it. Block level is not so straightforward, but you can use either three backticks or four spaces to indicate code. Tables and lists are not supported.
