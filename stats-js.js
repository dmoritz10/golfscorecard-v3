
async function btnShowStatsHtml() {

  var statOptions  = readOption('statOptions')

  var statExcludeSmall = statOptions.statExcludeSmallCourses
  var statRng1 = statOptions.statRng1
  var statRng2 = statOptions.statRng2
  var statRng3 = statOptions.statRng3

  var rounds = await getRounds(statExcludeSmall)

  if (!rounds) return

  var datePlayedArr = rounds.map(x => x['date'])

  var endRow = {}
    endRow['row1'] = getEndRow(datePlayedArr, statRng1)
    endRow['row2'] = getEndRow(datePlayedArr, statRng2)
    endRow['row3'] = getEndRow(datePlayedArr, statRng3)

  setDropdownValues(datePlayedArr, endRow)


  var myStatsRng = {};
    myStatsRng['rng1'] = statRng1
    myStatsRng['rng2'] = statRng2
    myStatsRng['rng3'] = statRng3

  var rptArr = []

    var title = "Course Adjusted Score"
    var rtn = chartCourseAdjustedScore (title, rounds, myStatsRng, endRow)   
  rptArr.push(rtn)
   
    var title = "Average Score by Par"
    var rtn = chartAverageScorebyPar   (title, rounds, myStatsRng, endRow)
  rptArr.push(rtn)
  
    var title = "Putting"
    var rtn = chartPutting             (title, rounds, myStatsRng, endRow)        
  rptArr.push(rtn)
   
  var title = "Score Comparison"
  var rtn = chartScoreComparison     (title, rounds, myStatsRng, endRow)        
rptArr.push(rtn)
  
  var title = "Tee to Green"
  var rtn = chartTeeToGreen          (title, rounds, myStatsRng, endRow)        
rptArr.push(rtn)    

  var title = "Driving Accuracy"
  var rtn = driveAccuracy            (title, rounds, myStatsRng, endRow)        
rptArr.push(rtn)    

  var title = "Lifetime"
  var rtn = lifeTime                  (title, rounds)        
rptArr.push(rtn.rounds)

var title = null 
rptArr.push(rtn.holes)

var title = null    
rptArr.push(rtn.strokes)


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
  var arrData =  rpt.arrData
  var chart = rpt.chart
  var arrFormat = rpt.format
      
  var ele = $("#tblStats").clone().show();

  var hdr = arrData[0].join('') == '' ? null : arrData[0]
  arrData.shift() 
      
  arrData.forEach((currentValue, index, array) => {
      
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
      .setTableHeaderClass('text-right  bg-white')
      .setData(arrData)
      .setTableClass('table')
      .setTrClass()
      .setTcClass(['', 'text-right', 'text-right', 'text-right'])
      .setTdClass('py-0 border-0 h5')
      .build(ele);
        
    if (title) {
      ele.prepend( "<h2 class='w-100 text-center'>" + title + "</h2>")
      if (title !== 'Lifetime') ele.append( "<hr class='w-100'>")
    }

    if (chart) {
      ele.append(chart)
      ele.append( "<hr class='w-100'>")
    }

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

function setDropdownValues(datePlayedArr, endRow) {

  var nbrRnds = datePlayedArr.length

  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

  $( "#disStatsDate1" ).html(new Date(datePlayedArr[endRow.row1]).toLocaleString('en-US', options))
  $( "#disNbrRnds1" ).html(nbrRnds - endRow.row1)

  $( "#disStatsDate2" ).html(new Date(datePlayedArr[endRow.row2]).toLocaleString('en-US', options))
  $( "#disNbrRnds2" ).html(nbrRnds - endRow.row2)

  $( "#disStatsDate3" ).html(new Date(datePlayedArr[endRow.row3]).toLocaleString('en-US', options))
  $( "#disNbrRnds3" ).html(nbrRnds - endRow.row3)

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
function extrRndData	(rounds, colName, endRow) {

	// rounds, 
	// 'courseInfo.courseName', 'scorecard.putts', 'objHandicap.courseAdjustedScore', 'finalScore'
	// nbrRows

  if (colName) {var parseCol = colName.split('.')}

  var rtn = []

  for (var i = rounds.length - 1; i >= endRow; i--) {

    var rnd = rounds[i]

    if (colName) {
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

  } else {

    rtn.push(rnd)

  }

  }
  return rtn
}

function getEndRow(datePlayedArr, dataRngDescr) {

  var nbrRnds = datePlayedArr.length

  switch (dataRngDescr) {
    case "This Round":
      return nbrRnds - 1
      break;
    case "Last 5 Rounds":
      return Math.min(Math.abs(nbrRnds - 5), nbrRnds)
      break;
    case "Last 10 Rounds":
      return Math.min(Math.abs(nbrRnds - 10), nbrRnds)
      break;
    case "Last 20 Rounds":
      return Math.min(Math.abs(nbrRnds - 20), nbrRnds)
      break;
    case "Last 25 Rounds":
      return Math.min(Math.abs(nbrRnds - 25), nbrRnds)
      break;
    case "Last 50 Rounds":
      return Math.min(Math.abs(nbrRnds - 50), nbrRnds)
      break;
    case "Last 100 Rounds":
      return Math.min(Math.abs(nbrRnds - 100), nbrRnds)
      break;
    case "Past Year":
      var now = new Date();
      var oneYrAgo = new Date();
      oneYrAgo.setFullYear(now.getFullYear() - 1);
      for (var i = 1; i < nbrRnds; i++) {if (new Date(datePlayedArr[i]) >= oneYrAgo) {
        return i}
      }
      return nbrRnds
      break;
    case "Past Month":
      var now = new Date();
      var oneMoAgo = new Date();
      oneMoAgo.setMonth(now.getMonth() - 1);
      for (var i = 1; i < nbrRnds; i++) {if (new Date(datePlayedArr[i]) >= oneMoAgo) {
        return i}
      }
      return nbrRnds
      break;
    case "All Time":
      return 0
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
    })
    .trim();
}

function chartAverageScorebyPar   (title, rounds, myStatsRng, endRow) {

  var scores1 = extrRndData	(rounds, 'scoreCard.scores', endRow.row1)
  var scores2 = extrRndData	(rounds, 'scoreCard.scores', endRow.row2)
  var scores3 = extrRndData	(rounds, 'scoreCard.scores', endRow.row3)

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
      '<small>&nbsp;', 
      '<small>&nbsp;', 
      '<small>&nbsp;', 
      '<small>&nbsp;'
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

    arrRound(rtn, 1)

    var rounds3 = extrRndData	(rounds, null, endRow.row3)
    var chart = graphAvgScoreByPar(rounds3)
    
    return {title: title, arrData:rtn, chart: chart, format:''};
}

function chartCourseAdjustedScore (title, rounds, myStatsRng, endRow)   {

  var adjScores1 = extrRndData	(rounds, 'objHandicap.courseAdjustedScore', endRow.row1)
  var adjScores2 = extrRndData	(rounds, 'objHandicap.courseAdjustedScore', endRow.row2)
  var adjScores3 = extrRndData	(rounds, 'objHandicap.courseAdjustedScore', endRow.row3)

  var hcps1 = extrRndData	(rounds, 'objHandicap.handicap', endRow.row1)
  var hcps2 = extrRndData	(rounds, 'objHandicap.handicap', endRow.row2)
  var hcps3 = extrRndData	(rounds, 'objHandicap.handicap', endRow.row3)

  var rounds1 = extrRndData	(rounds, null, endRow.row1)
  var rounds2 = extrRndData	(rounds, null, endRow.row2)
  var rounds3 = extrRndData	(rounds, null, endRow.row3)


  const madeTargetScoreCnt = (scoreCardArr) => {
    var nbrMadeTarget = 0
    scoreCardArr.forEach((scoreCard) => {
      var scorecard = JSON.parse(scoreCard.scoreCard)
      var ci = JSON.parse(scoreCard.courseInfo)

      if (madeTargetScore(ci.courseInfo['Target Score'].split(' ')[0], scoreCard.finalScore)) nbrMadeTarget++

      })
    return nbrMadeTarget
  }    

  var rtn = [
    [
    '', 
    myStatsRng.rng1, 
    myStatsRng.rng2, 
    myStatsRng.rng3
    ],
    [
      '', 
      '<small>&nbsp;', 
      '<small>&nbsp;', 
      '<small>&nbsp;'
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
    ],
    [
    "Made Target",
    madeTargetScoreCnt(rounds1),
    madeTargetScoreCnt(rounds2),
    madeTargetScoreCnt(rounds3)
    ]
  
    ]

    arrRound(rtn, 1)

    var chart = graphRounds(rounds3)
    
    return {title: title, arrData:rtn, chart: chart, format:''};

}

function chartPutting (title, rounds, myStatsRng, endRow)   {

  var scores1 = extrRndData	(rounds, 'scoreCard.scores', endRow.row1)
  var scores2 = extrRndData	(rounds, 'scoreCard.scores', endRow.row2)
  var scores3 = extrRndData	(rounds, 'scoreCard.scores', endRow.row3)

  const puttsPerRound = (scoreCardArr) => {
    var arr = []

    scoreCardArr.forEach((scoreCard) => {
      var nbrPutts = 0
      scoreCard.forEach((val, idx) => {
        nbrPutts += val.putts*1
      })

      arr.push(nbrPutts)


    })

    return arr
  }    

  const puttsPerHole = (scoreCardArr) => {
    var arr = []
    scoreCardArr.forEach((scoreCard) => {
      var nbrHoles = scoreCard.length
      var nbrPutts = 0
      scoreCard.forEach((val, idx) => {
        nbrPutts += val.putts*1
      })
      if (nbrHoles>0) {arr.push(nbrPutts / nbrHoles)}
    })
    return arr
  }    

  const puttsPerGIR = (scoreCardArr) => {
    var arr = []
    scoreCardArr.forEach((scoreCard) => {
      var nbrHoles = 0
      var nbrPutts = 0
      scoreCard.forEach((val, idx) => {
        if (val.score*1 - val.putts*1 <= val.par*1 - 2) { 
          nbrPutts += val.putts*1
          nbrHoles++
        }
      })
      if (nbrHoles>0) {arr.push(nbrPutts / nbrHoles)}
    })

    return arr
  }    

  const puttsPerGIRPlusOne = (scoreCardArr) => {
    var arr = []
    scoreCardArr.forEach((scoreCard) => {
      var nbrHoles = 0
      var nbrPutts = 0
      scoreCard.forEach((val, idx) => {
        if (val.score*1 - val.putts*1 <= val.par*1 - 1) {
          nbrPutts += val.putts*1
          nbrHoles++
        }
      })
      if (nbrHoles>0) {arr.push(nbrPutts / nbrHoles)}
    })
    return arr
  }    

  const xPuttsPerRound = (scoreCardArr, x) => {
    var arr = []
    scoreCardArr.forEach((scoreCard) => {
      var nbrHoles = scoreCard.length
      var nbrPutts = 0
      scoreCard.forEach((val, idx) => {
        if (val.putts*1 == x) {
          nbrPutts++
        }
      })
      if (nbrHoles>0) {arr.push(nbrPutts / nbrHoles)}
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
      '<small>&nbsp;', 
      '<small>&nbsp;', 
      '<small>&nbsp;', 
      '<small>&nbsp;'
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

    arrRound(rtn, 1)
    
    return {title: title, arrData:rtn, format:''};

}

function chartScoreComparison (title, rounds, myStatsRng, endRow) {

  var rounds1 = extrRndData	(rounds, null, endRow.row1)
  var rounds2 = extrRndData	(rounds, null, endRow.row2)
  var rounds3 = extrRndData	(rounds, null, endRow.row3)

  var scoreSumm1 = calcScoringSummary(rounds1)
  var scoreSumm2 = calcScoringSummary(rounds2)
  var scoreSumm3 = calcScoringSummary(rounds3)

  var rtn = [
    [
    '', 
    myStatsRng.rng1, 
    myStatsRng.rng2, 
    myStatsRng.rng3
    ],
    [
      '', 
      '<small>&nbsp;', 
      '<small>&nbsp;', 
      '<small>&nbsp;'
      ],    
      
    [
    "Eagles",
    scoreSumm1["Eagles"]/rounds1.length,
    scoreSumm2["Eagles"]/rounds2.length,
    scoreSumm3["Eagles"]/rounds3.length
    ],
      
    [
    "Birdies",
    scoreSumm1["Birdies"]/rounds1.length,
    scoreSumm2["Birdies"]/rounds2.length,
    scoreSumm3["Birdies"]/rounds3.length
    ],
      
    [
    "Pars",
    scoreSumm1["Pars"]/rounds1.length,
    scoreSumm2["Pars"]/rounds2.length,
    scoreSumm3["Pars"]/rounds3.length
    ],
    [  
    "Bogeys",
    scoreSumm1["Bogeys"]/rounds1.length,
    scoreSumm2["Bogeys"]/rounds2.length,
    scoreSumm3["Bogeys"]/rounds3.length
    ],
    [
    "Dbl Bogeys",
    scoreSumm1["Dbl Bogeys"]/rounds1.length,
    scoreSumm2["Dbl Bogeys"]/rounds2.length,
    scoreSumm3["Dbl Bogeys"]/rounds3.length
    ],
    [
    "> Dbl Bogeys",
    scoreSumm1["Over Dbl Bogeys"]/rounds1.length,
    scoreSumm2["Over Dbl Bogeys"]/rounds2.length,
    scoreSumm3["Over Dbl Bogeys"]/rounds3.length

    ]    
    ]

    arrRound(rtn, 1)
    
    return {title: title, arrData:rtn, format:''};

}  

function chartTeeToGreen          (title, rounds, myStatsRng, endRow) {

  var scores1 = extrRndData	(rounds, 'scoreCard.scores', endRow.row1)
  var scores2 = extrRndData	(rounds, 'scoreCard.scores', endRow.row2)
  var scores3 = extrRndData	(rounds, 'scoreCard.scores', endRow.row3)

  const fairways = (scoreCardArr) => {
    arr = []
    var nbrNonPar3s = 0
    var nbrFairways = 0
    scoreCardArr.forEach((scoreCard) => {
      scoreCard.forEach((val, idx) => {
        if (val.par > 3) {
          nbrNonPar3s++
          if (val.drive == 'Str8') {
           nbrFairways++
          }
        }
      })     
    })
    return nbrFairways / nbrNonPar3s
  }    

  const GIRs = (scoreCardArr) => {
    arr = []
    var nbrGIRs = 0
    var nbrHoles = 0
    scoreCardArr.forEach((scoreCard) => {
      scoreCard.forEach((val, idx) => {
        nbrHoles++
        if (val.score - val.putts <= val.par - 2) {
          nbrGIRs++
        }
      })     
    })
    return nbrGIRs / nbrHoles
  }    

  const GIRPlus1 = (scoreCardArr) => {
    arr = []
    var nbrGIRs = 0
    var nbrHoles = 0
    scoreCardArr.forEach((scoreCard) => {
      scoreCard.forEach((val, idx) => {
        nbrHoles++
        if (val.score - val.putts <= val.par - 1) {
          nbrGIRs++
        }
      })     
    })
    return nbrGIRs / nbrHoles
  }    

  const scrambling = (scoreCardArr) => {
    arr = []
    var nbrscrmbls = 0
    var nbrHoles = 0
    scoreCardArr.forEach((scoreCard) => {
      scoreCard.forEach((val, idx) => {
        nbrHoles++
        if (!(val.score - val.putts <= val.par - 2) && (val.score <= val.par)) {
          nbrscrmbls++
        }
      })     
    })
    return nbrscrmbls / nbrHoles
  }    

  const sandSaves = (scoreCardArr) => {
    arr = []
    var sandSaves = 0
    var nbrHoles = 0
    scoreCardArr.forEach((scoreCard) => {
      scoreCard.forEach((val, idx) => {
        nbrHoles++
        if (val.sand.toUpperCase() == "YES" && (val.score <= val.par)) {
          sandSaves++
        }
      })     
    })
    return sandSaves / nbrHoles
  }    


  var rtn = [
    [
    '', 
    myStatsRng.rng1, 
    myStatsRng.rng2, 
    myStatsRng.rng3
    ],
    [
      '', 
      '<small>&nbsp;', 
      '<small>&nbsp;', 
      '<small>&nbsp;'
      ],    
      
    [
    "Fairways ",
    fairways(scores1),
    fairways(scores2),
    fairways(scores3)
    ],
    [
    "GIR",
    GIRs(scores1),
    GIRs(scores2),
    GIRs(scores3)
    ],
    [
    "GIR + 1",
    GIRPlus1(scores1),
    GIRPlus1(scores2),
    GIRPlus1(scores3)
    ],
    [
    "Scrambling",
    scrambling(scores1),
    scrambling(scores2),
    scrambling(scores3)

    ],
    [
    "Sand Saves",
    sandSaves(scores1),
    sandSaves(scores2),
    sandSaves(scores3)
    ]    
    ]

    arrRound(rtn, 0, 'percent')
    
    return {title: title, arrData:rtn, format:''};

}

function driveAccuracy            (title, rounds, myStatsRng, endRow)     {

  var rounds1 = extrRndData	(rounds, null, endRow.row1)
  var rounds2 = extrRndData	(rounds, null, endRow.row2)
  var rounds3 = extrRndData	(rounds, null, endRow.row3)

  var driveSumm1 = calcDrivingSummary(rounds1)
  var driveSumm2 = calcDrivingSummary(rounds2)
  var driveSumm3 = calcDrivingSummary(rounds3)

  var rtn = [
    [
    '', 
    myStatsRng.rng1, 
    myStatsRng.rng2, 
    myStatsRng.rng3
    ],
    [
    '', 
    '<small>&nbsp;', 
    '<small>&nbsp;', 
    '<small>&nbsp;'
    ],    
    [
    "Straight",
    driveSumm1["Str8"],
    driveSumm2["Str8"],
    driveSumm3["Str8"]
    ],
      
    [
    "Left",
    driveSumm1["Left"],
    driveSumm2["Left"],
    driveSumm3["Left"]
    ],
      
    [
    "Right",
    driveSumm1["Right"],
    driveSumm2["Right"],
    driveSumm3["Right"]
    ],
    [  
    "Chunk",
    driveSumm1["Chunk"],
    driveSumm2["Chunk"],
    driveSumm3["Chunk"]
    ],
    [
    "Top",
    driveSumm1["Top"],
    driveSumm2["Top"],
    driveSumm3["Top"]

    ]    
    ]

    arrRound(rtn, 0, 'percent')
    
    return {title: title, arrData:rtn, format:''};

}   


function lifeTime               (title, rounds) {


  var nbrRounds = rounds.length

  var nbrHoles = 0
  var nbrMadeTarget = 0

    rounds.forEach((rnd) => {

      var scorecard = JSON.parse(rnd.scoreCard)
      var ci = JSON.parse(rnd.courseInfo)

      nbrHoles += scorecard.scores.length

      if (madeTargetScore(ci.courseInfo['Target Score'].split(' ')[0], rnd.finalScore)) nbrMadeTarget++

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
  
  var holes = 0
  var strokes = 0
  var putts = 0
  var penaltyStrokes = 0
  var bunkers = 0
    rounds.forEach((rnd) => {
      var scorecard = JSON.parse(rnd.scoreCard)
      scorecard.scores.forEach( (val) => {
        if (val) {
          holes++
          strokes += val.score*1
          putts += val.putts*1
          penaltyStrokes += val.pnlty*1
          bunkers += val.sand.toUpperCase() == 'YES' ? 1 : 0
        }
      })
    })

    var playTimeMinutes = calcPlayTimeMinutes(playTime)
    var minutesPerStoke = Math.round(playTimeMinutes / (strokes - penaltyStrokes))  

    var scoringSummary = calcScoringSummary(rounds)

    var arrRtn = {}

    var arr = []

    arr.push(['<h5 class="text-left">Rounds','<h5>' + formatNumber(nbrRounds)])
    arr.push(['<small>&nbsp;', '<small>&nbsp;'])
    arr.push(['Made Target', formatNumber(nbrMadeTarget)])
    arr.push(['Elapsed Time', totTime])
    arr.push(['Rounds Per Year', roundsPerYr])
    arr.push(['Play Time', playTime])
    arr.push(['Distance', formatNumber(distance)])

    arrRtn.rounds = {title: title, arrData:JSON.parse(JSON.stringify(arr)), format:''};

    arr = []
  
    arr.push(['<h5 class="text-left">Holes','<h5>' + formatNumber(holes)])
    arr.push(['<small>&nbsp;', '<small>&nbsp;'])
    for (const key of Object.keys(scoringSummary)) {
      arr.push([key, formatNumber(scoringSummary[key]*1)])
    }

    // arrRtn.holes = JSON.parse(JSON.stringify(arr))
    arrRtn.holes = {title: null, arrData:JSON.parse(JSON.stringify(arr)), format:''};

    arr = []

    arr.push(['<h5 class="text-left">Strokes','<h5>' + formatNumber(strokes)])
    arr.push(['<small>&nbsp;', '<small>&nbsp;'])
    arr.push(['Putts', formatNumber(putts)])
    arr.push(['Penalty Strokes', formatNumber(penaltyStrokes)])
    arr.push(['Bunkers', formatNumber(bunkers)])
    arr.push(['Minutes per Stroke', minutesPerStoke])

    arrRtn.strokes = {title: null, arrData:JSON.parse(JSON.stringify(arr)), format:''};


    return arrRtn;

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
      if (val) {

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
    }
    })
  })

  return s

}


function calcDrivingSummary(rounds) {

  var s = {
   
    Str8:0,
    Left:0,
    Right:0,
    Chunk:0,
    Top:0  
  
  }
  
  var nbrHoles = 0
 
  rounds.forEach((rnd) => {
    var scorecard = JSON.parse(rnd.scoreCard)

    scorecard.scores.forEach( val => {

      if (val) {

      nbrHoles++
      var drv = val.drive

      switch(true) {

        case drv == 'Str8':
          s.Str8++
          break;
        case drv == 'Left':
          s.Left++
          break;
        case drv == 'Right':
          s.Right++
          break;
        case drv == 'Chunk':
          s.Chunk++
          break;
        case drv == 'Top':
          s.Top++
          break;
        default:
          s.Str8++
          break;

      }
    }
    })
  })

  s.Str8 = s.Str8 / nbrHoles
  s.Left = s.Left / nbrHoles
  s.Right = s.Right / nbrHoles
  s.Chunk = s.Chunk / nbrHoles
  s.Top = s.Top / nbrHoles  

  return s

}

function graphRounds(rounds) {

  var datePlayedArr = []
  var scoresArr = []
  var hcpArr = []
  var madeTargetArr = []

  for (let i=rounds.length - 1;i>-1;i--) {

    var ci = JSON.parse(rounds[i].courseInfo)
    var dt = new Date(rounds[i].startTime)
    var yr = dt.getFullYear()
    var mo = dt.getMonth() + 1
    var da = dt.getDate()


    var courseRating = ci.courseInfo['USGA Course Rating']*1
    var slopeRating = ci.courseInfo['Slope Rating']*1
    var courseAdjustedScore = (courseRating + ((rounds[i].finalScore*1 - courseRating) * 113 / slopeRating)).toFixed(1)
    
    datePlayedArr.push( yr + "-" + mo + "-" + da)
    scoresArr.push(courseAdjustedScore)
    hcpArr.push(rounds[i].objHandicap.handicap)
    madeTargetArr.push(madeTargetScore(ci.courseInfo['Target Score'].split(' ')[0], rounds[i].finalScore) ? 'green' : 'rgba(255,153,0,0.4)')
    
  }

  try {
    var parent = document.getElementById('casChartContainer');
    var child = document.getElementById('casChart');          
    parent.removeChild(child);            
    parent.innerHTML ='<canvas id="casChart" width="400" height="300" ></canvas>'; 
  } catch(e) {console.log(e)}
  
  var chart = new Chart(document.getElementById("casChart"), {
   
    data: {
      labels: datePlayedArr,
      datasets: [{
        label: 'Made Target',
        yAxisID: 'scoreId',
        backgroundColor: 'green'
      },{
        label: 'Score',
        yAxisID: 'scoreId',
        data: scoresArr,
        backgroundColor: madeTargetArr,
        type: 'bar'
      },
      {
        label: 'Handicap',
        yAxisID: 'hcpId',
        data: hcpArr,
        borderColor: 'red',
        borderWidth: 2,
        fontColor: 'lightblue',
        fontStyle: 'bold',
        pointRadius: 0,
        type: 'line'
      }
      ]
    },

    options: {
        scales: {
          
          scoreId: {
              type: 'linear',
              display: true,
              position: 'left',
              min: 70
            },
            hcpId: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                color: 'red'
              },
              min:10,
              max:20
            },
          
          xAxes: [{
            type: 'time',
            time: {
                parser: 'YYYY-MM',
                unit: 'month',
                displayFormats: {
                }
            },
            ticks: {
                source: 'data'
            }
          }]                     
        }
    }
});

  return parent

}

function graphAvgScoreByPar(rounds) {

  var datePlayedArr = []
  var par3Arr = []
  var par4Arr = []
  var par5Arr = []

  for (let i=rounds.length - 1;i>-1;i--) {

    var sc = JSON.parse(rounds[i].scoreCard).scores
    var dt = new Date(rounds[i].startTime)
    var yr = dt.getFullYear()
    var mo = dt.getMonth() + 1
    var da = dt.getDate()
    
    datePlayedArr.push( yr + "-" + mo + "-" + da)

    console.log(sc)

    var scr3 = 0
    var cnt3 = 0
    var cnt4 = 0
    var scr4 = 0
    var cnt5 = 0
    var scr5 = 0


      sc.forEach((val) => {

        var par = val.par*1

        switch(true) {
  
          case par == 3:
            scr3 += val.score*1
            cnt3++
            break;
          case par == 4:
            scr4 += val.score*1
            cnt4++
            break;
          case par == 5:
            scr5 += val.score*1
            cnt5++
            break;
  
        }

      })

      par3Arr.push(cnt3 ? scr3 / cnt3 : null)
      par4Arr.push(cnt4 ? scr4 / cnt4 : null)
      par5Arr.push(cnt5 ? scr5 / cnt5 : null)
    }


  try {
    var parent = document.getElementById('aspChartContainer');
    var child = document.getElementById('aspChart');          
    parent.removeChild(child);            
    parent.innerHTML ='<canvas id="aspChart" width="400" height="300" ></canvas>'; 
  } catch(e) {console.log(e)}
  
  var chart = new Chart(document.getElementById("aspChart"), {
   
    data: {
      labels: datePlayedArr,
      datasets: [{
        label: 'Par 3',
        yAxisID: 'yAxisId',
        data: par3Arr,
        borderColor: 'red',
        borderWidth: 2,
        pointRadius: 0,
        type: 'line'
      },
      {
        label: 'Par 4',
        yAxisID: 'yAxisId',
        data: par4Arr,
        borderColor: 'blue',
        borderWidth: 2,
        pointRadius: 0,
        
      cubicInterpolationMode: 'monotone',
      tension: 1.0,
        type: 'line'
      },
      {
        label: 'Par 5',
        yAxisID: 'yAxisId',
        data: par5Arr,
        borderColor: 'green',
        lineTension: 0.8,
        borderWidth: 2,
        pointRadius: 0,
        type: 'line'
      }
      ]
    },

    options: {
        
        scales: {
          
          yAxisId: {

            min: 1,
            max: 8

          },
          
          xAxes: [{
            type: 'time',
            time: {
                parser: 'YYYY-MM',
                unit: 'month',
                displayFormats: {
                }
            },
            ticks: {
                source: 'data'
            }
          }]                     
        }
    }
});

  return parent
  

}
