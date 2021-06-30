
async function btnShowStatsHtml() {

  var statOptions  = readOption('statOptions')

  console.log(statOptions)
  var statExcludeSmall = statOptions.statExcludeSmallCourses
  var statRng1 = statOptions.statRng1
  var statRng2 = statOptions.statRng2
  var statRng3 = statOptions.statRng3

  var rounds = await getRounds(statExcludeSmall)

  var datePlayed = rounds.map(x => x['date'])
  
console.log(datePlayed)
  console.log(getEndRow(datePlayed, statRng1))
  console.log(getEndRow(datePlayed, statRng2))
  console.log(getEndRow(datePlayed, statRng3))
  
  var endRow = {}
    endRow['row1'] = getEndRow(datePlayed, statRng1)
    endRow['row2'] = getEndRow(datePlayed, statRng2)
    endRow['row3'] = getEndRow(datePlayed, statRng3)

  var myStatsRng = {};
    myStatsRng['rng1'] = statRng1
    myStatsRng['rng2'] = statRng2
    myStatsRng['rng3'] = statRng3

  // var x = extrRndData	(rounds, 'finalScore', 25)
  // console.log(x)

  // var x = extrRndData	(rounds, 'objHandicap.courseAdjustedScore', 25)
  // console.log(x)
  
  // var x = extrRndData	(rounds, 'scoreCard.scores', 25)
  // console.log(x)

  var rptArr = []

  var title = "Course Adjusted Score"
  var rtn = chartCourseAdjustedScore (title, rounds, myStatsRng, endRow)   
  console.log( rtn)
  rptArr.push(rtn)
   
 var title = "Average Score by Par"
  var rtn = chartAverageScorebyPar   (title, rounds, myStatsRng, endRow)
  console.log( rtn)
  rptArr.push(rtn)
  
  var title = "Putting"
  var rtn = chartPutting             (title, rounds, myStatsRng, endRow)        
  console.log( rtn)
  rptArr.push(rtn)
   
  // var title = "Tee to Green"
  // var rtn = chartTeeToGreen          (title, rounds, myStatsRng, endRow)        
    
  // var title = "Score Comparison"
  // var rtn = chartScoreComparison     (title, rounds, myStatsRng, endRow)        
  
  // var title = "Driving Accuracy"
  // var rtn = driveAccuracy            (title, rounds, myStatsRng, endRow)        
  
  var title = "Lifetime"
  var rtn = lifeTime                  (title, rounds)        
  console.log( rtn)
  rptArr.push(rtn)


  var x = $("#tblStats").clone();
  $("#statsContainer").empty()
  x.appendTo("#statsContainer");
  $("#tblStats").hide()
  
  rptArr.forEach( rpt => {
    otherStats(rpt)
  })  

  gotoTab('Stats')
    
}

function otherStats(rpt) {

  var title = rpt.title
  var arrChart =  rpt.arrData
  var arrFormat = rpt.format
      
  var ele = $("#tblStats").clone().show();

  var hdr = arrChart[0].join('') == '' ? null : arrChart[0]
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
        
    ele.prepend( "<h3 class='w-100 text-center'>" + title + "</h3>")
    ele.append( "<hr class='w-100'>")

    ele.appendTo("#statsContainer");

}



async function btnStatSelectHtml(e) {


  var statExcludeSmallCourses = $('#statExcludeSmall').prop('checked')
  var statRng1                = $( "#selectStatsRng1" ).val()
  var statRng2                = $( "#selectStatsRng2" ).val()
  var statRng3                = $( "#selectStatsRng3" ).val()

  await updateOption('statOptions', {
                                  'statExcludeSmallCourses':   statExcludeSmallCourses ,
                                  'statRng1': statRng1,
                                  'statRng2': statRng2,
                                  'statRng3': statRng3
                                  })
                                  
                                  
  $("#btnStatMoreVert").click()
  
  btnShowStatsHtml()

}

async function btnStatsMoreVertHtml() {

  var statSelectOptions  = await readOption('statOptions') 
  $('#statExcludeSmall').prop('checked',  statSelectOptions.statExcludeSmallCourses )
  $( "#selectStatsRng1" ).val(statSelectOptions.statRng1)
  $( "#selectStatsRng2" ).val(statSelectOptions.statRng2)
  $( "#selectStatsRng3" ).val(statSelectOptions.statRng3)

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

function arrRound(arr, nbrDec, percent) {
  var multiplier = Math.pow(10, nbrDec || 0);
  
  arr.forEach(function(is) { 
    is.forEach( function (item, index, array) { 
      if (typeof item === 'number') {
//        array[index] = parseInt(Math.round(item * multiplier)) / multiplier;
        if (percent) {
          array[index] = Number((item* 100).toFixed(nbrDec))  + "%";
        }
        else {
          array[index] = Number((item).toFixed(nbrDec));
//          array[index] = array[index] * 100 + "%"
        }
      }
    }              
  ) } );  
    
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


  console.log(dataRngDescr)

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
      for (var i = 1; i < datePlayedArr.length; i++) {if (new Date(datePlayedArr[i]) >= oneYrAgo) {
        return i}
      }
      return datePlayedArr.length
      break;
    case "Past Month":
      var now = new Date();
      var oneMoAgo = new Date();
      oneMoAgo.setMonth(now.getMonth() - 1);
      for (var i = 1; i < datePlayedArr.length; i++) {if (new Date(datePlayedArr[i]) >= oneMoAgo) {
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

function chartAverageScorebyPar   (title, rounds, myStatsRng, endRow) {

  var scores1 = extrRndData	(rounds, 'scoreCard.scores', endRow.row1)
  var scores2 = extrRndData	(rounds, 'scoreCard.scores', endRow.row2)
  var scores3 = extrRndData	(rounds, 'scoreCard.scores', endRow.row3)

  console.log(scores1)
  console.log(scores2)
  console.log(scores3)

  const avgScrByPar = (scoreCardArr, holePar) => {
    arr = []
    scoreCardArr.forEach((scoreCard) => {
      var par = scoreCard.map(el => el.par)
      scoreCard.forEach((val, idx) => {
        if (par[idx]*1 == holePar*1) {
          arr.push(val.score*1)
        }
      })
    })

    return arr

  }    

  var rtn = [
    [
    '', 
    myStatsRng.rng1, 
    myStatsRng.rng2, 
    myStatsRng.rng3
    ],
    
    [
    "Par 3",
    avgArr(avgScrByPar(scores1, 3)),
    avgArr(avgScrByPar(scores2, 3)),
    avgArr(avgScrByPar(scores3, 3))
    ],
      
    [
    "Par 4",
    avgArr(avgScrByPar(scores1, 4)),
    avgArr(avgScrByPar(scores2, 4)),
    avgArr(avgScrByPar(scores3, 4))
    ],
      
    [  
    "Par 5",
    avgArr(avgScrByPar(scores1, 5)),
    avgArr(avgScrByPar(scores2, 5)),
    avgArr(avgScrByPar(scores3, 5))
     ]
    ]

    console.log(rtn)
    
    arrRound(rtn, 1)

    console.log(rtn)
    
    return {title: title, arrData:rtn, format:''};

}

function chartCourseAdjustedScore (title, rounds, myStatsRng, endRow)   {

  var adjScores1 = extrRndData	(rounds, 'objHandicap.courseAdjustedScore', endRow.row1)
  var adjScores2 = extrRndData	(rounds, 'objHandicap.courseAdjustedScore', endRow.row2)
  var adjScores3 = extrRndData	(rounds, 'objHandicap.courseAdjustedScore', endRow.row3)

  var hcps1 = extrRndData	(rounds, 'objHandicap.handicap', endRow.row1)
  var hcps2 = extrRndData	(rounds, 'objHandicap.handicap', endRow.row2)
  var hcps3 = extrRndData	(rounds, 'objHandicap.handicap', endRow.row3)

  console.log(adjScores1)
  console.log(adjScores2)
  console.log(adjScores3)

  var rtn = [
    [
    '', 
    myStatsRng.rng1, 
    myStatsRng.rng2, 
    myStatsRng.rng3
    ],
    
    [
    "Score",
    avgArr(adjScores1),
    avgArr(adjScores2),
    avgArr(adjScores3)
    ],
      
    [
    "Handicap",
    hcps1.pop(),
    hcps2.pop(),
    hcps3.pop()
    ]
    ]

    console.log(rtn)
    
    arrRound(rtn, 1)

    console.log(rtn)
    
    return {title: title, arrData:rtn, format:''};

}

function chartPutting (title, rounds, myStatsRng, endRow)   {

  var scores1 = extrRndData	(rounds, 'scoreCard.scores', endRow.row1)
  var scores2 = extrRndData	(rounds, 'scoreCard.scores', endRow.row2)
  var scores3 = extrRndData	(rounds, 'scoreCard.scores', endRow.row3)

  const puttsPerRound = (scoreCardArr) => {
    arr = []
    scoreCardArr.forEach((scoreCard) => {
      var nbrHoles = scoreCard.length
      var nbrPutts = 0
      scoreCard.forEach((val, idx) => {
        nbrPutts += val.putts*1
      })
      arr.push(nbrPutts * 18 / nbrHoles)
    })
    return arr
  }    

  const puttsPerHole = (scoreCardArr) => {
    arr = []
    scoreCardArr.forEach((scoreCard) => {
      var nbrHoles = scoreCard.length
      var nbrPutts = 0
      scoreCard.forEach((val, idx) => {
        nbrPutts += val.putts*1
      })
      arr.push(nbrPutts / nbrHoles)
    })
    return arr
  }    

  const puttsPerGIR = (scoreCardArr) => {
    arr = []
    scoreCardArr.forEach((scoreCard) => {
      var nbrHoles = 0
      var nbrPutts = 0
      scoreCard.forEach((val, idx) => {
        if (val.score - val.putts <= val.par - 2) {
          nbrPutts += val.putts*1
          nbrHoles++
        }
      })
      arr.push(nbrPutts / nbrHoles)
    })
    return arr
  }    

  const puttsPerGIRPlusOne = (scoreCardArr) => {
    arr = []
    scoreCardArr.forEach((scoreCard) => {
      var nbrHoles = 0
      var nbrPutts = 0
      scoreCard.forEach((val, idx) => {
        if (val.score - val.putts <= val.par - 1) {
          nbrPutts += val.putts*1
          nbrHoles++
        }
      })
      arr.push(nbrPutts / nbrHoles)
    })
    return arr
  }    

  const xPuttsPerRound = (scoreCardArr, x) => {
    arr = []
    scoreCardArr.forEach((scoreCard) => {
      var nbrHoles = scoreCard.length
      var nbrPutts = 0
      scoreCard.forEach((val, idx) => {
        if (val.putts*1 == x) {
          nbrPutts++
        }
      })
      arr.push(nbrPutts * 18 / nbrHoles)
     })
    return arr
  }    

  var rtn = [
    [
    '', 
    myStatsRng.rng1, 
    myStatsRng.rng2, 
    myStatsRng.rng3
    ],
    
    [
    "Putts",
    avgArr(puttsPerRound(scores1)),
    avgArr(puttsPerRound(scores2)),
    avgArr(puttsPerRound(scores3))
    ],
      
    [
    "Putts / Hole",
    avgArr(puttsPerHole(scores1)),
    avgArr(puttsPerHole(scores2)),
    avgArr(puttsPerHole(scores3))
    ],
      
    [
    "Putts / GIR",
    avgArr(puttsPerGIR(scores1)),
    avgArr(puttsPerGIR(scores2)),
    avgArr(puttsPerGIR(scores3))
    ],
    [  
    "Putts / GIR+1",
    avgArr(puttsPerGIRPlusOne(scores1)),
    avgArr(puttsPerGIRPlusOne(scores2)),
    avgArr(puttsPerGIRPlusOne(scores3))
    ],
    [
    "1 Putts",
    avgArr(xPuttsPerRound(scores1, 1)),
    avgArr(xPuttsPerRound(scores2, 1)),
    avgArr(xPuttsPerRound(scores3, 1))
    ],
    [
    "3 Putts",
    avgArr(xPuttsPerRound(scores1, 3)),
    avgArr(xPuttsPerRound(scores2, 3)),
    avgArr(xPuttsPerRound(scores3, 3))
    ]    
    ]

console.log('hi dan')    
console.log(rtn)
    arrRound(rtn, 1)

    console.log(title)
    console.log(rtn)
    
    return {title: title, arrData:rtn, format:''};

}

function chartTeeToGreen          (title, rounds, myStatsRng, endRow) {







}

function lifeTime               (title, rounds) {

  var arr = []

  var nbrRounds = rounds.length

  var nbrHoles = 0
    rounds.forEach((rnd) => {
      var scorecard = JSON.parse(rnd.scoreCard)
      nbrHoles += scorecard.scores.length
     })


  var distance = Math.round(nbrHoles * .33)

    var lastDate = new Date(rounds[0]['startTime'])
    var frstDate = new Date(rounds[rounds.length-1]['endTime'])
    var difdt = frstDate - lastDate;

    var difdtInYrs = difdt / (1000*60*60*24*365)
    var years = Math.floor(difdtInYrs)
    var months = Math.floor((difdtInYrs - years) * 365 / 30)
    var days = Math.round((difdt - years * (1000*60*60*24*365) - months * (1000*60*60*24*30)) / (1000*60*60*24))
  var totTime =  years + "Y " + months + "M " + days + "D"

    var totPlayTime = 0
    rounds.forEach((rnd) => {
      var pt = new Date(rnd.endTime) - new Date(rnd.startTime)

      if (pt < 1000*60*60) {
        var scorecard = JSON.parse(rnd.scoreCard)
        pt = scorecard.scores.length * 15*60*1000
      }
      totPlayTime += pt    
    })

    var days = Math.floor(totPlayTime / (1000*60*60*24))
    var hours = Math.floor((totPlayTime - days * (1000*60*60*24)) / (1000*60*60))
    var minutes = Math.round((totPlayTime - days * (1000*60*60*24) - hours * (1000*60*60)) / (1000*60))
  var playTime =  days + "D " + hours + "H " + minutes + "M"
  
  
  var roundsPerYr = Math.round(nbrRounds / difdtInYrs)
  
  var strokes = 0
  var putts = 0
  var penaltyStrokes = 0
  var bunkers = 0
    rounds.forEach((rnd) => {
      var scorecard = JSON.parse(rnd.scoreCard)
      scorecard.scores.forEach( (val) => {
        strokes += val.score*1
        putts += val.putts*1
        penaltyStrokes += val.pnlty*1
        bunkers += val.sand.toUpperCase() == 'YES' ? 1 : 0
      })
    })

    var playTimeMinutes = calcPlayTimeMinutes(playTime)
    var minutesPerStoke = Math.round(playTimeMinutes / (strokes - penaltyStrokes))  

    var scoringSummary = calcScoringSummary(rounds)
    arr.push(['',''])
    arr.push(['Rounds', formatNumber(nbrRounds)])
    arr.push(['Elapsed Time', totTime])
    arr.push(['Rounds Per Year', roundsPerYr])
    arr.push(['Play Time', playTime])
    arr.push(['Distance', formatNumber(distance)])

    for (const key of Object.keys(scoringSummary)) {
      arr.push([key, formatNumber(scoringSummary[key]*1)])
    }
            
    arr.push(['Strokes', formatNumber(strokes)])
    arr.push(['Putts', formatNumber(putts)])
    arr.push(['Penalty Strokes', formatNumber(penaltyStrokes)])
    arr.push(['Bunkers', formatNumber(bunkers)])
    arr.push(['Minutes per Stroke', minutesPerStoke])


    return {title: title, arrData:arr, format:''};

}

function calcPlayTimeMinutes(strPT) {
  
  var x = strPT.split("D ")
  var days = x[0]*1
  var y = x[1].split("H ")
  var hrs = y[0]*1
  var z = y[1].split("M")
  var mins = z[0]*1
  
  return days*24*60 + hrs*60 + mins

}

function calcScoringSummary(rounds) {

  var s = {
   
    Eagles:0,
    Birdies:0,
    Pars:0,
    Bogeys:0,
    'Dbl Bogeys':0,
    'Over Dbl Bogeys':0
  }
  
  rounds.forEach((rnd) => {
    var scorecard = JSON.parse(rnd.scoreCard)
    scorecard.scores.forEach( val => {
      var wrtp = val.score - val.par

      switch(true) {

        case wrtp < -1:
          s.Eagles++
          break;
        case wrtp < 0:
          s.Birdies++
          break;
        case wrtp < 1:
          s.Pars++
          break;
        case wrtp < 2:
          s.Bogeys++
          break;
        case wrtp < 3:
          s['Dbl Bogeys']++
          break;
        default:
          s['Over Dbl Bogeys']++
          break;

      }

    })
  })

  return s

}