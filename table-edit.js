(function($){
  $(document).ready(function(){
    var status = 0;
    $("input").bind("paste", function(e){
      e.stopPropagation();
      e.preventDefault();
      var colfocus = $("input[type='text']:focus").parent(), rowfocus = colfocus.parent();
      var colindex = $("tr:has(td input[type='text']:focus) td").index(colfocus), rowindex = $('tr').index(rowfocus);
      var table_col = $("tr:has(td input[type='text']:focus) td").length - colindex, table_row = $("table:has(td input[type='text']:focus) tr").length - rowindex;
      var col = e.originalEvent.clipboardData.getData("text/plain").split('\n');
      var lrow = col[0].split('\t').length;
      if ((lrow > table_col) || ((col.length - 1) > table_row)){status += 1;}else{status = 0;}
      if (status == 0){
        $(col).each(function(){
          var row = this.split('\t');
          if(row != ''){
            $(row).each(function(){
              $('tr:eq('+rowindex+') td:eq('+colindex+') input').val(this);
              colindex += 1;
            });
            colindex = colindex - row.length;
            rowindex += 1;
          }
        });
      }
      else if (status == 1){alert('данні не поміщаються в таблицю!!! на сторінці менше стовпчиків або рядків');}
      else if (status == 2){alert('і знову на ті ж граблі :-)');}
      else if (status == 3){alert('вже 3 рази підряд, співпадіння??? не думаю!!!');}
      else if (status > 3){alert('ой все!!!');}
    });

    $("body").on("keydown", function(e){
      var colfocus = $("input[type='text']:focus").parent(), rowfocus = colfocus.parent(), colindex = $("tr:has(td input[type='text']:focus) td").index(colfocus), rowindex = $('tr').index(rowfocus);

      if(e.keyCode == 38){rowindex -= 1;$('tr:eq('+rowindex+') td:eq('+colindex+') input').focus();}
      else if(e.keyCode == 40 || e.keyCode == 13){rowindex += 1;$('tr:eq('+rowindex+') td:eq('+colindex+') input').focus();}
      else if(e.keyCode == 39){colindex += 1;$('tr:eq('+rowindex+') td:eq('+colindex+') input').focus();}
      else if(e.keyCode == 37){colindex -= 1;$('tr:eq('+rowindex+') td:eq('+colindex+') input').focus();}
      if($('td').is('.selected_td')){
        if(e.keyCode == 67 && e.ctrlKey){copy_tds();}
        else if(e.keyCode == 46){$('.selected_td').each(function(){$(this).find('input').val('');});}
        else if (e.keyCode == 88 && e.ctrlKey) {copy_tds();$('.selected_td').each(function(){$(this).find('input').val('');});}
      }
    });

    function select_in_table(){
      var clicked = 0, x_0 = '', y_0 = '';
      $('body').append('<style>.selected_td input {background: rgba(0, 0, 255, 0.49);color: #fff;}</style>')

      $('input').mouseup(function(){clicked = 0;});
      $(document).click(function(){$("tr:has(td input[type='text']) td").removeClass('selected_td');});

      $('input').mousedown(function(){
        var sel_c_0 = $(this).parent(), sel_r_0 = $(sel_c_0).parent();
        y_0 = $("tr:has(td input[type='text'])").index(sel_r_0) + 1;
        x_0 = $("tr:eq("+y_0+"):has(td input[type='text']:hover) td").index(sel_c_0);
        clicked = 1;
      });

      $('input').mouseover(function(){
        if(clicked == 1){
          var sel_c_n = $(this).parent(), sel_r_n = $(sel_c_n).parent();
          var y_n = $("tr:has(td input[type='text'])").index(sel_r_n) + 1;
          var x_n = $("tr:eq("+y_n+"):has(td input[type='text']) td").index(sel_c_n);
          $("tr:has(td input[type='text']) td").removeClass('selected_td');

          if((y_n >= y_0) && (x_n >= x_0)){for(i = y_0; i <= y_n; i++){for(j = x_0; j <= x_n; j++){$("tr:eq("+i+"):has(td input[type='text']) td:eq("+j+")").addClass('selected_td');}}}
          if((y_n <= y_0) && (x_n <= x_0)){for(i = y_n; i <= y_0; i++){for(j = x_n; j <= x_0; j++){$("tr:eq("+i+"):has(td input[type='text']) td:eq("+j+")").addClass('selected_td');}}}
          if((y_n >= y_0) && (x_n <= x_0)){for(i = y_0; i <= y_n; i++){for(j = x_n; j <= x_0; j++){$("tr:eq("+i+"):has(td input[type='text']) td:eq("+j+")").addClass('selected_td');}}}
          if((y_n <= y_0) && (x_n >= x_0)){for(i = y_n; i <= y_0; i++){for(j = x_0; j <= x_n; j++){$("tr:eq("+i+"):has(td input[type='text']) td:eq("+j+")").addClass('selected_td');}}}
        }
      });
    }
    select_in_table();

    function copy_tds(){
      var s_y = 0, to_copy = [], $temp = $("<textarea>");

      $('tr:has(td.selected_td)').each(function(){
        to_copy[s_y] = [];
        s_x = 0;
        $(this).find('td.selected_td').each(function(){
          to_copy[s_y][s_x] = $(this).find('input').val();
          s_x += 1;
        });
        to_copy[s_y] = to_copy[s_y].join('\t');
        s_y += 1;
      });
      to_copy = to_copy.join('\n');

      $("body").append($temp);
      $temp.val(to_copy).select();
      document.execCommand("copy");
      $temp.remove();
    }
  });
})(jQuery);
