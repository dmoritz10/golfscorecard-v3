{/* <script> */}

function goHome(x) {
  
  var currHandicap = readOption('handicapObj').currHandicap

  $('#hmCurrHandicap').html(currHandicap)
  $('#hmNbrRounds').html(JSON.parse(arrOptions.Lifetime).nbrRounds)

  gotoTab('Home')

}
// </script>