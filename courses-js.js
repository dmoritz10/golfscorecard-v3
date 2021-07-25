
async function btnShowCoursesHtml () {

  var rowCount = arrShts['My Courses'].rowCount - 1
  
  if (rowCount < 1) {
  
    bootbox.alert ('There are no courses to show')  
    return

  }
  
  var scOptions = readOption('scFilter')
  var scSelectLocal  = scOptions.scSelectLocal
  var scSelectPlayed = scOptions.scSelectPlayed
  var scExcludeSmall = scOptions.scExcludeSmall
  
  var scLocalCourses = readOption('scLocalCourses').split(',')

  var cols = arrShts['My Courses'].colHdrs
  var courses = arrShts['My Courses'].vals

    var x = $("#tblShowCourses").clone();
    $("#scContainer").empty();
    x.appendTo("#scContainer");
    

    $("#tblShowCourses").hide()
    
    var nbrCourses = 0
        
    for (var j = 0; j < courses.length; j++) {
    
      var coursesObj = makeObj(courses[j], cols)
      
      if (
          (scSelectLocal  && scLocalCourses.indexOf(coursesObj['City']) == -1 ) ||
          (scSelectPlayed && !coursesObj['Nbr Times Played'] ) ||
          (scExcludeSmall  && coursesObj['Par'] < 69 )
         ) continue;
    
      nbrCourses++
      
      var ele = $("#tblShowCourses").clone();

      var hcpObj = readOption('handicapObj')
      var tsObj = calcTargetScoreDan(hcpObj.mostRecent20HcpDiff, hcpObj.currHandicap *1 - .1, coursesObj['USGA Course Rating'], coursesObj['Slope Rating'], coursesObj['Front 9 Rating'])
      
      ele.find('#scTargetScore')[0].innerHTML = tsObj.score
      ele.find('#scCourseName')[0].innerHTML = shortCourseName(coursesObj['Course Name'].toString())
      ele.find('#scCityState')[0].innerHTML = coursesObj['City'].toString() + ', ' + coursesObj['State'].toString()
      
      ele.find('#scTees')[0].innerHTML = coursesObj['Tee Name']
      ele.find('#scCourseRating')[0].innerHTML = coursesObj['USGA Course Rating']
      ele.find('#scSlopeRating')[0].innerHTML = coursesObj['Slope Rating']
      ele.find('#scCourseHandicap')[0].innerHTML = Math.round((coursesObj['Slope Rating'] * hcpObj.currHandicap*1) / 113)

      ele.find('#scTimesPlayed')[0].innerHTML = coursesObj['Nbr Times Played'] > 0 ? coursesObj['Nbr Times Played'] : '\u00a0'

      var x = JSON.stringify(coursesObj)
      ele.find('#scFetchCourse')[0].setAttribute("onclick", "showCourseDetail(" + x + ")");
      
      
      setPhoneHref({      
        phone:coursesObj['Phone'],
        element: ele.find('#btnScDialCourse')
      })
      
      setWebSiteHref({      
        url:coursesObj['Website'],
        element: ele.find('#btnScWebSite')
      })
      
      setSwingUHref({      
        url:coursesObj['SxS Course Id'],
        element: ele.find('#btnScSwingU')
      })
      
      setWeatherHref({
        stationId:coursesObj['Uweather StationId'],
        city:coursesObj['City'],
        state:coursesObj['State'],
        country:'US',
        type:'weather',
        element: ele.find('#btnScWeather')
      })
      
      setAddTeeTimeClick ({      
        idx:j,
        courseName:coursesObj['Course Name'],
        element: ele.find('#btnScEnterTeeTime')[0]
      })   
      
      // var editCourse = {
      //   idx: j,
      //   name:coursesObj['Course Name'],
      //   phone:coursesObj['Phone'],
      //   website:coursesObj['Website'],
      //   stationId:coursesObj['Uweather StationId'],
      //   city:coursesObj['City'],
      //   state:coursesObj['State'],
      //   country:coursesObj['Country'],
      //   zip:coursesObj['Zip'],
      //   sxsUrl:coursesObj['SxS Course Id']
      
      // }
 
      coursesObj.idx = j
      var x = JSON.stringify(coursesObj)           
      ele.find('#btnScEditCourse')[0].setAttribute("onclick", "editCourse(" + x + ")");
        
      coursesObj['Nbr Times Played'] > 0 ? ele.css( "background", "#f5edcb") : ele.css( "background", "white")
      
      ele.show()
      
      ele.appendTo("#scContainer");
          
    }
    
    $("#scNbrCoursess")[0].innerHTML = nbrCourses
    
    btnTeetimesHtml()
    
    gotoTab('Courses')
    
}

async function showCourseDetail(courseInfo) {

  transitionPlayRoundTab('Courses')

  var teeInfoIdx = {
  
    teeName:1,
    gender:2,
    par:3,
    courseRating:4,
    slope:5,
    bogeyRating:6,
    front9Rating:7,
    back9Rating:8,
    yardage:9
  
  }
  
      var selectedTees = document.getElementById("hpSelectTees"); 
      
      var teeInfo = JSON.parse(courseInfo['Tee Info'])
      
      teePlayed = courseInfo['Tee Name'] 
                                         
      var st = document.getElementById('hpSelectTees')
      $('option', st).remove();
  
      for (var i=0;i<teeInfo.length;i++) {
  
        if (teeInfo[i][teeInfoIdx.gender] == courseInfo['Gender']) {
  
          $('<option/>').val(teeInfo[i][teeInfoIdx.teeName]).html(teeInfo[i][teeInfoIdx.teeName]).appendTo(st)
      
          if (teeInfo[i][teeInfoIdx.teeName] == teePlayed) {
        
            $('#hpSelectTees').prop('selectedIndex', i);
            
            courseInfo['Tee Name']           = teeInfo[i][teeInfoIdx.teeName]
            courseInfo['Gender']             = teeInfo[i][teeInfoIdx.gender]
            courseInfo['Par']                = teeInfo[i][teeInfoIdx.par]
            courseInfo['USGA Course Rating'] = teeInfo[i][teeInfoIdx.courseRating]
            courseInfo['Slope Rating']       = teeInfo[i][teeInfoIdx.slope]
            courseInfo['Bogey Rating']       = teeInfo[i][teeInfoIdx.bogeyRating]
            courseInfo['Front 9 Rating']     = teeInfo[i][teeInfoIdx.front9Rating]
            courseInfo['Back 9 Rating']      = teeInfo[i][teeInfoIdx.back9Rating]
            courseInfo['Yardage']            = teeInfo[i][teeInfoIdx.yardage]

            $('#hpCourse_Rating')          .html ( courseInfo['USGA Course Rating'])
            $('#hpBogey_Rating')           .html ( courseInfo['Bogey Rating'])
            $('#hpSlope_Rating')           .html ( courseInfo['Slope Rating'])
            $('#hpFront_9_Rating')         .html ( courseInfo['Front 9 Rating'])
            $('#hpBack_9_Rating')          .html ( courseInfo['Back 9 Rating'])
            $('#hpYardage')                .html ( formatNumber(courseInfo['Yardage']))
            $('#hpPar')                    .html ( courseInfo['Par'])
                        
          }
        }
      }

      
      $('#hpCourseName').html ( shortCourseName(courseInfo['Course Name']))
      $('#hpCityState').html (courseInfo['City'] + ', ' + courseInfo['State'])
      
      setPhoneHref({      
        phone:courseInfo['Phone'],
        element: $('#btnDialCourse')
      })
      
      
      setWebSiteHref({      
        url:courseInfo['Website'],
        element: $('#btnHPWebSite')
      })
      
      setWeatherHref({
        stationId:courseInfo['Uweather StationId'],
        city:courseInfo['City'],
        state:courseInfo['State'],
        country:'US',
        type:'weather',
        element:$('#btnHPWeather')
      })
      
      var hcpObj = readOption('handicapObj')
 
      $("#hpTargetHandicap").val(courseInfo.targetHcp ? courseInfo.targetHcp : Math.round((hcpObj.currHandicap*1 - .1)*10)/10)

      $("#hpSelectCourse option").filter(function() {return $(this).text() == shortCourseName(courseInfo['Course Name'])})
                                .prop('selected', true);

      $('#hpPar').html ( courseInfo['Par'])
      $('#hpNbr_Times_Played').html ( courseInfo['Nbr Times Played'])
      $('#hpAvg_Play_Time').html ( courseInfo['Avg Play Time'])
      
      courseInfo['Course Handicap'] = Math.round(($('#hpSlope_Rating').html() * hcpObj.currHandicap*1) / 113)
      $('#hpCourseHandicap').html (courseInfo['Course Handicap'])
  

      var tsObj = calcTargetScoreDan(hcpObj.mostRecent20HcpDiff, $('#hpTargetHandicap').val(), courseInfo['USGA Course Rating'], courseInfo['Slope Rating'], courseInfo['Front 9 Rating'])

     courseInfo['Target Score'] = tsObj.scoreFmt
      $('#hpTargetScore').html (courseInfo['Target Score'])

      $('#hpSelectTees').change(function(){
                                event.preventDefault()
                                showCourseDetailPrep(courseInfo)});
                                
      $('#hpTargetHandicap').change(function(){
                                event.preventDefault()
                                showCourseDetailPrep(courseInfo)});
                                
      $('#btnHPHoleDetail').data('button-data', { sxsCourseId: courseInfo['SxS Course Id']});                                

      gotoTab('PlayRound')

}


function showCourseDetailPrep(courseInfo) {


  courseInfo['Tee Name'] = $('#hpSelectTees').val()
  courseInfo['targetHcp'] = $("#hpTargetHandicap").val()

  showCourseDetail(courseInfo)

}


function transitionPlayRoundTab(direction) {

    $('#hpSelectTees').off( "change" );
    $('#hpTargetHandicap').off( "change" );

  if (direction == "Courses") {

    $('#hpCourseNameAddr').removeClass('d-none')
    $('#hpDispDialer').removeClass('d-none')
    $('#hpHoleDetail').removeClass('d-none')


    $('#hpDispHcp').addClass('d-none')
    $('#hpDispStartBtn').addClass('d-none')
    $('#hpBanner').addClass('d-none')
//    $('#hpDispSelectCourse').addClass('d-none')
    
    $('#hpGoTo')[0].setAttribute("onclick", 'gotoTab("Courses")');
    
  } else {
  
    $('#hpCourseNameAddr').addClass('d-none')
    $('#hpDispDialer').addClass('d-none')
    $('#hpHoleDetail').addClass('d-none')
    
    $('#hpDispHcp').removeClass('d-none')
    $('#hpDispStartBtn').removeClass('d-none')
    $('#hpBanner').removeClass('d-none')
//    $('#hpDispSelectCourse').removeClass('d-none')
    
    $('#hpGoTo')[0].setAttribute("onclick", 'gotoTab("Home")');
    
    $('#hpSelectTees').change(function(event){
                                event.preventDefault()
                                loadCourseInfo()});
                                
    $('#hpTargetHandicap').change(function(){    
                                event.preventDefault()
                                loadCourseInfo()});
  }

}

function btnEnterTeeTimeHtml() {

  btnAddTeetimeHtml($("#hpSelectCourse option:selected").text())
  gotoTab ("Teetimes")

}

async function btnSCMoreVertHtml() {

  var scOptions = readOption('scFilter')
  var scSelectLocal  = scOptions.scSelectLocal
  var scSelectPlayed = scOptions.scSelectPlayed
  var scExcludeSmall = scOptions.scExcludeSmall

  $('#scSelectLocal').prop("checked",  scSelectLocal );
  $('#scSelectPlayed').prop('checked', scSelectPlayed )
  $('#scExcludeSmall').prop('checked', scExcludeSmall )

}

async function btnSCSelectHtml(e) {
  
  var scSelectLocalVal     = $('#scSelectLocal').prop('checked')
  var scSelectPlayedVal    = $('#scSelectPlayed').prop('checked')
  var scExcludeSmallVal    = $('#scExcludeSmall').prop('checked')

  await updateOption('scFilter', {
                      'scSelectLocal':scSelectLocalVal,
                      'scSelectPlayed':scSelectPlayedVal,
                      'scExcludeSmall':scExcludeSmallVal
                      })
                      
  $("#btnSCMoreVert").click()
  
  btnShowCoursesHtml()

}

async function btnHPHoleDetailHtml() {
  
  $("#btnHPHoleDetail").popover('hide');            // have to wait to fetch hole detail from server
  
  $('#btnHPHoleDetail')   .attr('data-content', await holeDetail()); 
  
  $("#btnHPHoleDetail").popover('show'); 

}


async function holeDetail() {

  // var gender = arrOptions['myTeeType'].toLowerCase()
  var gender = null
  var tee = $('#hpSelectTees').val()
  // var tee = $('#hpSelectTees').val().toLowerCase()
  var sxsCourseId = $('#btnHPHoleDetail').data('button-data').sxsCourseId;   
  
  var ci = await getHoleDetail(sxsCourseId, tee, gender)

  var btnHtml     = '<button class="btn btn-outline btn-primary btn-circle">'
  var scoreHtml   = '<h5 class="pt-2 font-weight-bold">'
  var totHtml     = '<h5 class="pt-2 font-weight-bold text-success">'
  var arr = []
  
  var front9     = {}
  front9.par     = $.sum (ci.slice(0, 9), 'par')
  front9.yardage = $.sum (ci.slice(0, 9), 'yardage')
  
  var back9     = {}
  back9.par     = $.sum (ci.slice(9, 18), 'par')
  back9.yardage = $.sum (ci.slice(9, 18), 'yardage')

  var arrHcpAdj = calcHcpAdj(parseInt($('#hpTargetScore').html().split(' ')[0]) 
                                          - parseInt($('#hpPar').html()), ci)
  
  ci.forEach((val,idx) => {
    
    var adj = arrHcpAdj[val.hole - 1][2]
                                          
    var hcpAdj = adj != 0 ? '-'.repeat(Math.abs(adj)) : '\u00a0'    // : non-printing space to improve right just
                                          
    arr.push([btnHtml     + val.hole    + '</button>', 
      scoreHtml   + val.hcp + hcpAdj    + '</h5>', 
      scoreHtml   + val.par     + '</h5>', 
      scoreHtml   + val.yardage + '</h5>'
      ])
              
    if (idx == 8)  
      arr.push([totHtml + 'front'        + '</h5>', 
                totHtml + ''             + '</h5>', 
                totHtml + front9.par     + '</h5>', 
                totHtml + front9.yardage + '</h5>'
                ])                        
                              
    if (idx == 17)  
      arr.push([totHtml + 'back'        + '</h5>', 
                totHtml + ''            + '</h5>', 
                totHtml + back9.par     + '</h5>', 
                totHtml + back9.yardage + '</h5>'])
    
  })
  
  arr.push([totHtml + 'total'                           + '</h5>', 
            totHtml + ''                                + '</h5>', 
            totHtml + (front9.par + back9.par)          + '</h5>', 
            totHtml + (front9.yardage  + back9.yardage) + '</h5>']) 

  var tbl = new Table();
  
  tbl
    .setHeader(['', 'hcp', 'par', 'yard'])
    .setData(arr)
    .setTableClass('table')
    .setTrClass('no-border')
    .setTcClass(['pl-0', 'text-right', 'text-right', 'text-right'])
    .setTdClass('pb-0 pt-1')
    .setTableHeaderClass('thead-light')
    .build();
    
  return tbl.html
    
}


// courseModal

async function editCourse(course) {

   
    $("#course-modal").modal('show');
    $("#course-form")[0].reset();
    
    $('#scmModalTitle').html(course['Course Name']) 
    
    $('#scmIdx').val(course.idx)       
 
    $('#scmName').val(course['Course Name']) 
    $('#scmPhone').val(course['Phone']) 
    $('#scmWebsite').val(course['Website']) 
    $('#scmStationId').val(course['Uweather StationId']) 
    $('#scmCity').val(course['City']) 
    $('#scmState').val(course['State']) 
    $('#scmZip').val(course['Zip']) 
    $('#scmCountry').val(course['Country']) 
    $('#scmSxsUrl').val(course['SxS Course Id']) 
    
//    $('#btnDeleteCourse').removeClass('d-none')

    loadTeeBoxes(course['Tee Info'])

}

function loadTeeBoxes(teeInfo){

  var tiCols = {

    default_tee:0,
    tee_name:1,
    gender:2,
    par:3,
    course_rating:4,
    slope_rating:5,
    bogey_rating:6,
    front:7,
    back:8,
    yardage:9
  
  }

  var x = $("#tblSCM").clone();
  var y = $("#scmHdrs").clone();
  $("#scmContainer").empty()
  y.appendTo("#scmContainer");
  x.appendTo("#scmContainer");

  $("#tblSCM").hide()

  var ti = JSON.parse(teeInfo)
  
  for (var j = 0; j<ti.length;j++) {

    var ele = $("#tblSCM").clone();

    ele.find('#scmDefaultTee').eq(0).prop('checked', ti[j][tiCols.default_tee])
  
    ele.find('#scmTeeName').eq(0).val(ti[j][tiCols.tee_name])
    ele.find('#scmGender').eq(0).val(ti[j][tiCols.gender])
    ele.find('#scmPar').eq(0).val(ti[j][tiCols.par])
    ele.find('#scmCourseRating').eq(0).val(ti[j][tiCols.course_rating])
    ele.find('#scmCourseRating')[0].setAttribute("onchange", "scmCalcBogeyBack9(" + j + ")");
    ele.find('#scmSlopeRating').eq(0).val(ti[j][tiCols.slope_rating])
    ele.find('#scmSlopeRating')[0].setAttribute("onchange", "scmCalcBogeyBack9(" + j + ")");
    ele.find('#scmBogeyRating').eq(0).val(ti[j][tiCols.bogey_rating])
    ele.find('#scmFront').eq(0).val(ti[j][tiCols.front])
    ele.find('#scmFront')[0].setAttribute("onchange", "scmCalcBogeyBack9(" + j + ")");
    ele.find('#scmBack').eq(0).val(ti[j][tiCols.back])
    ele.find('#scmYardage').eq(0).val(ti[j][tiCols.yardage])


    ele.show()

    ele.appendTo("#scmContainer");
  
  }

}

async function btnSCMSubmitCourseHtml() {

  if (!$('#course-form').valid()) return

  var idx = $('#scmIdx').val()
  
  var cols = arrShts['My Courses'].colHdrs
  var course = arrShts['My Courses'].vals[idx]

  if (idx) {                                                       // update existing course
    
    course[cols.indexOf("Phone")] = $('#scmPhone').val()
    course[cols.indexOf("Website")] = $('#scmWebsite').val()
    course[cols.indexOf("Uweather StationId")] = $('#scmStationId').val()
    course[cols.indexOf("City")] = $('#scmCity').val()
    course[cols.indexOf("State")] = $('#scmState').val()
    course[cols.indexOf("Zip")] = $('#scmZip').val()
    course[cols.indexOf("Country")] = $('#scmCountry').val()
    course[cols.indexOf("SxS Course Id")] = $('#scmSxsUrl').val()
    course[cols.indexOf("Tee Info")] = scmPrepTeeInfo(cols, course)
  
  } else {     
    var courseKey = calcCourseKey($('#scmName').val())
    if (dupCourse(courseKey)) {

      toast("Course already exists")

      return
    }



    
    course = []
    course[cols.indexOf("Course Name")] = $('#scmName').val()
    course[cols.indexOf("Key")] = courseKey
    course[cols.indexOf("Phone")] = $('#scmPhone').val()
    course[cols.indexOf("Website")] = $('#scmWebsite').val()
    course[cols.indexOf("Uweather StationId")] = $('#scmStationId').val()
    course[cols.indexOf("City")] = $('#scmCity').val()
    course[cols.indexOf("State")] = $('#scmState').val()
    course[cols.indexOf("Zip")] = $('#scmZip').val()
    course[cols.indexOf("Country")] = $('#scmCountry').val()
    course[cols.indexOf("SxS Course Id")] = $('#scmSxsUrl').val()
    course[cols.indexOf("Tee Info")] = scmPrepTeeInfo(cols, course)

  }
  
  arrShts['My Courses'].vals[idx] = course
  
  var signinStatus = await testAuth()
  if (!signinStatus) return
  
  await updateCourse(course, idx)

  await initialUI()
  
  $("#course-modal").modal('hide');
  
  btnShowCoursesHtml()  

}

function dupCourse(courseKey) {

  var cols = arrShts['My Courses'].colHdrs
  var courses = arrShts['My Courses'].vals
  let courseKeys = courses.map(a => a[cols.indexOf('Key')]);

  console.log(courseKeys)

  if (courseKeys.indexOf(courseKey)) {
    return true 
  } else {
    return false
  }

}

function scmPrepTeeInfo(cols, course) {

  var tiCols = {

    default_tee:0,
    tee_name:1,
    gender:2,
    par:3,
    course_rating:4,
    slope_rating:5,
    bogey_rating:6,
    front:7,
    back:8,
    yardage:9
  
  }

  var defaultTee = document.getElementsByName('scmDefaultTee')
  var teeName = document.getElementsByName('scmTeeName')
  var gender = document.getElementsByName('scmGender')
  var crsRat = document.getElementsByName('scmCourseRating')
  var slpRat = document.getElementsByName('scmSlopeRating')
  var frntRat = document.getElementsByName('scmFront')
  var bogRat = document.getElementsByName('scmBogeyRating')
  var backRat = document.getElementsByName('scmBack')
  var par = document.getElementsByName('scmPar')
  var yardage = document.getElementsByName('scmYardage')

  var teeInfo = []
  
  for (var idx=1;idx<teeName.length;idx++) {

    var ti = []

    ti[tiCols.default_tee] = defaultTee[idx].checked
    ti[tiCols.tee_name] = camel2title(teeName[idx].value)
    ti[tiCols.gender] = gender[idx].value

    ti[tiCols.par] = par[idx].value
    ti[tiCols.course_rating] = crsRat[idx].value
    ti[tiCols.slope_rating] = slpRat[idx].value
    ti[tiCols.bogey_rating] = bogRat[idx].value
    ti[tiCols.front] = frntRat[idx].value
    ti[tiCols.back] = backRat[idx].value
    ti[tiCols.yardage] = yardage[idx].value

    teeInfo.push(ti)

    if (defaultTee[idx].checked) {

      course[cols.indexOf("Tee Name")] = camel2title(teeName[idx].value)
      course[cols.indexOf("Par")] = par[idx].value
      course[cols.indexOf("USGA Course Rating")] = crsRat[idx].value
      course[cols.indexOf("Slope Rating")] = slpRat[idx].value
      course[cols.indexOf("Front 9 Rating")] = frntRat[idx].value
      course[cols.indexOf("Back 9 Rating")] = backRat[idx].value
      course[cols.indexOf("Bogey Rating")] = bogRat[idx].value
      course[cols.indexOf("Gender	")] = gender[idx].value
      course[cols.indexOf("Yardage")] = yardage[idx].value

    }

  }

  teeInfo.sort((a,b)=> (b[tiCols.gender].localeCompare(a[tiCols.gender]) || b[tiCols.course_rating] - a[tiCols.course_rating]));

  return JSON.stringify(teeInfo)

}

function scmCalcBogeyBack9(idx) {

  idx++

  var gender = document.getElementsByName('scmGender')[idx].value
  var crsRat = document.getElementsByName('scmCourseRating')[idx].value
  var slpRat = document.getElementsByName('scmSlopeRating')[idx].value
  var frntRat = document.getElementsByName('scmFront')[idx].value

  var frntRatEle = document.getElementsByName('scmFront')[idx]
  
  var bogRat = document.getElementsByName('scmBogeyRating')[idx]
  var backRat = document.getElementsByName('scmBack')[idx]

  var mlt = gender == 'M' ? 5.381 : 4.24

  var bog = Math.round(((slpRat*1 / mlt) + crsRat*1) * 10) / 10
  bogRat.value = bog.toFixed(1)

  var x = frntRat.split(' / ')
  var frntCrsRat = x[0]*1
  var frntSlpRat = x[1]*1

  var backCrsRat = Math.round((crsRat - frntCrsRat) * 10) / 10
  var backSlpRat = 2 * slpRat - frntSlpRat

  backRat.value = backCrsRat.toFixed(1) + ' / ' + backSlpRat
  frntRatEle.value = frntCrsRat.toFixed(1) + ' / ' + frntSlpRat

}

async function updateCourse(arrCourse, idx) {

  arrCourse.forEach((val, idx, arr) => {
  
    try      {var isDate = val.match(/^(0?[1-9]|1[0-2]):[0-5][0-9]$/)}
    catch(e) {var isDate = false}
  
    if (isDate) {
      arr[idx] = new Date(val)                                // this actually creates an invalid date format that is not updated by gapi.  Perfect !!
    } else {
      isNaN(val) || val == '' ? val : arr[idx] = Number(val)
    }
    
  })

  await checkAuth()
  var resource = {
    "majorDimension": "ROWS",
    "values": [arrCourse]
    }
  
  if (idx) {
  
  var row = idx*1 + 2
  var rng = calcRngA1(row, 1, 1, arrShts['My Courses'].columnCount + 1)
  
  var params = {
    spreadsheetId: spreadsheetId,
    range: "'My Courses'!" + rng,
    valueInputOption: 'RAW'
  };


  await gapi.client.sheets.spreadsheets.values.update(params, resource)
    .then(function(response) { 
      console.log('My Courses update successful')
      console.log(response)
    }, function(reason) {
      console.error('error updating option "' + row + '": ' + reason.result.error.message);
      alert('error updating option "' + row + '": ' + reason.result.error.message);
    });

  } else {

    var row = 2
    var rng = calcRngA1(row, 1, 1, arrShts['My Courses'].columnCount + 1)
   

    var params = {
      spreadsheetId: spreadsheetId,
      range: "'My Courses'!" + rng,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS'
    };
  
    await gapi.client.sheets.spreadsheets.values.append(params, resource)
      .then(async function(response) {
        
        console.log('course added')
        console.log(response.result.updates.updatedRange)

        // var request = {
        //   sortRange: "'My Courses'!" + rng,
        //       sortSpecs: [
        //         {
        //           sortOrder: "ASCENDING",
        //           dimensionIndex: 0
        //         }
        //       ]
        //   }
        

        // console.log(request)
        // await gapi.client.sheets.spreadsheets.values.batchUpdate({
        //   spreadsheetId: spreadsheetId,
        //   resource: request
        // })

      }, 
      
      function(reason) {
        
        console.error('error appending course "' + prScore.courseName + '": ' + reason.result.error.message);      
        bootbox.alert('error appending course "' + prScore.courseName + '": ' + reason.result.error.message);
      
      });

  }
    
}


async function btnSCMFetchSxsHtml(e) {

  return new Promise(resolve => {

    var request = new XMLHttpRequest()
    
    var sxsCourseId = $('#scmSxsUrl').val()

    request.open('GET', 'https://cors.bridged.cc/' + sxsCourseId)

    request.onload = async function() {
    
      if (request.status >= 200 && request.status < 400) {

        resolve ( updateSCMForm(this.response) )
              
      } else {
        
        console.log('error' + request.status)
      
      }
    
    }
    
    request.onerror = async function() {
    
      console.log('onerror')
    
    };

    request.send()

  })

}

function updateSCMForm(sxsRtn) {

  var d = sxsRtn.split('bootstrapData(').pop().split('}}});')[0] + '}}}'
  var sxs = JSON.parse(d).model.data

  console.log(sxs)
  
    conditionalUpdate($('#scmName'),sxs.name) 
    conditionalUpdate($('#scmPhone'),sxs.phone) 
    conditionalUpdate($('#scmWebsite'),sxs.website ? fixUrl(sxs.website) : '')
    conditionalUpdate($('#scmCity'),sxs.city) 
    conditionalUpdate($('#scmState'),abbrState(sxs.stateOrProvince))
    conditionalUpdate($('#scmZip'),sxs.zipCode) 
    conditionalUpdate($('#scmCountry'),abbrCountry(sxs.country))

    var tiCols = {
    
      default_tee:0,
      tee_name:1,
      gender:2,
      par:3,
      course_rating:4,
      slope_rating:5,
      bogey_rating:6,
      front:7,
      back:8,
      yardage:9
    
    }

    var teeInfo = []
    var teeBoxes = sxs.stats

    teeBoxes.forEach(val => {

      var ti = []

      ti[tiCols.default_tee] = true
      ti[tiCols.tee_name] = camel2title(val.teeColorType)
      ti[tiCols.gender] = val.teeType.toLowerCase() == 'women' ? 'F' : 'M'

      var mlt = ti[tiCols.gender] == 'M' ? 5.381 : 4.24

      ti[tiCols.par] = val.par
      ti[tiCols.course_rating] = val.rating
      ti[tiCols.slope_rating] = val.slope
      ti[tiCols.bogey_rating] = Math.round(((val.slope*1 / mlt) + val.rating*1) * 10) / 10
      ti[tiCols.front] = val.frontNineRating + ' / ' + val.frontNineSlope
      ti[tiCols.back] = val.backNineRating + ' / ' + val.backNineSlope
      ti[tiCols.yardage] = val.yards

    teeInfo.push(ti)

    })

    teeInfo.sort((a,b)=> (b[tiCols.gender].localeCompare(a[tiCols.gender]) || b[tiCols.course_rating] - a[tiCols.course_rating]));

    loadTeeBoxes(JSON.stringify(teeInfo))
 
}

function fixUrl(url) {

  if (url.substring(0, 8) !== 'https://' && url.substring(0, 7) !== 'http://') return 'https://' + url

  return url

}

function conditionalUpdate(ele, val) {

  if (ele.val()) return
  
  ele.val(val)

}


async function btnAddCourseHtml () {

    $("#course-modal").modal('show');
    $("#course-form")[0].reset();
    
    // $('#btnDeleteCourse').addClass('d-none')

}


function abbrState(state) {
  
    let states = {
      "arizona": "AZ",
      "alabama": "AL",
      "alaska": "AK",
      "arkansas": "AR",
      "california": "CA",
      "colorado": "CO",
      "connecticut": "CT",
      "district of columbia": "DC",
      "delaware": "DE",
      "florida": "FL",
      "georgia": "GA",
      "hawaii": "HI",
      "idaho": "ID",
      "illinois": "IL",
      "indiana": "IN",
      "iowa": "IA",
      "kansas": "KS",
      "kentucky": "KY",
      "louisiana": "LA",
      "maine": "ME",
      "maryland": "MD",
      "massachusetts": "MA",
      "michigan": "MI",
      "minnesota": "MN",
      "mississippi": "MS",
      "missouri": "MO",
      "montana": "MT",
      "nebraska": "NE",
      "nevada": "NV",
      "new hampshire": "NH",
      "new jersey": "NJ",
      "new mexico": "NM",
      "new york": "NY",
      "north carolina": "NC",
      "north dakota": "ND",
      "ohio": "OH",
      "oklahoma": "OK",
      "oregon": "OR",
      "pennsylvania": "PA",
      "rhode island": "RI",
      "south carolina": "SC",
      "south dakota": "SD",
      "tennessee": "TN",
      "texas": "TX",
      "utah": "UT",
      "vermont": "VT",
      "virginia": "VA",
      "washington": "WA",
      "west virginia": "WV",
      "wisconsin": "WI",
      "wyoming": "WY",
      "american samoa": "AS",
      "guam": "GU",
      "northern mariana islands": "MP",
      "puerto rico": "PR",
      "us virgin islands": "VI",
      "us minor outlying islands": "UM",
      'Alberta': 'AB',
       'British Columbia': 'BC',
       'Manitoba': 'MB',
       'New Brunswick': 'NB',
       'Newfoundland': 'NF',
       'Northwest Territory': 'NT',
       'Nova Scotia': 'NS',
       'Nunavut': 'NU',
       'Ontario': 'ON',
       'Prince Edward Island': 'PE',
       'Quebec': 'QC',
       'Saskatchewan': 'SK',
       'Yukon': 'YT'
    }
  console.log(state)
    let a = state.trim().replace(/[^\w ]/g, "").toLowerCase(); //Trim, remove all non-word characters with the exception of spaces, and convert to lowercase
    if(states[a]) {
      return states[a];
    }
    console.log(state)
    return state;

}


function abbrCountry(country) {

  if (country == "United States of America") return 'US'
  return country

}
/*
async function btnDeleteCourseHtml() {

  if (arrOptions['Courses']) {
  
    var arrCourses = readOption('Courses')
    
    var idx = $('#scmIdx').val()
        
    arrCourses.splice(idx, 1)
    
    if (arrCourses.length == 0) arrCourses = ''

  } else {
  
    arrCourses = ''
    
  }
  
  arrOptions['Courses'] = arrCourses  ? JSON.stringify(arrCourses) : ''
  
  await updateCoursesOption()
  
  $("#course-modal").modal('hide');
  
  btnShowCoursesHtml()  

}

async function updateCoursesOption() {

    var courses = readOption('Courses', null)
    
    if (courses) {

      courses.sort(nameCompare);
      
    }
 
   await updateOption('Courses', courses)

}


*/
