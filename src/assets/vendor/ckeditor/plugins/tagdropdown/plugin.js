/*
 Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function() {
  var c;
  CKEDITOR.plugins.add("tagdropdown", {
    requires: "richcombo", init: function(e) {
      var g = e.config;
      e.ui.addRichCombo("Tag", {
        label: "Tag",
        toolbar: "styles,10",
        allowedContent: [],
        panel: {css: [CKEDITOR.skin.getPath("editor")].concat(g.contentsCss), multiSelect: !0},
        init: function() {
          var d = document.getElementById("tagsList");
          if (d) {
            d = d.value;
            c = d = JSON.parse(d);
            for (var a in d) if (d.hasOwnProperty(a)) {
              this.startGroup(a);
              for (var b in d[a]) {
                for (var f = "", e = 0; e < d[a][b].level; e++) f += "-";
                d[a][b].derivedDataset ?
                  this.add(d[a][b].name, f + " " + d[a][b].description + " - Υποφόρμα - Επίπεδο " + d[a][b].level) : this.add(d[a][b].name, f + " " + d[a][b].description)
              }
            }
          }
        },
        onClick: function(d) {
          for (var a in c) if (c.hasOwnProperty(a)) for (var b in c[a]) if (c[a][b].name == d) {
            e.insertHtml(c[a][b].derivedDataset ? '\x3cdiv id\x3d"' + c[a][b].name + '"\x3e\x3c/div\x3e' : "BASE64IMAGE" == c[a][b].type ? '\x3cimg id\x3d"' + c[a][b].name + '" style\x3d"display:block; ' + c[a][b].imageSize + '" src\x3d"' + c[a][b].base64image + '" /\x3e' : c[a][b].grammarCase ? '\x3cinput type\x3d"text" class\x3d"tag" id\x3d"' +
              c[a][b].name + '" value\x3d"' + c[a][b].description + '" strformat\x3d"" size\x3d"' + c[a][b].description.length + '" readonly\x3d"true" grammar-case\x3d"' + c[a][b].grammarCase + '" /\x3e' : '\x3cinput type\x3d"text" class\x3d"tag" id\x3d"' + c[a][b].name + '" value\x3d"' + c[a][b].description + '" strformat\x3d"" size\x3d"' + c[a][b].description.length + '" readonly\x3d"true" /\x3e');
            break
          }
        }
      })
    }
  })
})();
