function convert() {
  var left = document.getElementById('left_ta');
  var right = document.getElementById('right_ta');
  var html_check = document.getElementById('html_check').checked;

  var left_value = left.value;

  //SMF (Simple Machines Forum) BBcode
  left_value = left_value
    //bold; replace [b] $1 [/b] with ** $1 **
    .replace(/\[b\]((?:.|\n)+?)\[\/b\]/gmi, '**$1**')
    //underline to italic; replace [u] $1 [/u] with * $1 *
    .replace(/\[\u\]((?:.|\n)+?)\[\/\u\]/gmi, '*$1*')
    //italic; replace [i] $1 [/i] with * $1 *
    .replace(/\[\i\]((?:.|\n)+?)\[\/\i\]/gmi, '*$1*')
    //strikethrough; replace [s] $1 [/s] with ~~ $1 ~~
    .replace(/\[s\]((?:.|\n)+?)\[\/s\]/gmi, '~~$1~~')
    //remove [color] tags
    .replace(/\[color\=.+?\]((?:.|\n)+?)\[\/color\]/gmi, '$1')
    //unordered list; remove [list][/list] and convert it's elements
    .replace(/\[list\]((?:.|\n)+?)\[\/list\]/gmi,
        function (match, p1, offset, string) {
          //unordered list element; convert [li] $text [/li] to * $text
          return p1.replace(/\[li\]((?:.|\n)+?)\[\/li\]/gmi, '* $1');
    })
    //ordered list; remove [list type=decimal][/list] and convert it's elements
    .replace(/\[list type=decimal\]((?:.|\n)+?)\[\/list\]/gmi,
        function (match, p1, offset, string) {
          //ordered list element; convert [li] $text [/li] to 1. $text
          return p1.replace(/\[li\]((?:.|\n)+?)\[\/li\]/gmi, '1. $1');
    })
    //img; replace [img] $link [/url] with ![]($link)
    .replace(/\[img\]((?:.|\n)+?)\[\/img\]/gmi,'![]($1)')
    //url; replace [url=$link] $text [/url] with [$text]($link)
    .replace(/\[url=(.+?)\]((?:.|\n)+?)\[\/url\]/gmi,'[$2]($1)')
    //inline code; replace [code] $text [/code] with `$text`
    .replace(/\[quote\](.*?)\[\/quote\]/gmi, '> $1')
    //quote; remove [quote][/quote] convert it's elements
    .replace(/\[quote\]((?:.|\n)+?)\[\/quote\]/gmi,
        function (match, p1, offset, string) {
          //quote lines; convert $line to > $line
          return p1.replace(/((?:.*)\n)/gmi, '> $1');
    })
    //inline code; replace [code] $text [/code] with `$text`
    .replace(/\[code\](.*?)\[\/code\]/gmi, '`$1`')
    //code block; replace [code=$lang] $text [/code] with ```$lang $text ```
    .replace(/\[code=(.+?)\]((?:.|\n)+?)\[\/code\]/gmi, '```$1$2```')
    //code block; replace [code] $text [/code] with ``` $text ```
    .replace(/\[code\]((?:.|\n)+?)\[\/code\]/gmi, '```$1```')
    //Below elements were compared with em representation of H* tags
    //size 24 element; convert to H1
    .replace(/\[size=24pt\]((?:.|\n)+?)\[\/size\]/gmi,'# $1')
    //size 18 element; convert to H2
    .replace(/\[size=18pt\]((?:.|\n)+?)\[\/size\]/gmi,'## $1')
    //size 14 element; convert to H3
    .replace(/\[size=14pt\]((?:.|\n)+?)\[\/size\]/gmi,'### $1')
    //size 12 element; convert to H4
    .replace(/\[size=12pt\]((?:.|\n)+?)\[\/size\]/gmi,'#### $1')
    //size 10 element; convert to H5
    .replace(/\[size=10pt\]((?:.|\n)+?)\[\/size\]/gmi,'##### $1')
    //size 8 element; convert to H6
    .replace(/\[size=8pt\]((?:.|\n)+?)\[\/size\]/gmi,'###### $1')
    //horizontal line; replace [hr] with ---
    .replace(/\[hr\]/i, '---');

  if (html_check) {
    left_value = left_value
    //table; replace [table] $text [/table] with html <table>$text</table>
    .replace(/\[table\]((?:.|\n)+?)\[\/table\]/gmi, '<table>$1</table>')
    //tr; replace [tr] $text [/tr] with html <tr>$text</tr>
    .replace(/\[tr\]((?:.|\n)+?)\[\/tr\]/gmi, '<tr>$1</tr>')
    //th; replace [th] $text [/th] with html <th>$text</th>
    .replace(/\[th\]((?:.|\n)+?)\[\/th\]/gmi, '<th>$1</th>')
    //td; replace [td] $text [/td] with html <td>$text</td>
    .replace(/\[td\]((?:.|\n)+?)\[\/td\]/gmi, '<td>$1</td>')

  }

  right.value = left_value;

}
