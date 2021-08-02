{/* <script> */}

function goHome() {
  
  var hcpObj = readOption('handicapObj', 'hi dan')

  $('#hmCurrHandicap').html(hcpObj.currHandicap).toFixed(1)
  $('#hmNbrRounds').html(hcpObj.nbrRounds)

  gotoTab('Home')

}
// </script>