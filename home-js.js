{/* <script> */}

async function goHome() {

  var signinStatus = await gapi.auth2.getAuthInstance().isSignedIn.get()
  if (!signinStatus) gotoTab('Auth')
  
  var hcpObj = readOption('handicapObj')

  $('#hmCurrHandicap').html(hcpObj.currHandicap.toFixed(1))
  $('#hmNbrRounds').html(hcpObj.nbrRounds)

  gotoTab('Home')

}
// </script>