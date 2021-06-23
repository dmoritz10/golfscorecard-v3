{/* <script> */}

function goHome() {
  
  var hcpObj = readOption('handicapObj', 'hi dan')
  var currHandicap = hcpObj.currHandicap

  $('#hmCurrHandicap').html(currHandicap)
  $('#hmNbrRounds').html(JSON.parse(arrOptions.Lifetime).nbrRounds)

  gotoTab('Home')

}
// </script>