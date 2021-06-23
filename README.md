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

Full Courses Maintenance

x Retro show-hcp to getRounds

Re-format home

                tee times

    Handicap	Rounds		Stats

    Courses		Golfers		Clubs

                Play round

                Settings 

Post Round Save

    calc hcp

        get mostRecent20HcpDiff(hcpMethod, hcpIncludeSmall)
        store in Options
        calc hcp
        store in Options


    Update Courses
        Nbr Times Played        !	=>  Add one
        Avg Play Time	        !   =>  Calc
        
        Course Handicap	        ?   =>  Courses - Crs Hcp & Playround - Crs Hcp
        Target Score	        ?   =>  
            calcTargetScore(mostRecent20HcpDiff, targetHandicap, courseRating, slopeRating, courseRatingFront9)
        Course Equivalent Score ?

    Update Options
        Current Handicap


Stats
