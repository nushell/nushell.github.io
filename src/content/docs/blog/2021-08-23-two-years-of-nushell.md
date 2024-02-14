---
title: Two years of Nushell
author: The Nu Authors
author_site: https://twitter.com/nu_shell
author_image: https://www.nushell.sh/blog/images/nu_logo.png
description: Happy birthday, Nushell! Today mark's the second year for Nushell.
---

# Two years of Nushell

![Stock cake photo with a 2](/assets/images/two_year_cake.png)

_Happy birthday, Nushell!_

Happy birthday, Nushell! Today marks the second year for Nushell since its first public release. We wanted to write a bit about what the last year has meant and share some of the highlights and lowlights along the way.

## Focus

Through out Nushell's first year, we had faith in the basics behind Nushell but couldn't guess how it would grow and what it might be able to do. As we progressed through this second year, the project gained a focus: **to be the best tool for interactively working with your system and your data**.

It's a high bar to set, but we're happy to try to achieve that goal. To achieve it, we're focusing on three different parts of Nushell, each of which deeply connects to the other two.

### Nushell, the language

Nushell (sometimes shortened to just Nu) is a language that allows you to easily create pipelines for working on structured data. As a language, Nushell has grown considerably over the last year. You're now able to make your own commands to process data, create aliases, variables, and much much more.

We've started collecting examples to share with each other as Nushell grows and our skill with it grows with it. You can check them out in the [Nu Scripts repo](https://github.com/nushell/nu_scripts).

![Dark theme vscode showing Nushell](/assets/images/two_year_vscode.png)

To work with Nushell, we also published a [vscode extension](https://marketplace.visualstudio.com/items?itemName=TheNuProjectContributors.vscode-nushell-lang).

### Nushell, the shell

From day #1, Nushell has always been intended to work well as a shell. It's even in the name 🙂.

We've spent a lot of time this year steadily improving areas that make Nushell -- as a shell -- feel better, more stable, and generally easier to use. We've improved integrations with [Python](https://github.com/nushell/nu_scripts/tree/main/virtual_environments), integrations with tools like [zoxide](https://github.com/ajeetdsouza/zoxide) and [starship](https://github.com/starship/starship), and more. That said, as more people have adopted it, we've learned more what regular shell users need. Lots of ideas going into next year as to places that Nushell can work better with the broader range of tools and techniques that commandline users use.

### Nushell, the data analysis tool

A relatively new aspect of being an interactive tool for working with data is Nushell's recent adoption of supporting dataframes. Dataframes allow users to work with large datasets in an efficient way. Recent versions of Nushell, using dataframes, are able to process and aggregate data from [5 million line csv files in less than a second](https://www.nushell.sh/blog/2021-07-13-nushell_0_34#dataframes-elferherrera). Did we mention dataframes are fast?

We'll be exploring how best to more-fully integrate dataframes with the rest of the Nushell features in the coming year.

## Highlights

### Seeing what Nushell will become

With 0.32, we first [got a glimpse of what the Nushell language will become](https://www.nushell.sh/blog/2021-06-01-nushell_0_32#new-expression-syntax-jt). With 0.34, we saw [what data processing could be](https://www.nushell.sh/blog/2021-07-13-nushell_0_34#dataframes-elferherrera). These recent releases help to sketch where Nushell will feel like when it hits 1.0.

One example that shows this off is the script we use every week to create the This Week in Nu newsletter. As you can see, [it's a full script](https://github.com/nushell/nu_scripts/blob/main/make_release/this_week_in_nu_release.nu) of the sort you might write in Python or Ruby.

### Growing love

We're seeing a growing amount of love for Nushell as more people try it and share their experiences. Here are some tweets from the last few weeks:

![Oh damn @nu_shell is awesome. It's a really powerful advancement over existing shells on unix!](/assets/images/two_year_tweet1.png)

![The pandas style dataframe feature in nushell is Exploding head♥](/assets/images/two_year_tweet2.png)

![@nu_shell has fundamentally changed the way I interact with data on my computer. It's no longer a process to get anything out of a csv, etc. It's just... there. however I want it served up.](/assets/images/two_year_tweet3.png)

![Acabo de probar el @nu_shell y estoy enamorao](/assets/images/two_year_tweet4.png)

![Nu Shell is amazing. I can’t believe it took me this long to find it.](/assets/images/two_year_tweet5.png)

The Nushell repo has also felt a recent surge of interest. Since this time last year, the number of stars has nearly doubled!

![image of with the number of GitHub stars doubling over the last year](/assets/images/two_year_stars.png)

_Growing interest in Nushell (shown: number of GitHub stars)_

### Nushell getting used for real things

We're getting feedback from folks using Nushell about how much time Nushell saves them everyday. One report mentioned that their daily processing of files was cut by as much as 30 minutes! Saving 30 mins per day is an enormous amount, and we're happy to help.

Another area where Nushell is getting used is to process [Covid data in Ecuador](https://twitter.com/cocoronata) (you can see [more recent scripts written all in Nushell here](https://github.com/cocoronata/ecuacovid-scripts)).

## Contributors

As of this post, 280 contributors helped make Nushell what it is today. A _big_ thank you to the contributors who helped us get to this point!

1ntEgr8, AaronC81, aborruso, acanalis, AdminXVII, aeosynth, aeshirey, agateau, ahkrr, aidanharris, alexshadley, almindor, Aloso, Amanita-muscaria, amitdev, ammkrn, amousa11, andrasio, Andy-Python-Programmer, apatrushev, arashout, ArturKovacs, autophagy, avandesa, avranju, Azgrom, bailey-layzer, baoyachi, BatmanAoD, bbkane, bndbsh, Bocom, Borimino, Br1ght0ne, BradyBromley, brightly-salty, BurNiinTRee, Byron, casidiablo, CBenoit, ccde177b5fb9b8c55078417b4c9fee, charlespierce, chhetripradeep, chrisfinazzo, ChristopherBiscardi, cjpearce, coolshaurya, cristicismas, DangerFunPants, daschl, davidmalcolm, dbofmmbt, defstryker, Delapouite, dependabot[bot], Detegr, devnought, Dietr1ch, diogomafra, dirtybit, DivineGod, djc, dmeijboom, DonnotPanic, drmason13, DrSensor, dywedir, dyxushuai, efx, elferherrera, elichai, EmNudge, eoinkelly, epost, equal-l2, est31, EverlastingBugstopper, fdncred, fhalim, filaretov, Flare576, Garfield96, gdhuper, gilesv, gillespiecd, gonatz, gorogoroumaru, GuillaumeGomez, Gymea, hampuslidin, hdhoang, he4d, hedonihilist, henriiik, HiranmayaGundu, hirschenberger, homburg, iamcodemaker, ibraheemdev, iCodeSometime, iliekturtles, ilius, incrop, ineol, itn3000, Jacobious52, jafriyie1, jakevossen5, jankeromnes, jankoprowski, janosimas, JCavallo, jdvr, jerodsanto, JesterOrNot, jgoday, jinlow, jjshanks, jntrnr, John-Goff, johnae, johnterickson, jonahsnider, JonathanArns, JonnyWalker81, jonstodle, jonstodle-webstep, JosephTLyons, just1a-person, jz448, jzaefferer, k-brk, Kelli314, klnusbaum, kloun, knottio, kornelski, kubouch, kvrhdn, lambdagolem, landaire, lesichkovm, LhKipp, lightclient, lily-mara, lincis, LittleboyHarry, LovecraftianHorror, lpil, luccasmmg, LyesSaadi, marcelocg, MarcoIeni, margguo, matsuu, mattclarke, mattyhall, max-sixty, mcbattirola, mfarberbrodsky, mhmdanas, mike-morr, miller-time, mlbright, moonrise-tk, morbatex, morrme, mvolkmann, naefl, nalpine, nalshihabi, nathom, naufraghi, nespera, neuronull, nibon7, nickgerace, nightscape, NiklasJonsson, nmandery, notryanb, oknozor, onthebridgetonowhere, orf, orientnab, oskarskog, pag4k, palashahuja, Paradiesstaub, phaunt, philip-peterson, piotrek-szczygiel, pka, pontaoski, Porges, prrao87, pulpdrew, quebin31, Qwanve, rabisg0, radekvit, ramonsnir, reaganmcf, realcundo, RedlineTriad, rezural, richardpark-msft, rimathia, ritobanrc, rjboas, rnxpyke, routrohan, RReverser, rrichardson, rtlechow, ryuichi1208, sambordo1, Samboy218, samhedin, samuelvanderwaal, sandorex, schrieveslaach, Sciencentistguy, scrabsha, sdfnz, sebastian-xyz, shaaraddalvi, sholderbach, siedentop, skelly37, smaydew, Sosthene-Guedon, soumil-07, sousajf1, Southclaws, stevenbarragan, stormasm, suzanje, svartalf, Sympatron, syndek, taiki-e, tchak, TechWatching, thegedge, therealprof, tiffany352, tim77, Tiwalun, TrevorAC99, tumdum, tupini07, tw4452852, twe4ked, twitu, u5surf, UltraWelfare, uma0317, utam0k, ve-nt, VincentWo, vladdoster, voanhduy1512, vsoch, vthriller, waldyrious, warrenseine, WatsonThink, watzon, waywardmonkeys, wcarss, wycats, x3rAx, xolve, yaahc, yahsinhuangtw, yanganto, yaymukund, Yethal, ymgyt, zkat

## Lowlights

### Completions

We've known for quite a long time that to have a strong shell experience means having strong completions. Shells like fish are an example of what's possible with completions, and it's an easy feature to miss if the shell you move to doesn't support them at the same level.

In Nushell, we hit a bit of a snag as we built out completions - we had a bug in the language. It was one of those nasty ones that makes scripts hard to debug, variables leaking from one scope to another. We knew that it'd make creating custom completions far harder.

We've been hard at work on a [rebuild of important parts of Nushell](https://github.com/jntrnr/engine-q) for correctness that hopes to address this. Once it lands, we'll be able to turn our collective attention to standing up a full completion design that allows users to write completions in Nushell.

### Forgotten dreams

For the last two years, we've been hoping to spend more time on making Nushell work well in other environments. Projects like our [Jupyter notebook experiment](https://github.com/nushell/nu_jupyter) show a tiny piece of what might be possible, but we haven't yet been able to commit time to create a more complete implementation (or our own notebook).

## Looking ahead

Over the next year, as we close the gaps in functionality to bring Nushell up to a higher level of polish as a language, shell, and data system, we'll be taking a hard look at what will become part of the 1.0 release. While there isn't a date set, yet, will be looking at the feedback from users telling us how well various features work and which should be included in Nushell's first stable release.

If you're interested in helping get us there, come join us in the [discord](https://discord.gg/NtAbbGn) and [repo](https://github.com/nushell/nushell/) and let's see just how good Nushell can be.

_Cake photo from: https://depositphotos.com/stock-photos/birthday-cake-2.html_
