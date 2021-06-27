
async function btnShowStatsHtml() {

  var statSelectOptions  = readOption('statExcludeSmallVal')
  var statExcludeSmall = statSelectOptions.statExcludeSmallVal
  var statRng1 = statSelectOptions.statRng1
  var statRng2 = statSelectOptions.statRng2
  var statRng3 = statSelectOptions.statRng3

  var rounds = await getRounds(statExcludeSmall)

  var datePlayed = rounds.map(x => x['date'])
  
  var endRow = {}
    endRow['row1'] = getEndRow(datePlayed, statRng1)
    endRow['row2'] = getEndRow(datePlayed, statRng2)
    endRow['row3'] = getEndRow(datePlayed, statRng3)


  var x = extrRndData	(rounds, 'finalScore', 25)

  console.log(x)

  var x = extrRndData	(rounds, 'objHandicap.courseAdjustedScore', 25)
  console.log(x)
  
  var x = extrRndData	(rounds, 'scoreCard.scores', 25)
  console.log(x)

  return
  var x = $("#tblStats").clone();
  $("#statsContainer").empty()
  x.appendTo("#statsContainer");
  $("#tblStats").hide()
  
    

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


async function btnStatSelectHtml(e) {
  
  var statExcludeSmallVal     = $('#statExcludeSmall').prop('checked')
  var statRng1                = $( "#selectStatsRng1" ).val()
  var statRng2                = $( "#selectStatsRng2" ).val()
  var statRng3                = $( "#selectStatsRng3" ).val()

  await updateOption('statSelectOptions', {
                                  'statExcludeSmallVal':   statExcludeSmallVal ,
                                  'statRng1': statRng1,
                                  'statRng1': statRng2,
                                  'statRng1': statRng3
                                  })
                                  
                                  
  $("#btnStatMoreVert").click()
  
  btnShowStatsHtml()

}

async function btnStatsMoreVertHtml() {

  var statSelectOptions  = await readOption('statFilter') 
  $('#statExcludeSmall').prop('checked',  statSelectOptions.statExcludeSmall )

}


function avgArr(arr) {
  var i = arr.length
  var sum = 0;
  var nbr = 0
  while (i--) {
    if (typeof arr[i] == 'number') {
      sum = sum + arr[i]
      nbr++
    }
  }
  return nbr == 0 ? 0 : sum / nbr
}

function sumArr(arr) {
  var i = arr.length
  var sum = 0;
  while (i--) {
    if (typeof arr[i] == 'number') {
      sum = sum + arr[i]
    }
  }
  return sum
}
function extrRndData	(rounds, colName, nbrRows) {

	// rounds, 
	// 'courseInfo.courseName', 'scorecard.putts', 'objHandicap.courseAdjustedScore', 'finalScore'
	// nbrRows

  var parseCol = colName.split('.')

  // var rndArr =  rounds.slice(0,nbrRows)
  var rtn = []

  for (var i = rounds.length - 1; i > rounds.length - nbrRows - 1; i--) {

    var rnd = rounds[i]

    if (parseCol.length == 1) {

      var x = rnd[parseCol[0]]
      rtn.push(x)

    } else {

      if (typeof rnd[parseCol[0]] === "object") {

        var a = rnd[parseCol[0]]
        var b = a[parseCol[1]]
        rtn.push(b)

      } else {

        var obj = JSON.parse(rnd[parseCol[0]])
        var x = obj[parseCol[1]]
        rtn.push(x)

      }

    }

  }
  return rtn
}


function getColData(colName, Hdrs, arr, firstRow, nbrRows) {
  var colNbr = Hdrs.indexOf(colName)
  if (nbrRows === undefined) {
    var coldata =  arr[colNbr].slice(firstRow - 1)
  } else {
    var coldata =  arr[colNbr].slice(firstRow - 1, firstRow + nbrRows - 1)
  }
  return coldata
}

function getEndRow(datePlayedArr, dataRngDescr) {

  switch (dataRngDescr) {
    case "This Round":
      return 1
      break;
    case "Last 5 Rounds":
      return Math.min(5, datePlayedArr.length)
      break;
    case "Last 10 Rounds":
      return Math.min(10, datePlayedArr.length)
      break;
    case "Last 20 Rounds":
      return Math.min(20, datePlayedArr.length)
      break;
    case "Last 25 Rounds":
      return Math.min(25, datePlayedArr.length)
      break;
    case "Last 50 Rounds":
      return Math.min(50, datePlayedArr.length)
      break;
    case "Last 100 Rounds":
      return Math.min(100, datePlayedArr.length)
      break;
    case "Past Year":
      var now = new Date();
      var oneYrAgo = new Date();
      oneYrAgo.setFullYear(now.getFullYear() - 1);
      for (var i = 1; i < datePlayedArr.length; i++) {if (datePlayedArr[i] < oneYrAgo) {
        return i}
      }
      return datePlayedArr.length
      break;
    case "Past Month":
      var now = new Date();
      var oneMoAgo = new Date();
      oneMoAgo.setMonth(now.getMonth() - 1);
      for (var i = 1; i < datePlayedArr.length; i++) {if (datePlayedArr[i] < oneMoAgo) {
        return i}
      }
      return datePlayedArr.length
      break;
    case "All Time":
      return datePlayedArr.length
      break;
  }
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
