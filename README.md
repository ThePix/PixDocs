# PixDocs
A very simple way to extract documentation for JS files

There are other systems out there, but they do not quite do what I want. This will go though a list of files, and pull out the comments flagged, together with  the function signature.

It does assume a specific format for comments, as illustrated below:

```
//@DOC
// Two simple functions
//@UNDOC


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
  // Returns a new array based on ary, but including only those objects for which the attribute attName
  // is equal to value.
  // To filter for objects that do not have the attribute you can filter for the value undefined.
  arrayFilterByAttribute:function(ary, attName, value) {
    return ary.filter(el => el[attName] === value)
  }

}
```

Comments must be directly before the function (there cannot be any lines that are not comments). The first line of comments must be `\\@DOC` (but this is set in the settings file). There cannot be anything other than spaces before the comment.

Comments not associated with a function should be terminated \\@UNDOC.

Lines are combined into a single paragraph as appropriate. Use a blank line to force a new paragraph.

Functions declared inside a name space (object, etc.) should work fine, however, only one level of name spacing is implemented.

It is assumed the output is for Github Wiki, therefore you can include some markdown, as the Wiki will handle the syling. Block level is not so straightforward, but you can use either three backticks or four spaces to indicate code. Lines starting with a * will be kept as such to indicate list items. Tables are not supported.

The settings.js is used to configure. The files processed are path+files[i]+ext. The results will go into path+out.

```
const settings = {
  docflag:'@DOC',
  undocflag:'@UNDOC',
  linebreak:'\r\n',
  ext:'.js',
  path:'../QuestJS/',
  files:[
    'lib/world',
    'lib/util',
    'lang/lang-en',
  ],
  out:'docs.md',
}
```



If yu want to cusomise the output, just modify the code at the end of main.js.
