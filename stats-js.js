<script>
function btnShowStatsHtml() {

  var x = $("#tblStats").clone();
  $("#statsContainer").empty()
  x.appendTo("#statsContainer");
  $("#tblStats").hide()
  
  var charts = arrOptions['myStatsCharts'].split(',')
    
  charts.forEach( (val, idx) => {

    switch (val) {
  
      case 'Scores and Handicap - all Rounds':
        break;

      case 'Lifetime':
 //</script>       lifetimeStats()
        break;

      default:
        otherStats(val, idx)
        break;

    }


  })   
    
    
//  $('[href="#Stats"]').trigger('click');
  gotoTab('Stats')
    
}

function otherStats(val, idx) {


  var json = JSON.parse(arrOptions[val] )
  var arrChart =  json.arrData
  var arrFormat = json.format
      
  var ele = $("#tblStats").clone().show();

  var hdr = arrChart[0]
  arrChart.shift() 
      
  arrChart.forEach((currentValue, index, array) => {
      
    array[index][0] = currentValue[0].replace(/ /g, '\u00a0')         // replace spaces with non-printing spaces for table formatting
        
      if (arrFormat == "percent") {
        
        currentValue.forEach((val, idx, arr) => {
        
          if (typeof val === 'number') {
            var nbrDec = 3
            arr[idx] = Number((val * 100).toFixed(nbrDec))  + "%";
              
          }
          
        })
      }
    })
      
    var tbl = new Table();
      
    tbl
      .setHeader(hdr)
      .setTableHeaderClass('text-right')
      .setData(arrChart)
      .setTableClass('table')
      .setTrClass()
      .setTcClass(['', 'text-right', 'text-right', 'text-right'])
      .setTdClass('py-0 border-0 h5')
      .build(ele);
        
    ele.prepend( "<h3 class='w-100 text-center'>" + val + "</h3>")
    ele.append( "<hr class='w-100'>")

    ele.appendTo("#statsContainer");

}


function lifetimeStats() {

    var stats = JSON.parse(arrOptions.Lifetime)
    
    var x = $("#tblLtStats").clone();
    $("#statsLtContainer").empty()
    x.appendTo("#statsLtContainer");
        
    $("#tblLtStats").hide()
    
    $.each(stats, function (idx, val) {
    
      if (typeof val === 'object') {
  
        for (var p=0;p<val.length;p++) {
        
          var x = val[p].split(": ")
          var key = x[0]
          var value = x[1] * 1.0
          var ele = $("#tblLtStats").clone();
  
          ele.find('#statsLtDescr')[0].innerHTML = camel2title(key)
          ele.find('#statsLtVal')[0].innerHTML = formatNumber(value)
          ele.show()
      
          ele.appendTo("#statsLtContainer");
  
        }
      
      } else {
        
        var ele = $("#tblLtStats").clone();

        ele.find('#statsLtDescr')[0].innerHTML = camel2title(idx)
        ele.find('#statsLtVal')[0].innerHTML = formatNumber(val)
        ele.show()
      
        ele.appendTo("#statsLtContainer");
     
      }
     
    })

}

function camel2title(camelCase) {
  
  return camelCase
    // inject space before the upper case letters
    .replace(/([A-Z])/g, function(match) {
       return " " + match;
    })
    // replace first char with upper case
    .replace(/^./, function(match) {
      return match.toUpperCase();
    });
}


</script>