
// Global variables

  var scriptVersion = "Version 193 on Mar 17, 12:05 PM"

  var spreadsheetId = '1hd8wclEwowN2ar5trUgk2AbNbhovFoYLSMOTRqzSN30'

  var arrShts = []
  var suSht = []
  var arrOptions
  var optionsIdx

  var courseInfo
  var teePlayed
  var currHandicap
  var hcpMethod


  var RSCalledFrom
  var prCourse = { }
  var prScore = { }
  var prClubs
  var clubsThisHole = []

  var canUseGeo
  var geoWatchId
  var prLat
  var prLng
  var courseCoords = { }
  var nearByUweatherStations = null

  var geolocationOptions = {
    enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};



  var puttsOriginalState
  var driveOriginalState
  var pnltyOriginalState
  var sandOriginalState

  var weatherUrlMask = 'https://www.wunderground.com/*type*/*country*/*state*/*city*/*stationId*'


  $(async function() {

    // hi dan

    //  $('body').bootstrapMaterialDesign();

    //  parent.document.getElementById('userHtmlFrame').style.overflowY = "hidden";
    //  $("body").css("height", "100hv")
    //  $("body").css("overflow", "hidden")

    $('.score a').on('shown.bs.tab', function (event) {

      var selId = $(event.target)[0].parentElement.parentElement.id

      $('#' + selId).find("*").removeClass("sel");
      $(event.target).addClass('sel')

    });

  $('.score').on('shown.bs.tab', function(event){
  
    var selId = $(event.target)[0].parentElement.parentElement.parentElement.id
  $('#' + selId).find(".vis").addClass("hid");

  var event =  $(event.target).children().eq(0);
  event.removeClass('hid')

  });



  var tabs = $( "#main-panel" ).tabs();

  // Auth tab

  $('#btnAuth')            .button().click(btnAuthHtml);
  $('#btnSignout')           .button().click(btnSignoutHtml);


  // Home tab


  // Play Round tab
  $('#btnPlayRound')            .button().click(btnPlayRoundHtml);
  $('#btnStartRound')           .button().click(btnStartRoundHtml);
  $( "#hpSelectCourse")         .change({useDefaultTee:true},  loadCourseInfo);
  $( "#hpSelectTees")           .change({useDefaultTee:false}, loadCourseInfo);
  $("#hpTargetHandicap")        .change({useDefaultTee:false}, loadCourseInfo);


  $("#hpTargetHandicap")
  .TouchSpin({
    min: 0,
  max: 50,
  step: 0.1,
  decimals: 1,
  boostat: 5,
  maxboostedstep: 10,
  verticalbuttons: true
    });



  // Scorecard tab
  $('#btnPrevHole')            .button().click({offset: -1}, btnChangeHoleHtml);
  $('#btnNextHole')            .button().click({offset: +1}, btnChangeHoleHtml);
  $('#btnCurrHole')            .button().click({offset: 0},  btnChangeHoleHtml);
  $('#btnSaveScore')           .button().click(btnSaveScoreHtml);
  $('#btnEndRound')            .button().click(btnEndRoundHtml);
  $('#btnCancelRound')         .button().click(btnCancelRoundHtml);
  $('#btnPauseRound')          .button().click(btnPauseRoundHtml);
  $('#btnGolfers')             .button().click(btnGolfersHtml);

  $('#btnUweatherComp')             .button().click(btnUweatherCompHtml);

  $('#btnTestAPIStatus')       .button().click(btnTestAPIStatusHtml);
  $('#btnTestGASStatus')       .button().click(btnTestGASStatusHtml);



  //  $('#btnChangeTee')           .button().click(btnChangeTeeHtml);

  $('#btnRoundStats')          .button().click(btnRoundStatsHtml);
  $('#btnClearScore')          .button().click(btnClearScoreHtml);
  $('#prDistance')             .click({pinLocn: 'center'}, btnShowLocationHtml);
  $('#prDistanceFront')        .click({pinLocn: 'front'}, btnShowLocationHtml);
  $('#prDistanceBack')         .click({pinLocn: 'back'}, btnShowLocationHtml);
  $('#prTrackDistance')        .click(btnTrackDistanceHtml);
  $('#btnTrackClub')           .click(btnTrackClubHtml);
  //  $('#btnTrackClub')           .click(btnShowLocationHtml);


  // Round Stats tab
  $('#btnRSClose')             .button().click(RSCloseHtml);
  $('#btnRSScorecard')         .button().click(btnRSScorecard);

  $('[data-toggle="popover"]').popover({

    html: true,
  sanitize: false,
  container: 'body',
  template: '<div class="popover" role="tooltip"><div class="arrow"></div>' +
    '<h4 class="popover-header"></h4>' +
    '<h5 class="popover-body"></h5>' +
    '</div>'
  });

  // Show Rounds tab
  //  $('#btnShowRounds')           .click(getRounds);
  $('#btnShowRounds')           .click(btnShowRoundsHtml);
  $('#btnSRSelect')            .click(btnSRSelectHtml);
  $('#srSelectDropDown').on('show.bs.dropdown', function () {
    btnSRMoreVertHtml()
  })


  // Show Handicap
  $('#btnShowHandicap')         .click(btnShowHandicapHtml);
  $('#btnHCPSelect')            .click(btnHCPSelectHtml);
  $('#hcpSelectDropDown').on('show.bs.dropdown', function () {
    btnHCPMoreVertHtml()
  })

  // Show Clubs
  $('#btnShowClubs')          .click(btnShowClubsHtml);
  $('#btnSubmitClub')         .click(btnSubmitClubHtml);
  $('#btnDeleteClub')         .click(btnDeleteClubHtml);
  $('#btnAddClub')            .click(btnAddClubHtml);
  $('#clbmLaunch')            .change({p: 'launch'},   adjustClubParmsHtml);
  $('#clbmSpeed')             .change({p: 'speed'},    adjustClubParmsHtml);
  $('#clbmDistance')          .change({p: 'distance'}, adjustClubParmsHtml);



  // Show Stats
  $('#btnShowStats')         .click(btnShowStatsHtml);

  // Show Teetimes
  $('#btnTeetimes')          .click(btnTeetimesHtml);
  $('#btnAddTeetime')        .click(btnAddTeetimeHtml);
  $('#btnSubmitTeetime')     .click(btnSubmitTeetimeHtml);
  $('#btnDeleteTeetime')     .click(btnDeleteTeetimeHtml);
  $('#btnEnterTeeTime')      .button().click(btnEnterTeeTimeHtml);
  $('#ttmGolfers')           .change(ttmGolfersChangeHtml);
  $('#ttmSelectCourse')      .change(ttmSelectCourseChangeHtml);



  puttsOriginalState = $("#divPutts").clone(true);
  driveOriginalState = $("#divDrive").clone(true);
  pnltyOriginalState = $("#divPnlty").clone(true);
  sandOriginalState  = $("#divSand").clone(true);

  $('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });


  // Courses
  $('#btnShowCourses')         .click(btnShowCoursesHtml);
  $('#btnSCSelect')            .click(btnSCSelectHtml);
  //  $('#btnSCMoreVert')          .click(btnSCMoreVertHtml);
  $('#btnHPHoleDetail')         .button().click(btnHPHoleDetailHtml);
  $('#btnSCMFetchSxs')         .click(btnSCMFetchSxsHtml);
  $('#btnSCMSubmitCourse')         .click(btnSCMSubmitCourseHtml);


  $('#scSelectDropDown').on('show.bs.dropdown', function () {
    btnSCMoreVertHtml()
  })

  // Golfers
  $('#btnShowGolfers')          .click(btnShowGolfersHtml);
  $('#btnSubmitGolfer')         .click(btnSubmitGolferHtml);
  $('#btnDeleteGolfer')         .click(btnDeleteGolferHtml);
  $('#btnAddGolfer')            .click(btnAddGolferHtml);

  // All tabs
  $('.divfullscreen').click(function(){
    document.documentElement.requestFullscreen();
  });

  var whiteList = $.fn.tooltip.Constructor.Default.whiteList

  whiteList.table = []
  whiteList.td = []
  whiteList.th = []
  whiteList.thead = []
  whiteList.tr = []
  whiteList.tbody = []
  whiteList.button = []

  setupFormValidation()

  setupSumFunctions()

  $("#myToast").on("show.bs.toast", function() {
    $(this).removeClass("d-none");
        })

  $("#myToast").on("hidden.bs.toast", function() {
    $(this).addClass("d-none");
        })

  //  dupIds()

  Date.prototype.toLocaleISOString = function() {
    const zOffsetMs = this.getTimezoneOffset() * 60 * 1000;
  const localTimeMs = this - zOffsetMs;
  const date = new Date(localTimeMs);
  const utcOffsetHr = this.getTimezoneOffset() / 60;
  const utcOffsetSign = utcOffsetHr <= 0 ? '+' : '-';
  const utcOffsetString = utcOffsetSign + (utcOffsetHr.toString.length == 1 ? `0${utcOffsetHr}` : `${utcOffsetHr}`) + ':00';
  return date.toISOString().replace('Z', utcOffsetString);
  };

})

  function dupIds () {
  var ids = { };
  var found = false;
  $('[id]').each(function(key,val) {


  if (this.id && ids[this.id]) {
    found = true;
  console.warn('Duplicate ID #'+this.id);
    }
  ids[this.id] =+ 1;
  });
  if (!found) console.log('No duplicate IDs found');
}

async function getSSId() {

  var q = "name = 'golfscorecard database v3'" + 
          " AND " + "mimeType='application/vnd.google-apps.spreadsheet'" + 
          " AND " + "trashed = false"

  var ssId = await gapi.client.drive.files.list({
      q: q,
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive'
  }).then(function(response) {

    var files = response.result.files;

    if (!files || files.length == 0)  return {fileId:null,msg:"'golfscorecard database v3' not found"}

    if (files.length > 1)             return {fileId:null,msg:"'golfscorecard database v3' not unique"}

    return {fileId:files[0].id,msg:'ok'}

  });  

  return ssId

}


async function initialUI() {

    arrShts = await openShts(
      [
        { title: 'My Courses', type: "all" },
        { title: 'Options', type: "all" }
      ])
    
  console.log(arrShts)

  arrOptions    = toObject(arrShts.Options.vals)
  optionsIdx    = toObjectIdx(arrShts.Options.vals)

  currHandicap = arrOptions['Current Handicap']

  $('#hmCurrHandicap').html(currHandicap)
  $('#hmNbrRounds').html(JSON.parse(arrOptions.Lifetime).nbrRounds)

  loadCoursesPlayedDropDown('hpSelectCourse')

};

  var confirm = function (msg) {

  return new Promise(resolve => {

    bootbox.confirm({

      size: "small",
      message: '<b>' + msg + '</b>',
      centerVertical: true,


      callback: function (result) { /* result is a boolean; true = OK, false = Cancel*/

        if (result) {

          resolve(true)

        } else {

          resolve(false)

        }
      }
    });
  });
}

var openShts = async function (shts) {

  return new Promise(async resolve => {

    shtRngs = []
    
    for (s in shts) {

      var sheet = shts[s]

      switch (sheet.type) {

        case "headers":
          shtRngs.push("'" + sheet.title + "'!1:1")
          break;

        case "all"  :
          shtRngs.push("'" + sheet.title + "'!A1:ZZ10000")
          break;

      }

    }

  await checkAuth()

  gapi.client.sheets.spreadsheets.values.batchGet({spreadsheetId: spreadsheetId, ranges: shtRngs})

  .then(async function(response) {
    
    var allShts = response.result.valueRanges

    var arr = []

    for (s in allShts) {
    
      var shtVals = allShts[s].values

      var colHdrs = shtVals[0]
      var vals = shtVals.slice(1)
      var colCnt = vals[0] ? vals[0].length : 0
      var rowCnt = vals ? vals.length : 0

      var shtTitle = allShts[s].range.split('!')[0].replace(/'/g,"")

      arr[shtTitle] =  {  
        colHdrs:      shtVals[0],
        vals:         shtVals.slice(1),
        columnCount:  colCnt,
        rowCount:     rowCnt
      }
      
    }

    resolve(arr)
      
  },

    function(response) {

      console.log('Error: ' + response.result.error.message);
          
    });

  })

}


function loadCoursesPlayedDropDown(selectCourse) {

    removeOldTeetimes()
    
    var nextCourseName = arrOptions.teetimes ? JSON.parse(arrOptions.teetimes)[0].courseName : null

    courses =  arrShts['My Courses'].vals

    var s = document.getElementById(selectCourse)
    $('option', s).remove();
    var courseIdx

    for (var j = 0; j < courses.length; ++j) {
    
      var courseName = courses[j][0].toString()
      var shortName = shortCourseName(courseName)

      if (shortName == nextCourseName) courseIdx = j

      $('<option />').val(courses[j][2]).text(shortName).appendTo(s)
            
    }

    if (courseIdx) s.selectedIndex = courseIdx; 

}

function searchTeeTimes() {

  if (!arrOptions.teetimes) return null

  var teetimes = JSON.parse(arrOptions.teetimes)

  var td = new Date().setHours(0,0,0,0)
  
  teetimes.forEach((val) => {
  
    if (new Date(val.date) == td) { return val }
  
  })

  return null

}

function removeOldTeetimes() {

    var teetimes = readOption('teetimes', null)

  if (!teetimes) return

  var td = new Date()
  td.setHours(0,0,0,0);  // midnight of today

  var arrTeetimes = []
    
    teetimes.forEach ((val) => { if (parseDateISOString(val.date) >= td)  {arrTeetimes.push(val)} })

  if (teetimes.length == arrTeetimes.length) return
    
    arrOptions.teetimes = arrTeetimes.length > 0 ? JSON.stringify(arrTeetimes) : ''

  updateTeetimesOption()

}

function parseDateISOString(s) {
    let ds = s.split(/\D/).map(s => parseInt(s));
  ds[1] = ds[1] - 1; // adjust month
  return new Date(...ds);
}

function calcTS(targetHandCapDiff) {

  var courseRating = $('#hpCourse_Rating').html()
  var slopeRating = $('#hpSlope_Rating').html()
  var courseRatingFront9 = $('#hpFront_9_Rating').html()
  var courseRatingBack9 = $('#hpBack_9_Rating').html()

  var targetScore = ((targetHandCapDiff * slopeRating /  113) + courseRating * 1.0)
  var courseRatingFront = courseRatingFront9.split(' / ')[0]
  var slopeRatingFront = courseRatingFront9.split(' / ')[1]
  var targetScoreFront = Math.round(((targetHandCapDiff * slopeRatingFront /  113) + courseRatingFront * 2.0) / 2)
  var targetScoreBack = Math.round(targetScore) - targetScoreFront

  return Math.round(targetScore) + ' ... ' + targetScoreFront + ' / ' + targetScoreBack
}

function shortCourseName(longName) {
  var wrk = longName.replace(/golf/gi,'')
  wrk = wrk.replace(/course/gi, "")
  wrk = wrk.replace(/country/gi, "")
  wrk = wrk.replace(/club/gi, "")
  wrk = wrk.replace(/&/gi, "")
  wrk = wrk.replace(/ \)/g, ")")
  wrk = wrk.replace( /  +/g, ' ' )
  wrk = wrk.replace(/^\s+|\s+$/g, "")
  return wrk
}


function calcRngA1(r, c, nbrRows, nbrCols) {

  var rngA1 = colNbrToLtr(c) + r + ':' + colNbrToLtr(c + nbrCols - 1) + (r + nbrRows - 1)

  return rngA1
 
}

function colNbrToLtr(n){
   if (n < 27){
      return String.fromCharCode(64 + n);
   }
  else {
      var first = Math.round(n / 26);
  var second = n % 26;
  return String.fromCharCode(64 + first) + String.fromCharCode(64 + second);
   }
}

function toObject(arr) {
  var rv = { };
  for (var i = 0; i < arr.length; ++i)
  if (arr[i] !== undefined) rv[arr[i][0]] = arr[i][1];
  return rv;
}

function toObjectIdx(arr) {
  var rv = { };
  for (var i = 0; i < arr.length; ++i)
  if (arr[i] !== undefined) rv[arr[i][0]] = i;
  return rv;
}

function makeObj(courseInfo, cols) {

  var rtnObj = { }
  for (var i = 0; i < courseInfo.length; ++i)
  if (courseInfo[i] !== undefined) rtnObj[cols[i]] = courseInfo[i];

  return rtnObj;

}

function formattime(dte){

   if (isNaN(Date.parse(dte))) return


  var zero = '0', hours, minutes, seconds, time;
  time = new Date(dte);

  var hh = (zero + time.getHours()).slice( - 2);
  var mm = (zero + time.getMinutes()).slice( - 2);
  var ss = (zero + time.getSeconds()).slice( - 2);
  return hh +':' + mm +':' + ss;
}

function formatNumber (str) { 

    if (!str) {return}
  var x = str.toString().split('.');
  var x1 = x[0]; 
    var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2'); 
    }
  return x1 + x2; 

};

function toast(e) {
    /*
   
   bootbox.alert({
       message: '<b>' + e + '</b>',
       centerVertical: true,
       size: 'small'
   });
   return
    */

    $("#toast-content").html(e)

  $("#myToast").toast({delay: 5000});

  $("#myToast").toast('show');

}


function promiseRun (func) {

// this is a trick to convert the arguments array into an array, and drop the first one
  var runArgs = Array.prototype.slice.call(arguments).slice(1);

  return new Promise (function (resolve, reject) {

    google.script.run
      .withSuccessHandler(function (result) {
        resolve(result);
      })
      .withFailureHandler(function (error) {
        reject(error);
      })

    [func].apply(this, runArgs) ;
        
  })
}

function gotoTab(tabName) {

    $('[href="#' + tabName + '"]').trigger('click');

   /*
console.log(tabName)
console.log($("#main-panel ul>li a"))
var tab = $("#main-panel ul>li a:contains('" + tabName + "')");

console.log(tab)
  if (tab[0]) {
    var tabid = tab[0].id;
  console.log(tab[0])
  var tabIndex = tabid.slice(tabid.lastIndexOf('-') + 1);;
  console.log(tabIndex)
  $('#main-panel').tabs('option', 'active', tabIndex - 1);
  }


  //  $('[href="#' + tabName + '"]').trigger('click');
  //$( "#main-panel" ).tabs( "option", "active", 1 );

  console.log($( "#main-panel" ).tabs())
  console.log($('[data-role="tabs"]'))
  $('[data-role="tabs"]' ).tabs( "option", "active", 2 );
  */  
}


function setupFormValidation() {

    $.validator.setDefaults({
      highlight: function (element) {
        $(element).closest('.form-group').addClass('has-danger');
      },
      unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-danger');
      },
      errorElement: 'small',
      errorClass: 'form-control-feedback d-block',
      errorPlacement: function (error, element) {
        if (element.parent('.input-group').length) {
          error.insertAfter(element.parent());
        } else if (element.prop('type') === 'checkbox') {
          error.appendTo(element.parent().parent().parent());
        } else if (element.prop('type') === 'radio') {
          error.appendTo(element.parent().parent().parent());
        } else {
          error.insertAfter(element);
        }
      },
    });

  $("#teetime-form").validate();
  $("#golfer-form").validate();

}

function setupSumFunctions() {

    $.fairwaysHit = function (arr) {

      var fairways = 0;
      var fairwaysHit = 0;

      $.each(arr, function (i, v) {

        if (v) {

          if (v['drive'] == 'Str8' && parseInt(v['par']) > 3) {
            fairwaysHit++
          }

          if (parseInt(v['par']) > 3) {
            fairways++
          }
        }
      });

      return fairwaysHit + ' / ' + fairways

    }

    $.sum = function(arr, ele) {

      var r = 0;
      $.each(arr, function(i, v) {
            if(v) r += +v[ele]; 
      });
      return r;
    }

}

  function setWeatherHref(e) {

  const isURL = (str) => {
  var pattern = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi); // fragment locator
  return pattern.test(str);
    }

  if (e.stationId && isURL(e.stationId)) {
  
    var weatherUrl = e.type !== 'weather' ? e.stationId.replace(/weather/g, e.type) : e.stationId
  
  } else {
  
    var weatherCity = e.city ? e.city.replace(/ /g,'-').toLowerCase() : ''
    var weatherState = e.state ? e.state.toLowerCase() : ''
    var weatherCountry = e.country ? e.country.toLowerCase() : ''
    var weatherType = e.type ? e.type : ''
    var weatherStationId = e.stationId ? e.stationId : ''


    var weatherUrl = weatherUrlMask
    .replace('*state*',weatherState)
    .replace('*city*',weatherCity)
    .replace('*country*',weatherCountry)
    .replace('*type*',weatherType)
    .replace('*stationId*',weatherStationId)
  //        .replace('https:/', 'https://')
  //        .toLowerCase()
        
  }

  if (e.date) weatherUrl += "/date/" + e.date

  var weatherUrl = weatherUrl.replace(/\/+/g,'/').replace('https:/', 'https://')

  if (e.element !== null) {

    e.element.prop('disabled', false)
      .prop('href', weatherUrl)

  }
//  else  {
    console.log(weatherUrl)
   
    return weatherUrl
   
//  }
                        
}

function setPhoneHref(d) {

      if (d.phone) {

    d.element.prop('disabled', false).prop('href', 'tel:' + d.phone)

  } else {

    d.element.removeAttr('href');
      
      }

}

function setPhoneHref(d) {

      if (d.phone) {

    d.element.prop('disabled', false).prop('href', 'tel:' + d.phone)

  } else {

    d.element.removeAttr('href');
      
      }

}

async function setSmsHref(d) {

  if (d.cellNbrs) {
      
    var course = findCourse(d.courseName)
    var coursesObj = makeObj(course, arrShts['My Courses'].colHdrs)

    var weatherUrl = setWeatherHref({
      stationId:coursesObj['Uweather StationId'],
      city:coursesObj['City'],
      state:coursesObj['State'],
      country:'US',
      type:'hourly',
      date:d.date,
      element:null
    })

    var w = await getWeather(weatherUrl)

    var txtWeather = parseWeatherText(w)

    var dt = formatsmsDateTime (d.date, d.time)

    var txtBody = d.courseName + '%0a' + dt.date + '%0a' + dt.time

    d.element.prop('disabled', false)
    d.element.prop('href', 'sms:' + d.cellNbrs + "?body=" + txtBody  + "%0a%0a" + txtWeather )
          
  } else {

    d.element.removeAttr('href');
      
  }

}



  function setWebSiteHref(d) {

      if (d.url) {

    d.element.prop('disabled', false).prop('href', d.url)

  } else {

    d.element.removeAttr('href');
      
      }

}


  function setSwingUHref(d) {

      if (d.url) {

    d.element.prop('disabled', false).prop('href', d.url)

  } else {

    d.element.removeAttr('href');
      
      }

}

  function setAddTeeTimeClick(d) {

      var objVal = {

    idx: d.idx,
  courseName: shortCourseName(d.courseName),
  date: '',
  time: '',
  golfers: ''
        
      }

  var x = JSON.stringify(objVal)

  d.element.setAttribute("onclick", "editTeetime(" + x + ");gotoTab('Teetimes')");
      
}

  function parseWeatherText(wRptHtml) {

  var strToken = '</a></div ></div > <p _ngcontent'

var str = wRptHtml.indexOf(strToken) + strToken.length + 10
var end = wRptHtml.indexOf('</p></div></div></div><!----><div', str)

var wText = wRptHtml.substring(str, end)

return wText

}


function readOption(key, defaultReturn = '') {

  if (!arrOptions[key]) return defaultReturn
  if (arrOptions[key] == 'null') return defaultReturn

  try { var rtn = JSON.parse(arrOptions[key]) }
  catch (err) { var rtn = arrOptions[key] }

  return rtn

}

async function updateOption(key, val) {

  if (typeof val === "object") {
    var strVal = JSON.stringify(val)
  } else {
    var strVal = val
  }

  arrOptions[key] = strVal

  var resource = {
    "majorDimension": "ROWS",
    "values": [[
      key,
      strVal
    ]]
  }

  var row = optionsIdx[key] + 2

  var params = {
    spreadsheetId: spreadsheetId,
    range: "'Options'!A" + row + ":B" + row,
    valueInputOption: 'RAW'
  };

  await checkAuth()

  var gapiResult = await gapi.client.sheets.spreadsheets.values.update(params, resource)

    .then(
      async response => {
        return response
      },

      async reason => {

        console.log('updateOption')
        console.log(reason)

        bootbox.alert('error updating option "' + key + '": ' + reason.result.error.message);

        return null

      }
    );

  console.log('gapiResult')
  console.log(gapiResult)

}

async function checkAuth() {

  var minAuthRemaining = (new Date(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().expires_at) - new Date()) / (1000 * 60)
  if (minAuthRemaining < 10) {
    console.log('auth reload - ' + minAuthRemaining);
    alert('auth reload - ' + minAuthRemaining);
    await gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse()
  } else {
    console.log('auth ok - ' + minAuthRemaining);
  }
  var minAuthRemaining = (new Date(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().expires_at) - new Date()) / (1000 * 60)

  // alert('auth result - ' + minAuthRemaining)

}

async function btnTestAPIStatusHtml() {

  var timer = new Date()
  await updateOption('gapi test', JSON.stringify(prScore))
  var optionTimer = new Date() - timer

  alert('Update Option successful - ' + optionTimer + 'ms')


}

async function btnTestGASStatusHtml() {

  var timer = new Date()
  //  await promiseRun('logRound', 'currScoreCard', JSON.stringify(prScore))
  var optionTimer = new Date() - timer

  alert('Update Properties successful - ' + optionTimer + 'ms')


}
// uweather comparison of gps coords vs course coords vs hand selected station id

async function btnUweatherCompHtml() {

  if (!nearByUweatherStations) {

    var nearByUweatherStations = await getNearByUweatherStations()

  }

  console.log('hi dan')
  console.log(nearByUweatherStations)

  var uweatherComp = await getUWeather(nearByUweatherStations)

  if (uweatherComp === null) return

  var wPrompt = bootbox.alert({

    title: "UWeather Station Comparison",
    message: uweatherComp,
    callback: function (result) {
      console.log('This was logged in the callback: ' + result);
    }

  });

  wPrompt.init(function () {

  });

}


async function getUWeather(stationIds) {

  var removeDup = stationIds.indexOf(prCourse.courseInfo["Uweather StationId"])
  console.log(stationIds)
  console.log(removeDup)

  if (removeDup > -1) stationIds.splice(removeDup, 1)

  console.log(stationIds)

  const wRtn = await Promise.all([
    getWeatherByStationId(prCourse.courseInfo["Uweather StationId"]),
    getWeatherByStationId(stationIds[0]),
    getWeatherByStationId(stationIds[1]),
    getWeatherByStationId(stationIds[2]),
    getWeatherByStationId(stationIds[3]),
    getWeatherByStationId(stationIds[4]),
    getWeatherByStationId(stationIds[5]),
    getWeatherByStationId(stationIds[6]),
    getWeatherByStationId(stationIds[7]),
    getWeatherByStationId(stationIds[8]),
    getWeatherByStationId(stationIds[9])
  ]);


  console.log(wRtn)

  var w = wRtn.filter(x => x !== null)

  if (w.length < 3) {

    toast('Weather reports not available.<br><br>Try again later.')
    return null

  }

  const pressure = pressure => (29.92 * Math.exp(-0.0000366 * pressure)).toFixed(2)
  const dist = coords => (distance(prCourse.courseInfo.courseCoords.lat, prCourse.courseInfo.courseCoords.lng, coords.lat, coords.lon, 'M').toFixed(1))
  const setBtn = stationId => '<button  class="btn btn-outline-primary btn-sm py-0 my-0" onclick="setStationId(\'' + stationId + '\')">Set</button>'
  const currentStation = prCourse.courseInfo['Uweather StationId'] ? prCourse.courseInfo['Uweather StationId'] : 'default'

  var arr = []

  arr.push(['stationId', ...(w.map(({ stationID }) => '<small>' + stationID))])
  arr.push(['obs', ...(w.map(({ obs }) => obs))])
  arr.push(['distance', ...(w.map(({ coords }) => dist(coords)))])
  arr.push(['elev', ...(w.map(({ elev }) => elev))])
  arr.push(['temp', ...(w.map(({ temp }) => temp))])
  arr.push(['humidity', ...(w.map(({ humidity }) => humidity))])
  arr.push(['dewpt', ...(w.map(({ dewpt }) => dewpt))])
  arr.push(['bPressure', ...(w.map(({ pressure }) => pressure))])
  arr.push(['aPressure', ...(w.map(({ elev }) => pressure(elev)))])
  arr.push(['windSpeed', ...(w.map(({ windSpeed }) => windSpeed))])
  arr.push(['winddir', ...(w.map(({ winddir }) => winddir))])
  arr.push(['set', ...(w.map(({ stationID }) => setBtn(stationID)))])
  arr.push(['current', '<small>' + '<input  class="col-12 px-0 text-right" type="text" id="manualStationId" value=\'' + currentStation + '\'>',
    '<button class="btn btn-outline-primary btn-sm py-0 my-0" onclick="setStationId(\'' + currentStation + '\')">Set</button>', ''])
  console.log(arr)

  var tbl = new Table();

  tbl
    .setHeader()
    .setTableHeaderClass()
    .setData(arr)
    .setTableClass('table')
    .setTrClass()
    .setTcClass(['', 'text-right', 'text-right', 'text-right', 'text-right', 'text-right', 'text-right', 'text-right', 'text-right', 'text-right', 'text-right'])
    .setTdClass('pb-1 pt-1 border-0')
    .build();

  return tbl.html

}

async function getWeatherByStationId(stationId) {

  console.log('getWeatherByStationId')
  var weatherUrl = setWeatherHref({

    stationId: stationId,
    city: prCourse.courseInfo['City'],
    state: prCourse.courseInfo['State'],
    country: 'US',
    type: 'weather',
    element: null

  })


  var response = await fetch('https://cors.bridged.cc/' + weatherUrl);

  let w = await response.text(); // read response body as text

  console.log('getWeatherByStationId - ' + weatherUrl)

  var rtn = parseUweather(w)

  return rtn

}

async function getNearByUweatherStations() {
  console.log('getNearByUweatherStations')

  var weatherUrl = 'https://www.wunderground.com/weather/' + prCourse.courseInfo.courseCoords.lat + ',' + prCourse.courseInfo.courseCoords.lng
  console.log(weatherUrl)

  var response = await fetch('https://cors.bridged.cc/' + weatherUrl);

  let w = await response.text(); // read response body as text
  console.log(w.length)
  //  console.log(w)

  var rtn = parseNearByUweatherStations(w)

  return rtn

}

function parseNearByUweatherStations(wRptHtml) {

  var str = wRptHtml.indexOf('{&q;value&q;:{&q;location&q;:{&q;stationName&q;:')
  var end = wRptHtml.indexOf(',&q;expiresAt&q;:', str)

  console.log(str)
  console.log(end)

  if (str < 0) return null

  var current = wRptHtml.substring(str, end).replace(/&q;/g, '"') + '}'

  console.log(current)

  var w = JSON.parse(current).value.location.stationId

  console.log(w)

  return w

}

async function setStationId(stationId) {

  /*
  
  0. Calculate Weather Url
  1. update prCourse.courseInfo['Uweather StationId']
  2. update Courses (arrShts and sheet)
  3. update btnSCWeather
  */

  /*
    var baseUrl = weatherUrlMask.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
    
    if (e == 'manual') {
      var manSId = $('#manualStationId').val()
      if (/^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(manSId)) {
        var weatherUrl = manSId
      } else {
        var weatherUrl = baseUrl + '/weather/' + $('#manualStationId').val() 
      }
    } else {
      var weatherUrl = baseUrl + '/weather/' + e
    }
    
  
  */
  console.log(stationId)
  if (stationId == 'default') return

  prCourse.courseInfo['Uweather StationId'] = stationId

  var idxRow = findCourseIdx(prCourse.courseInfo['Course Name'])
  var idxCol = arrShts['My Courses'].colHdrs.indexOf('Uweather StationId')

  arrShts['My Courses'].vals[idxRow][idxCol] = stationId

  await updateCourse(arrShts['My Courses'].vals[idxRow], idxRow)

  var x = setWeatherHref({

    stationId: stationId,
    city: prCourse.courseInfo['City'],
    state: prCourse.courseInfo['State'],
    country: 'US',
    type: 'hourly',
    element: $('#btnSCWeather')

  })

}

function findCourseIdx(courseName) {

  var courseKey = calcCourseKey(courseName)

  var keyCol = arrShts['My Courses'].colHdrs.indexOf('Key')

  return arrShts['My Courses'].vals.findIndex(row => row[keyCol] === courseKey);

}




function parseUweather(wRptHtml) {

  //console.log(wRptHtml)

  var str = wRptHtml.indexOf('{&q;value&q;:{&q;observations&q;:[{&q;stationID&q;:&q;')
  var end = wRptHtml.indexOf(',&q;expiresAt&q;:', str)

  console.log(str)
  console.log(end)

  if (str < 0) return null

  var current = wRptHtml.substring(str, end).replace(/&q;/g, '"') + '}'

  //  console.log(current)

  var w = JSON.parse(current).value.observations[0]
  var windSpeed = w.imperial.windSpeed ? w.imperial.windSpeed : 0
  var windGust = w.imperial.windGust ? w.imperial.windGust : 0

  console.log(JSON.parse(current).value.observations[0])

  const calcWindDirectionCardinal = (winddir) => (winddir ? ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"][(Math.round((winddir) / 22.5, 0))] : '')
  var windDirectionCardinal = calcWindDirectionCardinal(w.winddir)

  var now = new Date()
  var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  var ms = new Date() - new Date(w.obsTimeUtc)
  var obs = msToHHMMSS(ms)

  return {

    stationID: w.stationID,
    temp: w.imperial.temp,
    humidity: w.humidity,
    winddir: windDirectionCardinal,
    dewpt: w.imperial.dewpt,
    elev: w.imperial.elev,
    windSpeed: windSpeed + ' | ' + windGust,
    pressure: w.imperial.pressure,
    coords: { lat: w.lat, lon: w.lon },
    obs: obs

  }

}

function msToHHMMSS(ms) {

  ms = Math.abs(ms)

  let seconds = Math.floor((ms / 1000) % 60);
  let minutes = Math.floor((ms / 1000 / 60) % 60);
  let hours = Math.floor((ms / 1000 / 3600) % 24)

  if (hours) hours = (hours < 10) ? "0" + hours : hours
  else hours = false
  if (hours) minutes = (minutes < 10) ? "0" + minutes : minutes
  else minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  var hhmmss = []

  if (hours) hhmmss.push(hours)
  hhmmss.push(minutes)
  hhmmss.push(seconds)

  return hhmmss.join(':');

}


/*

async function gpsCoords() {
  console.log('gps')
  
  var position = await getGeoLocation()
  if (position) {
  
    var lat = position.coords.latitude
    var lng = position.coords.longitude
    
    var weatherUrl = 'https://www.wunderground.com/weather/' + lat + ',' + lng
    
  } else {
  
    var weatherUrl = 'https://www.wunderground.com/weather/' + prCourse.courseInfo.courseCoords.lat + ',' + prCourse.courseInfo.courseCoords.lng

  }
  
  
    var weatherUrl = setWeatherHref({
      
        weatherUrl:'',
        city:prCourse.courseInfo['City'],
        state:prCourse.courseInfo['State'],
        country:'US',
        type:'weather',
        element:null
        
  })

  console.log(weatherUrl)

//  var w = await getWeather(weatherUrl)
  
  var response = await fetch( 'https://cors.bridged.cc/' + weatherUrl);

  let w = await response.text(); // read response body as text
  console.log(w.length)
  
  var rtn = parseUweather(w)
  
  return rtn

}

async function courseUCoords() {
  console.log('courseCoords')

//  var weatherUrl = 'https://www.wunderground.com/weather/' + prCourse.courseInfo.courseCoords.lat + ',' + prCourse.courseInfo.courseCoords.lng
    var weatherUrl = setWeatherHref({
      
        weatherUrl:'',
        city:prCourse.courseInfo['City'],
        state:prCourse.courseInfo['State'],
        country:'US',
        type:'weather',
        element:null
        
  })
  console.log(weatherUrl)

//  var w = await getWeather(weatherUrl)
  
  var response = await fetch( 'https://cors.bridged.cc/' + weatherUrl);

  let w = await response.text(); // read response body as text
  console.log(w.length)
//  console.log(w)
  
  var rtn = await parseUweather(w)
  
  return rtn

}

async function manualStation() {

  console.log('manualStation')
  var weatherUrl = setWeatherHref({
      
        weatherUrl:prCourse.courseInfo['Uweather StationId'],
        city:prCourse.courseInfo['City'],
        state:prCourse.courseInfo['State'],
        country:'US',
        type:'weather',
        element:null
        
  })

  console.log(weatherUrl)

//  var w = await getWeather(weatherUrl)
  
  var response = await fetch( 'https://cors.bridged.cc/' + weatherUrl);

  let w = await response.text(); // read response body as text

  
  console.log('manualStation')
  console.log(w.length)
    console.log(w)

  var rtn = parseUweather(w)
  
  return rtn

}


*/
</script >



