<script>

function btnAuthHtml() {

    gapi.auth2.getAuthInstance().signIn();
    
}
    
function btnSignoutHtml() {

     gapi.auth2.getAuthInstance().signOut();
    
}
       
</script>