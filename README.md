# golfscorecard-v3
 
https://dmoritz10.github.io/golfscorecard-v3/


x Fix WGS Handicap
    Fix Course Handicap 
    Fix Target Score Calc

    Round Stats called from 
        Scorecard
        Handicap
        Rounds

    Playround called from
        Courses
        Home.btnPlayRound

x Fix re-positioning to top of listing
    Courses - edit course
    Courses - Playround

    Rounds - Round Stats
    Handicap - Round Stats

x Fix Courses Maintenance
    Calc Bogey Rating
    Calc default front / back ratings

x Fix weather rpt on SMS from Tee Times

x Port Course Maintenance
    x Full Courses Maintenance
    course delete

Sort Courses after add

x Retro show-hcp to getRounds

Re-format home

                tee times

    Handicap	Rounds		Stats

    Courses		Golfers		Clubs

                Play round

                Settings 

x Post Round Save

    x calc hcp

        get mostRecent20HcpDiff(hcpMethod, hcpIncludeSmall)
        store in Options
        calc hcp
        store in Options


    x Update Courses - i think I'm done
        Nbr Times Played        !	=>  Add one
        Avg Play Time	        !   =>  Calc
        
        Course Handicap	        ?   =>  Courses - Crs Hcp & Playround - Crs Hcp
        Target Score	        ?   =>  
            calcTargetScore(mostRecent20HcpDiff, targetHandicap, courseRating, slopeRating, courseRatingFront9)
        Course Equivalent Score ?

    x Update Options
        Current Handicap
        Nbr Rounds

Deprecate
    x (arrOptions['Handicap Diff Count']*1 + 1)) / .96) - arrOptions['Handicap Diff Sum']
    calcTS
    x currHandicap = arrOptions['Current Handicap']

x clone 'Settings' from 'Options'


x stats


x Fix weather report on sms

</a></div></div><p _ngcontent-sc271="">
</a></div ></div > <p _ngcontent

X fix Playround 
      $('#hpNbr_Times_Played').html ( courseInfo['Nbr Times Played'])
      $('#hpAvg_Play_Time').html ( courseInfo['Avg Play Time'])


x fix stats putting
    last 100 rounds putts / gir

x Fix Target Score = fixed

x Fix Hole Detail in Courses 
    courses.holeDetail = can't set lat/lng because prCourse not initialized

Tackle gender issue more generally

x Fix Calendar updates / deletes

x add nbr of times played to Golfers

x f/m for local courses = rename as 'favorite'

x Change name to Dan Golf - emailName


Firefox - scrub this as mozilla not supporting pwa s ?????
    permissions for geolocation
    sizing
    install pwa

x Start from scratch
    courses
    scorecards
    settings

x Save Sxs Hold Detail just in case

x Clear round after successful append

Recover Costa Mesa Country Club  (Los Lagos Course)	7/25/19  from Scorecards

x test collabration

x test for uniqueness golfers and clubs -->

x versioning - have an ok solution

x stats - line of closest fit for 

    hcp in CAS
    avg score by par
    tee to green

x Rounds - sort option

    Sort by Date Played
    Sort by Best Rounds (hcp diff)



    add reset button to pull down


