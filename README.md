# BBCode To Markdown Converter

Currently **all tags are specific for SMF (Simple Machines Forum)**.
Converting to *GitHub Flavored Markdown* and tested on NodeBB forum platform.

Does support html output for BBCode tags that doesn't have direct markdown implementation
* table, tr, th, td
* pre, left, center, right
* font, color, glow, shadow, move
(Please note, that when turned off, it will strip all the unknown tags)

#### Disclaimer
This is highly suboptimal convertor. I just manually replace tags based on regex.
No inteligent algorhitms used. It is just a dirty function I wrote for myself to convert my SMF based knowledge base to NodeBB.

## Currently Supported Tags:

#### Emphasis tags
| BBCode | Markdown |
|--------|----------|
|[b]text[/b]|\*\*text\*\*|
|[i]italic text[/i]|\*italic text\*|
|[u]underlined text is replaced with cursive[/u]|\*underlined text is replaced with cursive\*|
|[s]strikethrough text[/s]|\~\~strikethrough text\~\~|

nested:
```
[b][i]this is italic and bold[/i][/b]
[b]this is [s]strikethrough[/s] and this is [i]italic[/i] and all this is bold[/b]
```
```
***this is italic and bold***
**this is ~~strikethrough~~ and this is *italic* and all this is bold**
```

#### Size tags
| BBCode | Markdown |
|--------|----------|
[size=36pt]36pt fallback to H1[/size]|\# 36pt fallback to H1|
[size=24pt]test size 24pt -> h1[/size]|\# test size 24pt -> h1|
[size=18pt]test size 18pt -> h2[/size]|\#\# test size 18pt -> h2|
[size=14pt]test size 14pt -> h3[/size]|\#\#\# test size 14pt -> h3|
[size=12pt]test size 12pt -> h4[/size]|\#\#\#\# test size 12pt -> h4|
[size=10pt]test size 8pt -> h5[/size]|\#\#\#\#\# test size 8pt -> h5|
[size=8pt]test size 8pt -> h6[/size]|\#\#\#\#\#\# test size 8pt -> h6|

#### Links
| BBCode | Markdown |
|--------|----------|
|[img=link][/img]|\!\[\]\(link\)|
|[url][/url]|\[\]\(\)|
|[email]link[/email]|\[\]\(mailto:\)|
|[ftp]link[/ftp]|\[\]\(ftp://\)|

#### Lists
##### Unordered list
BBCode:
```
[list]
[li]test of unordered list 1[/li]
[li]test of unordered list 2[/li]
[/list]
```

Markdown
```
* test of unordered list 1
* test of unordered list 2
```

##### Ordered list
BBCode:
```
[list type=decimal]
[li]test of ordered list 1[/li]
[li]test of ordered list 2[/li]
[li]test of ordered list 3[/li]
[li]test of ordered list 4[/li]
[/list]
```

Markdown
```
1. test of ordered list 1
1. test of ordered list 2
1. test of ordered list 3
1. test of ordered list 4
```

#### Code Blocks
##### Inline Code
BBCode:
```
[code]inline_code();[/code]
```
Markdown

    `inline_code();`

##### Multiline Code block with autodiscovery highlight

BBCode:
```
[code]
import Html exposing (text)

main =
  text "Hello, World!"
[/code]
```

converts to:

    ```
    import Html exposing (text)

    main =
    text "Hello, World!"
    ```

##### Multiline Code block with specified language

BBCode:
```
[code=elm]
import Html exposing (text)

main =
  text "Hello, World!"
[/code]
```

converts to:

    ```elm
    import Html exposing (text)

    main =
    text "Hello, World!"
    ```

##### Implemented fixes
These fixes are implemented:
```
[code]text
---->
[code]
text

[code=lang]text
---->
[code=lang]
text

[code]text[/code]    //not meant to be inline
---->
[code]
text
[/code]

[code=lang]text      //not meant to be inline
---->
[code=lang]
text
[/code]

text as last in block[/code]  // is not inline - this breaks markdown as \`\`\`
---->                         // should always ne on newline and not after text
text as last in block
[/code]

```

#### Quotes
##### Single line quote
BBCode:
```
[quote]single line quote[/quote]
```

Markdown
```
> inline blockquote
```

##### Multi line quote
BBCode:
```
[quote]first line
second line
third line
[/quote]
```

Markdown
```
\> first line
\> second line
\> third line
```

#### Other tags
| BBCode | Markdown |
|--------|----------|
|[hr]|---|

### Tags supported only in HTML output
##### Tables
BBCode:
```
[table]
[tr]
[th]Heading 1[/th]
[th]Heading 2[/th]
[th]Heading 3[/th]
[/tr]
[tr]
[td]first - text 1[/td]
[td]first - text 2[/td]
[td]first - text 3[/td]
[/tr]
[tr]
[td]second - text 1[/td]
[td]second - text 2[/td]
[td]second - text 3[/td]
[/tr]
[/table]
```

Markdown
```
<table>
<tr>
<th>Heading 1</th>
<th>Heading 2</th>
<th>Heading 3</th>
</tr>
<tr>
<td>first - text 1</td>
<td>first - text 2</td>
<td>first - text 3</td>
</tr>
<tr>
<td>second - text 1</td>
<td>second - text 2</td>
<td>second - text 3</td>
</tr>
</table>
```

##### SMF Special tags
```
[size=36pt][/size] --> <span style="font-size: 36pt;"></span>
[sup][/sup] --> <sup></sup>
[sub][/sub] --> <sub></sub>
[tt] font[/tt] --> <tt></tt>
[pre][/pre] --> <pre></pre>
[left][/left] --> <div style="text-align: left;"></div>
[center][/center] --> <div align="center"></div>
[right][/right] --> <div style="text-align: right;"></div>
[font=courier][/font] --> <span style="font-family: courier;"></span>
[color=red][/color] --> <span style="color: red;"></span>
[glow=red,2,300][/glow] --> <span style="text-shadow: red 1px 1px 1px"></span>
[shadow=black,right][/shadow] --> <span style="text-shadow: black 2px 0 1px"></span>
  color,direction --> color Xpx Xpx Xpx
    color,right --> color 2px 0 1px
    color,left --> color -2px 0 1px
    color,top --> color 2px 0 1px
    color,bottom --> color 0 -2px 1px
[move]This is moving text[/move] --> <marquee></marguee> (this elem is deprecated)
```

#### TODO:
- [X] Able to turn on HTML output for special tags unsupported by markdown
  - [X] tables (for now)
  - [X] old SMF tags (sup, sub, tt, pre, left, center, right, font, color, glow, shadow, move)
- [ ] Add tests (Mocha or Jasmine)
- [ ] Support for specific BBCode for other major forums [toggleable]
  - [ ] phpBB
  - [ ] MyBB
  - [ ] vBulletin
  - [ ] FluxBB
  - [ ] bbPress
- [ ] Split .replace calls to functions to better organize code
  - [ ] optimalize regex

#### CREDITS:
Originaly forked from: [JonDum](https://github.com/JonDum/BBCode-To-Markdown-Converter)
