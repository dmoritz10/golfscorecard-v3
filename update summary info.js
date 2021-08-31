
function madeTargetScore(targetScore, finalScore) {

  if (isNaN(targetScore)) return false

  if (finalScore*1 <= targetScore*1) return true
  
  return false

}

function calcTargetScoreDan(mostRecent20HcpDiff, targetHandicap, courseRating, slopeRating, courseRatingFront9) {

  var hcpSelectOptions = readOption('hcpFilter')
  var hcpMethod = hcpSelectOptions.hcpMethod

  var mostRecent19 = JSON.parse(JSON.stringify(mostRecent20HcpDiff))
  
  mostRecent19.pop()

  var nbrToUse = calcNbrToUse(mostRecent20HcpDiff)
  
  var hcpNbrRounds = hcpMethod == 'WHS' ? 8 : 10
  
  nbrToUse = Math.min(nbrToUse, hcpNbrRounds)

  if (nbrToUse > 0 && mostRecent19.length > 0) {
      mostRecent19.sort(compareNumbers)

      var lowScores = []
      var cnt = 0
      var sum = 0
      for (var i = 0; i < nbrToUse - 1; i++) {
          cnt++
          sum = sum + mostRecent19[i] * 1.0
          lowScores.push(mostRecent19[i])
      }
      //  handicap = (sum * 0.96  / cnt)
      //  (handicap - .1) = ((sum + thd) * .96) / (cnt + 1)
      //  ((sum + thd) * .96) = (handicap - .1) * (cnt + 1)
      //  thd = (((handicap - .1) * (cnt + 1)) / .96 ) - sum)
    
    var targetHandicapDiff = ((targetHandicap * (cnt + 1)) / .96) - sum
  
  } else {
    
    var targetHandicapDiff = ''
  }

  var tsObj = calcRoundsTargetScore(targetHandicapDiff, courseRating, slopeRating, courseRatingFront9) 

  return {
        score           : tsObj.score,
        scoreFront      : tsObj.front,
        scoreBack       : tsObj.back,
        scoreFmt        : tsObj.score + ' ... ' + tsObj.front + ' / ' + tsObj.back
	}

}
