
async function btnShowHandicapHtml () {

  var hcpSelectOptions = readOption('hcpFilter')
  var hcpMethod = hcpSelectOptions.hcpMethod

  var rounds = await getRounds()

  if (!rounds) return

  var hcpArr = []
  var nbrRounds = 0
  
  for (var j = rounds.length - 1; j > -1; j--) {
  
    var roundObj = rounds[j]
      
    var sc = JSON.parse(roundObj.scoreCard)
    var ci = JSON.parse(roundObj.courseInfo)
    var objHandicap = roundObj.objHandicap      
    var objTargetScore = objHandicap.targetScore

    if (j == rounds.length - 1) {                 //  handicap info from most recent round
      
      handicapObj = {
        'mostRecent20HcpDiff': objHandicap.mostRecent20,
        'currHandicap': objHandicap.handicap,
        'nbrRounds': rounds.length
      }

      updateOption('handicapObj', handicapObj)

      console.log(handicapObj)

    }      
    var dtPlayed = new Date(roundObj.startTime).toString().substring(0,15)
   
    hcpArr.push({
      
      shortCourseName: shortCourseName(roundObj.courseName.toString()),
      datePlayed: dtPlayed,
      teePlayed: roundObj.tee,
      score: roundObj.finalScore.toString(),
      targetScore: ci.courseInfo['Target Score'],
      courseRating: ci.courseInfo['USGA Course Rating'],
      slopeRating: ci.courseInfo['Slope Rating'],
      courseHandicap: ci.courseInfo['Course Handicap'],
      hcpDiff: objHandicap.handicapDiff,
      escCorrections: objHandicap.escCorrections,
      rowIdx: roundObj.rowIdx,
      arrIdx: nbrRounds,
      hcp: objHandicap.handicap
      
    })
      
    nbrRounds++
      
  }
    
    
  if (nbrRounds < 5) {
  
    bootbox.alert ('5 are more rounds are required to calculated Handicap')  
    return
    
  }
  
  var hcpNbrRounds = hcpMethod == 'WHS' ? 8 : 10

  var frstIdx = 0
  var lastIdx = Math.min(hcpArr.length - 1, 19)
  
  var workArr = hcpArr.filter((val, idx) => idx >= frstIdx && idx <= lastIdx)
  
  workArr.sort((a, b) => (a.hcpDiff > b.hcpDiff) ? 1 : -1)
  
  var sum = 0
  var cnt = 0
  var arrHcpIdxs = []
  
  for (var j=0;j<workArr.length;j++) {

    if (j < hcpNbrRounds) {
  
      sum += workArr[j].hcpDiff
      arrHcpIdxs.push(workArr[j].arrIdx)
      cnt++
    
    } else  break;
  
  }
    
  var hcpAlert

  if (arrHcpIdxs.indexOf(19) > -1) {                             // the 20th round was used to calc hcp
    
    hcpAlert = true;

    var idxOf11th = workArr[j].arrIdx                            // j is an artifact of the loop above
    var hcpDiffOf11th = workArr[j].hcpDiff
    var hcpDiffOf10th = hcpArr[19].hcpDiff

    sum -= hcpDiffOf10th                                         // the last round processed is the most recent round     
    sum += hcpDiffOf11th                                  

    var handicapAlert = parseInt(sum * 0.96 * 10 / cnt) / 10     // calc the hcp as if the 20th round was replaced with the 11th ranked by Hcp Diff
   
  }

  var x = $("#tblShowHCP").clone();
  $("#hcpContainer").empty();
  x.appendTo("#hcpContainer");
  $("#tblShowHCP").hide()

  for (var j = 0; j < hcpArr.length; j++) {
  
    var val = hcpArr[j]
      
    var ele = $("#tblShowHCP").clone();

    ele.find('#hcpScore')[0].innerHTML = val.score
    ele.find('#hcpCourseName')[0].innerHTML = val.shortCourseName
    ele.find('#hcpDate')[0].innerHTML = val.datePlayed
    ele.find('#hcpTees')[0].innerHTML = val.teePlayed
    ele.find('#hcpTargetScore')[0].innerHTML = val.targetScore.split(' ')[0]
    ele.find('#hcpCourseRating')[0].innerHTML = val.courseRating.toFixed(1)
    ele.find('#hcpSlopeRating')[0].innerHTML = val.slopeRating
    ele.find('#hcpHcpDiff')[0].innerHTML = val.escCorrections ? val.hcpDiff + '<sup>' + val.escCorrections + '</sup>' : val.hcpDiff
    ele.find('#hcpHcp')[0].innerHTML = val.hcp
  
    ele.find('#hcpFetchRound')[0].setAttribute("onclick", "showRoundDetail(" + val.rowIdx + ", 'ShowHCP')");
    
          
    if (arrHcpIdxs.indexOf(j) > -1) {       // highlight the rows that were used in the hcp of the most recent round
      ele.css( "background", "#f5edcb")
      ele.find('#hcpSeqNbr')[0].innerHTML = arrHcpIdxs.indexOf(j) + 1
    } else {
      ele.css( "background", "white")
      ele.find('#hcpSeqNbr')[0].innerHTML = ''
    }
    
    if (hcpAlert && j == idxOf11th) {
      ele.css( "background", "#acdb9e")      
      ele.find('#hcpSeqNbr')[0].innerHTML = hcpMethod == 'WHS' ? 9 : 11
  }
    
    ele.show()
    
    ele.appendTo("#hcpContainer");
    
    if (j>18) break;
  
  }
  
  displayHcpTrend(hcpArr, handicapAlert)

  gotoTab('ShowHCP')

  if (rounds.length !== sumNbrRoundsPlayed()) {

    courseSummary(rounds)

  }

}

function sumNbrRoundsPlayed() {

  var cols = arrShts['My Courses'].colHdrs
  var courses = arrShts['My Courses'].vals

  var col = cols.indexOf('Nbr Times Played')
  var sum = courses.reduce((a, b) => a + b[col]*1, 0)

}

function displayHcpTrend(hcpArr, handicapAlert) {

  var hcpAlertTxt = handicapAlert ? '<i class="material-icons">trending_up</i>' + handicapAlert : ''
  
  if (hcpArr.length > 0) {
    $ ('#hcpHcp1').html(hcpArr[0].hcp.toFixed(1) + hcpAlertTxt)
    $ ('#hcpHcpTime1').html('Current')
  }

  if (hcpArr.length > 9) {
    $ ('#hcpHcp2').html(hcpArr[9].hcp.toFixed(1))
    $ ('#hcpHcpTime2').html('Last 10 Rounds')
  }

  if (hcpArr.length > 19) {
    $ ('#hcpHcp3').html(hcpArr[19].hcp.toFixed(1))
    $ ('#hcpHcpTime3').html('Last 20 Rounds')
  }
  
}

function displayHcpHist(handicap) {                                                // replaced by displayHcpTrend

  var hcpOption = readOption('Course Adjusted Score').arrData
  
  $ ('#hcpHcp1').html(handicap)
  $ ('#hcpHcp2').html(hcpOption[2][2])
  $ ('#hcpHcp3').html(hcpOption[2][3])
  
  $ ('#hcpHcpTime1').html('Current')
  $ ('#hcpHcpTime2').html(hcpOption[0][2])
  $ ('#hcpHcpTime3').html(hcpOption[0][3])

}


async function btnHCPMoreVertHtml() {

  var hcpSelectOptions  = readOption('hcpFilter')
  var hcpExcludeSmall   = hcpSelectOptions.hcpExcludeSmall
  var hcpMethod         = hcpSelectOptions.hcpMethod
  
  $('#hcpExcludeSmall').prop('checked',  hcpExcludeSmall )
  $("input[name='hcpMethod']").val([hcpMethod]);  

}

async function btnHCPSelectHtml(e) {
  
  var hcpExcludeSmallVal = $('#hcpExcludeSmall').prop('checked')
  var hcpMethodVal       = $("input[type='radio'][name='hcpMethod']:checked").val();

  await updateOption('hcpFilter', {
                                  'hcpExcludeSmall': hcpExcludeSmallVal,
                                  'hcpMethod': hcpMethodVal
                                  })
                      
  $("#btnHCPMoreVert").click()
  
  btnShowHandicapHtml()

}



function calcHandicapDifferential(sc, hcpMethod, slopeRating, courseRating, courseHandicap, holeDetail) {   

  var nbrHolesCorrection = 18 / sc.scores.filter(Boolean).length
  
  var equitableScoreControl = 0
  
  if (hcpMethod == 'USGA') {
  
  for (var i=0;i<sc.scores.length;i++) {
    
    var ecsMax = calcEcsMax(courseHandicap)
    
    
    if (!sc.scores[i]) continue; 
    
    if (ecsMax !== 0) {
      equitableScoreControl += Math.min(parseInt(sc.scores[i].score), ecsMax)
    } else {
      equitableScoreControl += Math.min(parseInt(sc.scores[i].score), parseInt(sc.scores[i].par) + 2)     // scratch golfer
    }
  }
  
  } else {
  
    var netParAdj = calcHcpAdj(courseHandicap, holeDetail)
    
    for (var i=0;i<sc.scores.length;i++) {
    
      if (!sc.scores[i]) continue; 
    
      equitableScoreControl += Math.min(sc.scores[i].score*1,sc.scores[i].par*1 + 2 - netParAdj[i][2])
  
    } 
  
  }
  
  var escCorrections = $.sum (sc.scores, 'score') - equitableScoreControl
   
  equitableScoreControl = equitableScoreControl * nbrHolesCorrection
  
  if (slopeRating !== '') {
    var result = Math.round((equitableScoreControl - courseRating) * 113 * 10 /  slopeRating) / 10
  } else {
    var result = ''
  } 
    return {hcpDiff:result, escCorrections: escCorrections}

}

function calcEcsMax(courseHandicap) {

  var ecsMax = 0
  switch (true) {
    case courseHandicap < 10:
      ecsMax = 0
      break;
    case courseHandicap < 20:
      ecsMax = 7
      break;
    case courseHandicap < 30:
      ecsMax = 8
      break;
    case courseHandicap < 40:
      ecsMax = 9
      break;
    default:
      ecsMax = 10
      break;
  }
  return ecsMax
}
