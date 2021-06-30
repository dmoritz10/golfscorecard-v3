# golfscorecard-v3
 
https://dmoritz10.github.io/golfscorecard-v3/


Fix WGS Handicap
    Fix Course Handicap 
    Fix Target Score Calc

    Round Stats called from 
        Scorecard
        Handicap
        Rounds

    Playround called from
        Courses
        Home.btnPlayRound

Fix re-positioning to top of listing
    Courses - edit course
    Courses - Playround

    Rounds - Round Stats
    Handicap - Round Stats

Fix Courses Maintenance
    Calc Bogey Rating
    Calc default front / back ratings

Fix weather rpt on SMS from Tee Times




Full Courses Maintenance

x Retro show-hcp to getRounds

Re-format home

                tee times

    Handicap	Rounds		Stats

    Courses		Golfers		Clubs

                Play round

                Settings 

Post Round Save

    x calc hcp

        get mostRecent20HcpDiff(hcpMethod, hcpIncludeSmall)
        store in Options
        calc hcp
        store in Options


    Update Courses - i think I'm done
        Nbr Times Played        !	=>  Add one
        Avg Play Time	        !   =>  Calc
        
        Course Handicap	        ?   =>  Courses - Crs Hcp & Playround - Crs Hcp
        Target Score	        ?   =>  
            calcTargetScore(mostRecent20HcpDiff, targetHandicap, courseRating, slopeRating, courseRatingFront9)
        Course Equivalent Score ?

    x Update Options
        Current Handicap

Deprecate
    (arrOptions['Handicap Diff Count']*1 + 1)) / .96) - arrOptions['Handicap Diff Sum']
    calcTS
    currHandicap = arrOptions['Current Handicap']


Stats


Fix weather report on sms

</a></div></div><p _ngcontent-sc271="">
</a></div ></div > <p _ngcontent

fix Playround 
      $('#hpNbr_Times_Played').html ( courseInfo['Nbr Times Played'])
      $('#hpAvg_Play_Time').html ( courseInfo['Avg Play Time'])


fix stats putting
    last 100 rounds putts / gir

    