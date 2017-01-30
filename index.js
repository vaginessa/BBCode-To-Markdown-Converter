$(document).ready(function(){
// This is function to sync the two textareas when editing

  var master = "left_ta";
  var slave = "right_ta";
  var master_tmp;
  var slave_tmp;
  var timer;

  var sync = function ()
  {
    if($(this).attr('id') == slave)
    {
      master_tmp = master;
      slave_tmp = slave;
      master = slave;
      slave = master_tmp;
    }

    $("#" + slave).unbind("scroll");

    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);

    var x = percentage * ($("#" + slave).get(0).scrollHeight - $("#" + slave).get(0).offsetHeight);

    $("#" + slave).scrollTop(x);

    if(typeof(timer) !== 'undefind')
      clearTimeout(timer);

    timer = setTimeout(function(){ $("#" + slave).scroll(sync) }, 200)
  }

  $('#' + master + ', #' + slave).scroll(sync);

});

function getShadowPx(direction){
  switch (direction) {
    case 'right':
        return '2px 0 1px'
      break;
    case 'left':
        return '-2px 0 1px'
      break;
    case 'top':
        return '0 2px 1px'
      break;
    case 'bottom':
        return '0 -2px 1px'
      break;
    default:
      return '2px 0 1px'
  }
}

function convert(){
  var left = document.getElementById('left_ta'); // assign BBCode textarea
  var right = document.getElementById('right_ta'); // assign Markdown textarea
  var html_check = document.getElementById('html_check').checked; // get HTML status

  var left_value = left.value; // get the value of BBCode textarea

  right.value = doConversion(left_value, html_check); // do actual conversion
}

function doConversion(text, html_check) {
  if(typeof(text) !== "string") {
    throw new Error("I need text to be a string and not a " + typeof(text));
  }
  if(typeof(html_check) !== "boolean") {
    throw new Error("I need html_check to be a boolean and not a " + typeof(html_check));
  }

  // preprocess some nested issues (bold inside h1 element)
  // fixes for code where text is right after [code] - this is not allowed in Markdown
  text = text
    // remove bold tag if nested in size 36 element which translates to H1
    .replace(/\[size=(.+?)\].*\[b\]((?:.|\n)+?)\[\/b\].*\[\/size\]/gmi, '[size=$1]$2[/size]')
    // put text to new line if directly after [code] and is not inline
    .replace(/^\[code\](.+(?!\]).)$/gmi, '[code]\n$1')
    // put text to new line if directly after [code=$lang] and is not inline
    .replace(/^\[code=(.+?)\](.+(?!\]).)$/gmi, '[code=$1]\n$2')
    // split to new lines if both [code] and [/code] in one line and it is not meant to be inline
    .replace(/^\[code\](.+?)\[\/code\]$/gmi, '[code]\n$1\n[/code]')
    // split to new lines if both [code=$lang] and [/code] in one line and it is not meant to be inline
    .replace(/^\[code=(.+?)\](.+?)\[\/code\]$/gmi, '[code=$1]\n$2\n[/code]')
    // put [/code] to new line if directly after text and not inline
    .replace(/^(.(?!code\]).+?)\[\/code\]$/gmi, '$1\n[/code]')

  // SMF (Simple Machines Forum) BBcode
  text = text
    //bold; replace [b] $1 [/b] with ** $1 **
    .replace(/\[b\]((?:.|\n)+?)\[\/b\]/gmi, '**$1**')
    //underline to italic; replace [u] $1 [/u] with * $1 *
    .replace(/\[\u\]((?:.|\n)+?)\[\/\u\]/gmi, '*$1*')
    //italic; replace [i] $1 [/i] with * $1 *
    .replace(/\[\i\]((?:.|\n)+?)\[\/\i\]/gmi, '*$1*')
    //strikethrough; replace [s] $1 [/s] with ~~ $1 ~~
    .replace(/\[s\]((?:.|\n)+?)\[\/s\]/gmi, '~~$1~~')
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
    .replace(/\[url\]((?:.|\n)+?)\[\/url\]/gmi,'[$1]($1)')
    //email; replace [email] $text [/email] with [$text](mailto:$text)
    .replace(/\[email\]((?:.|\n)+?)\[\/email\]/gmi,'[$1](mailto:$1)')
    //ftp; replace [ftp] $text [/ftp] with [$text](ftp://$text)
    .replace(/\[ftp\]((?:.|\n)+?)\[\/ftp\]/gmi,'[$1](ftp://$1)')
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
    .replace(/\[hr\]/gmi, '---')
    //MORE OBSCURE TAGS
    .replace();

  // ONLY IF HTML IS TURNED ON
  if (html_check) {
    text = text
    //table; replace [table] $text [/table] with html <table>$text</table>
    .replace(/\[table\]((?:.|\n)+?)\[\/table\]/gmi, '<table>$1</table>')
    //tr; replace [tr] $text [/tr] with html <tr>$text</tr>
    .replace(/\[tr\]((?:.|\n)+?)\[\/tr\]/gmi, '<tr>$1</tr>')
    //th; replace [th] $text [/th] with html <th>$text</th>
    .replace(/\[th\]((?:.|\n)+?)\[\/th\]/gmi, '<th>$1</th>')
    //td; replace [td] $text [/td] with html <td>$text</td>
    .replace(/\[td\]((?:.|\n)+?)\[\/td\]/gmi, '<td>$1</td>')
    //MORE OBSCURE TAGS
    //sup; replace [sup] $text [/sup] with html <sup>$text</sup>
    .replace(/\[sup\]((?:.|\n)+?)\[\/sup\]/gmi, '<sup>$1</sup>')
    //sub; replace [sub] $text [/sub] with html <sub>$text</sub>
    .replace(/\[sub\]((?:.|\n)+?)\[\/sub\]/gmi, '<sub>$1</sub>')
    //tt; replace [tt] $text [/tt] with html <tt>$text</tt>
    .replace(/\[tt\]((?:.|\n)+?)\[\/tt\]/gmi, '<tt>$1</tt>')
    //pre; replace [pre] $text [/pre] with html <pre>$text</pre>
    .replace(/\[pre\]((?:.|\n)+?)\[\/pre\]/gmi, '<pre>$1</pre>')
    //left; replace [left] $text [/left] with html <div style="text-align: left;">$text</div>
    .replace(/\[left\]((?:.|\n)+?)\[\/left\]/gmi, '<div style="text-align: left;">$1</div>')
    //center; replace [center] $text [/center] with html <div align="center">$text</div>
    .replace(/\[center\]((?:.|\n)+?)\[\/center\]/gmi, '<div align="center">$1</div>')
    //right; replace [right] $text [/right] with html <div style="text-align: right;">$text</div>
    .replace(/\[right\]((?:.|\n)+?)\[\/right\]/gmi, '<div style="text-align: right;">$1</div>')
    //color; replace [color=$color] $text [/color] with html <span style="color: $color;">$text</span>
    .replace(/\[color\=(.+?)\]((?:.|\n)+?)\[\/color\]/gmi, '<span style="color: $1;">$2</span>')
    //font; replace [font=$font] $text [/font] with html <span style="font-family: font;">$text</span>
    .replace(/\[font\=(.+?)\]((?:.|\n)+?)\[\/font\]/gmi, '<span style="font-family: $1;">$2</span>')
    //glow; replace [glow=$color,#,#] $text [/glow] with html <span style="text-shadow: $color 1px 1px 1px">$text</span>
    .replace(/\[glow\=(.+?),.+?\]((?:.|\n)+?)\[\/glow\]/gmi, '<span style="text-shadow: $1 1px 1px 1px">$2</span>')
    //shadow; replace [shadow=$color,$direction] $text [/shadow] with html <span style="text-shadow: $color # # #">$text</span>
    .replace(/\[shadow\=(.+?),(.+?)\]((?:.|\n)+?)\[\/shadow\]/gmi,
        function(match, p1, p2, p3, offset, string){
          return '<span style="text-shadow: ' + p1 + ' ' + getShadowPx(p2) + '"> '+ p3 +'</span>';
    })
    //move; replace [move] $text [/move] with html <marquee>$text</marquee> (BEWARE this tag is deprecated)
    .replace(/\[move\]((?:.|\n)+?)\[\/move\]/gmi, '<marquee>$1</marquee>')
    // SMF size tag without direct <H*> counterpart
    //size 36 element; replace [size=36pt] $text [/size] <span style="font-size: 36pt;">$text</span>
    .replace(/\[size=36pt\]((?:.|\n)+?)\[\/size\]/gmi,'<span style="font-size: 36pt;">$1</span>')
    .replace();
  }

  // ONLY IF HTML IS TURNED OFF
  if (!html_check) {
    text = text
      //remove [color] tags
      .replace(/\[color\=.+?\]((?:.|\n)+?)\[\/color\]/gmi, '$1')
      //MORE OBSCURE TAGS
      //sup; remove [sup] $text [/sup]
      .replace(/\[sup\]((?:.|\n)+?)\[\/sup\]/gmi, '$1')
      //sub; remove [sub] $text [/sub]
      .replace(/\[sub\]((?:.|\n)+?)\[\/sub\]/gmi, '$1')
      //tt; remove [tt] $text [/tt]
      .replace(/\[tt\]((?:.|\n)+?)\[\/tt\]/gmi, '$1')
      //pre; remove [pre] $text [/pre]
      .replace(/\[pre\]((?:.|\n)+?)\[\/pre\]/gmi, '$1')
      //left; remove [left] $text [/left]
      .replace(/\[left\]((?:.|\n)+?)\[\/left\]/gmi, '$1')
      //center; remove [center] $text [/center]
      .replace(/\[center\]((?:.|\n)+?)\[\/center\]/gmi, '$1')
      //right; remove [right] $text [/right]
      .replace(/\[right\]((?:.|\n)+?)\[\/right\]/gmi, '$1')
      //color; remove [color=$color] $text [/color]
      .replace(/\[color\=.+?\]((?:.|\n)+?)\[\/color\]/gmi, '$1')
      //font; remove [font=$font] $text [/font]
      .replace(/\[font\=.+?\]((?:.|\n)+?)\[\/font\]/gmi, '$1')
      //glow; remove [glow=$color,#,#] $text [/glow]
      .replace(/\[glow\=.+?\]((?:.|\n)+?)\[\/glow\]/gmi, '$1')
      //shadow; remove [shadow=$color,$direction] $text [/shadow]
      .replace(/\[shadow\=.+?\]((?:.|\n)+?)\[\/shadow\]/gmi, '$1')
      //move; remove [move] $text [/move]
      .replace(/\[move\]((?:.|\n)+?)\[\/move\]/gmi, '$1')
      // SMF size tag without direct <H*> counterpart
      //size 36 element; fallback to H1
      .replace(/\[size=36pt\]((?:.|\n)+?)\[\/size\]/gmi,'# $1')
      .replace();
  }

  return text
}
