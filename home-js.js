{/* <script> */}

function goHome() {
  
  var hcpObj = readOption('handicapObj', 'hi dan')

  $('#hmCurrHandicap').html(hcpObj.currHandicap)
  $('#hmNbrRounds').html(hcpObj.nbrRounds)

  gotoTab('Home')

}
// </script>