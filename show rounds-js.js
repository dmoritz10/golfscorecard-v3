

async function btnShowRoundsHtml() {


  var srSelectOptions  = readOption('srFilter')

  var srExcludeSmall   = srSelectOptions.srExcludeSmall
  var srMadeTarget     = srSelectOptions.srMadeTarget
  var srSelectedCourse = srSelectOptions.srSelectedCourse
  
  var hcpMethod        = srSelectOptions.hcpMethod
  
   var rounds = await getRounds(srExcludeSmall)
   
   console.log('rounds')
    console.log(rounds.length)
    
    var x = $("#tblShowRounds").clone();
    $("#srContainer").empty()
    x.appendTo("#srContainer");
    
    $("#tblShowRounds").hide()
    
    var rndCntr = 0
    
    for (var j = rounds.length - 1; j > -1; j--) {
    
      var ele = $("#tblShowRounds").clone();
      
      var roundObj = rounds[j]
      
      var sc = JSON.parse(roundObj.scoreCard)
      var ci = JSON.parse(roundObj.courseInfo)
      var objHandicap = roundObj.objHandicap      
      var objTargetScore = objHandicap.targetScore

      if (         
          (srMadeTarget && roundObj.finalScore > objTargetScore.score ) ||
          (srSelectedCourse && srSelectedCourse !== shortCourseName(roundObj.courseName.toString()))
        )
          continue;
  
      var datePlayed = new Date(roundObj.startTime).toString().substring(0,15)
      
      ele.find('#srSeqNbr')[0].innerHTML = rounds.length-j
      ele.find('#srScore')[0].innerHTML = roundObj.finalScore.toString()
      ele.find('#srCourseName')[0].innerHTML = shortCourseName(roundObj.courseName.toString())
      ele.find('#srDate')[0].innerHTML = datePlayed
      ele.find('#srTees')[0].innerHTML = roundObj.tee
      
      ele.find('#srTargetScore')[0].innerHTML = objTargetScore.score
      ele.find('#srPutts')[0].innerHTML = $.sum (sc.scores, 'putts')
      ele.find('#srFairways')[0].innerHTML = $.fairwaysHit(sc.scores).replace(/ /g,'')
      
      var cntr = 0
      sc.scores.map((val, idx) => {if (val) {if (val.score - val.putts <= val.par - 2) cntr++;}});
      ele.find('#srGIR')[0].innerHTML = cntr
      
      var slopeRating = ci.courseInfo['Slope Rating']
      var courseRating = ci.courseInfo['USGA Course Rating']
      var courseHandicap = objHandicap.courseHandicap
      
      var hcpDiff = objHandicap.handicapDiff
      var escCorrections = objHandicap.escCorrections



      ele.find('#srHcpDiff')[0].innerHTML = escCorrections ? hcpDiff + '<sup>' + escCorrections + '</sup>' : hcpDiff
            
      if (roundObj.finalScore*1 <= objTargetScore.score ) {
      
        ele.css( "background", "Khaki")
      
      } else {
      
        ele.css( "background", "white")
      
      }
      
      ele.find('#srFetchRound')[0].setAttribute("onclick", "showRoundDetail(" + j + ", 'ShowRounds')");
      
      
      ele.show()
      
      ele.appendTo("#srContainer");
      
      rndCntr++
    
    }
    
    var nbrRounds = JSON.parse(arrOptions.Lifetime).nbrRounds
    
    if (nbrRounds == rndCntr) 
    
      {$ ('#srNbrRounds').html(nbrRounds)}
      
    else 
    
     { $ ('#srNbrRounds').html(rndCntr + ' of ' + nbrRounds)}
    
    
    gotoTab('ShowRounds')
    
}

async function showRoundDetail (rowIdx, rtnTo) {

  var range = "'Scorecard Upload'!" + calcRngA1(rowIdx + 2, 1, 1, 100)
  
  await checkAuth()
  
  await gapi.client.sheets.spreadsheets.values.get({spreadsheetId: spreadsheetId, range: range})
  .then(function(response) {
  
    var cols = suSht['Scorecard Upload'].colHdrs
    var round = response.result.values[0]
    var roundObj = makeObj(round, cols)
    
    prCourse = JSON.parse(roundObj.courseInfo)
    prScore = JSON.parse(roundObj.scoreCard)
    
    RSCalledFrom = rtnTo
    btnRoundStatsHtml()

  })

}


async function btnSRMoreVertHtml() {

  var srSelectOptions  = await readOption('srFilter') 
  $('#srExcludeSmall').prop('checked',  srSelectOptions.srExcludeSmall )
  $('#srMadeTarget').prop('checked',  srSelectOptions.srMadeTarget  )
  loadCoursesSelect('srSelectCourse')

}

async function btnSRSelectHtml(e) {
  
  var srExcludeSmallVal     = $('#srExcludeSmall').prop('checked')
  var srMadeTargetVal       = $('#srMadeTarget').prop('checked')
  var srSelectedCourseVal   = $( "#srSelectCourse" ).val() > -1 ? $( "#srSelectCourse option:selected" ).text() : false

  await updateOption('srFilter', {
                                  'srExcludeSmall':   srExcludeSmallVal ,
                                  'srSelectedCourse': srSelectedCourseVal ,
                                  'srMadeTarget':     srMadeTargetVal
                                  })
                                  
                                  
  $("#btnSRMoreVert").click()
  
  btnShowRoundsHtml()

}


//  May need the following to redo database


function getsxsRounds (rowIdx) {
/*
console.log('prScore')
console.log(JSON.stringify(prScore))

console.log('prCourse')
console.log(JSON.stringify(prCourse))
*/
    var clientId = arrOptions.mySwingBySwingClientId
    var myPlayerId = arrOptions.mySwingBySwingId
    
    var getAllRoundsReq = "https://api.swingbyswing.com/v2/players/" + myPlayerId + 
                                   "/rounds?from=1&limit=" + 
                                   "5" + "&access_token=" + clientId
    
    var request = new XMLHttpRequest()
    
    request.open('GET', getAllRoundsReq, true)
    
    request.onload = function() {
    
      var data = JSON.parse(request.response)
      
      if (request.status >= 200 && request.status < 400) {
      
        var rounds = data.rounds
        getSxsRounds(rounds)
      
      
      } else {
      
        console.log('error' + request.status)
        
      }
    }

    request.send()
  
}

function getSxsRounds(rounds) {


  rounds.forEach((val,idx, arr) => {
  
    var request = new XMLHttpRequest()
    var clientId = arrOptions.mySwingBySwingClientId
    var myPlayerId = arrOptions.mySwingBySwingId
    
    var getRoundReq = "https://api.swingbyswing.com/v2/rounds/" + val.id + 
                                   "?includes=scorecards,course&access_token=" + clientId
    
    
    request.open('GET', getRoundReq, true)
    
    request.onload = function() {
    var data = JSON.parse(request.response)

      if (request.status >= 200 && request.status < 400) {
     
      } else {
      
        console.log('error' + request.status)
        
      }
    }

    request.send()
    
    
    })
  

}

function loadCoursesSelect(selectCourse) {

  var srSelectOptions  = readOption('srFilter')
  var srSelectedCourse = srSelectOptions.srSelectedCourse


    courses =  arrShts['My Courses'].vals
          
    var s = document.getElementById(selectCourse)
    $('option', s).remove();
    $('<option/>').val(-1).text('Select Course').appendTo(s)
    var courseIdx
        
    for (var j = 0; j < courses.length; ++j) {
        
      var courseName = courses[j][0].toString()
      var shortName = shortCourseName(courseName)
          
      if (shortName == srSelectedCourse) courseIdx = j + 1
      
      $('<option/>').val(j).text(shortName).appendTo(s)
        
   }
   
   if (courseIdx) s.selectedIndex = courseIdx; 

}

