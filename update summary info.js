function updateSummaryInfo() {

    var hcpSelectOptions = readOption('hcpFilter')
    var hcpMethod = hcpSelectOptions.hcpMethod
  
    var rounds = await getRounds()
    var hcpArr = []
    var nbrRounds = 0

    
    for (var j = rounds.length - 1; j > -1; j--) {
    
      var roundObj = rounds[j]
        
      var sc = JSON.parse(roundObj.scoreCard)
      var ci = JSON.parse(roundObj.courseInfo)
      var objHandicap = roundObj.objHandicap      
      var objTargetScore = objHandicap.targetScore
              
      var dtPlayed = new Date(roundObj.startTime).toString().substring(0,15)
     
      hcpArr.push({
        
        shortCourseName: shortCourseName(roundObj.courseName.toString()),
        datePlayed: dtPlayed,
        teePlayed: roundObj.tee,
        score: roundObj.finalScore.toString(),
        targetScore: objTargetScore.score,
        courseRating: ci.courseInfo['USGA Course Rating'],
        slopeRating: ci.courseInfo['Slope Rating'],
        courseHandicap: objHandicap.courseHandicap,
        hcpDiff: objHandicap.handicapDiff,
        escCorrections: objHandicap.escCorrections,
        rowIdx: j,
        arrIdx: nbrRounds,
        hcp: objHandicap.handicap
        
      })
        
      nbrRounds++
        
    }
      
  




}