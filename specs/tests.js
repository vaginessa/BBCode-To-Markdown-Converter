describe("doConversion()", function() {
  describe("function don't accept wrong arguments", function() {
    it("should throw an error if one of arguments is wrong", function() {

      expect(function(){
        doConversion(1, true);
      }).toThrowError();
      expect(function(){
        doConversion("", 1);
      }).toThrowError();
      expect(function(){
        doConversion()
      }).toThrowError();
      expect(function(){
        doConversion("")
      }).toThrowError();
      expect(function(){
        doConversion(true)
      }).toThrowError();
    });

  });

  // Create general test to DRY
  function execute_general_test(bbcode, markdown, html_status) {
    it (bbcode + ' should parse as ' + markdown, function(){
      expect(doConversion(bbcode, html_status)).toEqual(markdown);
    });
  }

  describe("BASIC tags should be same when HTML is turned on and turned off", function() {
    var html_statuses = [false, true]

    for(var i = 0; i < html_statuses.length; i++){
      var html_status = html_statuses[i];
      var html_status_text = html_status ? 'ON' : 'OFF';

      describe("Emphasize tags to markdown - HTML is " + html_status_text, function() {
        execute_general_test('[b]test_string[/b]', '**test_string**', html_status);
        execute_general_test('[i]test_string[/i]', '*test_string*', html_status);
        execute_general_test('[u]test_string[/u]', '*test_string*', html_status);
        execute_general_test('[s]strikethrough text[/s]', '~~strikethrough text~~', html_status);
        execute_general_test('[b]this is [s]strikethrough[/s] and this is [i]italic[/i] and all this is bold[/b]',
              '**this is ~~strikethrough~~ and this is *italic* and all this is bold**', html_status);
      });

      describe("Size tags to markdown - HTML " + html_status_text, function() {
        var sizes = {
          "24": ["1", "#"],
          "18": ["2", "##"],
          "14": ["3", "###"],
          "12": ["4", "####"],
          "10": ["5", "#####"],
          "8": ["6", "######"],
        }

        Object.keys(sizes).forEach(function(key) {
          execute_general_test("[size=" + key + "pt]test_string[/size]",
                sizes[key][1] + " test_string", html_status);
        });
      });

      describe("Link tags to markdown - HTML " + html_status_text, function() {
        execute_general_test('[img]example.org/test.png[/img]', '![](example.org/test.png)', html_status);
        execute_general_test('[url]example.org[/url]', '[example.org](example.org)', html_status);
        execute_general_test('[email]mail@example.org[/email]', '[mail@example.org](mailto:mail@example.org)', html_status);
        execute_general_test('[ftp]ftp.example.org[/ftp]', '[ftp.example.org](ftp://ftp.example.org)', html_status);
      });
    }
  });
});
