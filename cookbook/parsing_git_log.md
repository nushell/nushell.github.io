---
title: Parsing Git Log
---

# Parsing Git Log

# Let's parse git log

This `git log` command is interesting but you can't do a lot with it like this.

`> git log`

Let's make it more parsable

`> git log --pretty="%h|%s|%aN|%aE|%aD" -n 25`

This will work but I've been burnt by this in the past when a pipe `|` gets injected in the commits.

So, let's try again with something that most likely won't show up in commits, `»¦«`. Also, since we're not using a pipe now we don't have to use quotes around the pretty format string. Notice that the output is just a bunch of strings.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5`

```
0ee054b1»¦«Fix `to md` errors (#2729)»¦«Joseph T. Lyons»¦«JosephTLyons@users.noreply.github.com»¦«Fri, 6 Nov 2020 12:40:53 -0500
80b39454»¦«Change Nu Shell and NuShell to Nushell (#2728)»¦«Leonhard Kipp»¦«leonhard.kipp@web.de»¦«Fri, 6 Nov 2020 18:39:49 +0100
97f3671e»¦«web scraping with css selectors (#2725)»¦«Darren Schroeder»¦«343840+fdncred@users.noreply.github.com»¦«Tue, 3 Nov 2020 15:46:42 -0600
b674cee9»¦«Remove the recursely-dep'd tests (#2727)»¦«Jonathan Turner»¦«jonathandturner@users.noreply.github.com»¦«Wed, 4 Nov 2020 09:26:07 +1300
cb8491cf»¦«Bump to 0.22 (#2726)»¦«Jonathan Turner»¦«jonathandturner@users.noreply.github.com»¦«Wed, 4 Nov 2020 07:31:41 +1300
```

Ahh, much better. Now that we have the raw data, let's try to parse it with nu.

First we need to get it in lines or rows. Notice that the output is now in a table format.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines`

```
╭───┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ 0 │ 0ee054b1»¦«Fix `to md` errors (#2729)»¦«Joseph T. Lyons»¦«JosephTLyons@users.noreply.github.com»¦«Fri, 6 Nov 2020 12:40:53 -0500                  │
│ 1 │ 80b39454»¦«Change Nu Shell and NuShell to Nushell (#2728)»¦«Leonhard Kipp»¦«leonhard.kipp@web.de»¦«Fri, 6 Nov 2020 18:39:49 +0100                 │
│ 2 │ 97f3671e»¦«web scraping with css selectors (#2725)»¦«Darren Schroeder»¦«343840+fdncred@users.noreply.github.com»¦«Tue, 3 Nov 2020 15:46:42 -0600  │
│ 3 │ b674cee9»¦«Remove the recursely-dep'd tests (#2727)»¦«Jonathan Turner»¦«jonathandturner@users.noreply.github.com»¦«Wed, 4 Nov 2020 09:26:07 +1300 │
│ 4 │ cb8491cf»¦«Bump to 0.22 (#2726)»¦«Jonathan Turner»¦«jonathandturner@users.noreply.github.com»¦«Wed, 4 Nov 2020 07:31:41 +1300                     │
╰───┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```
That's more like nushell, but it would be nice to have some columns.

We used the delimiter `»¦«` specifically so we can create columns so let's use it like this.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«"`

```
╭───┬──────────┬────────────────────────────────────────────────┬──────────────────┬──────────────────────────────────────────┬────────────────────────────────╮
│ # │ Column1  │ Column2                                        │ Column3          │ Column4                                  │ Column5                        │
├───┼──────────┼────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────────────┼────────────────────────────────┤
│ 0 │ 0ee054b1 │ Fix `to md` errors (#2729)                     │ Joseph T. Lyons  │ JosephTLyons@users.noreply.github.com    │ Fri, 6 Nov 2020 12:40:53 -0500 │
│ 1 │ 80b39454 │ Change Nu Shell and NuShell to Nushell (#2728) │ Leonhard Kipp    │ leonhard.kipp@web.de                     │ Fri, 6 Nov 2020 18:39:49 +0100 │
│ 2 │ 97f3671e │ web scraping with css selectors (#2725)        │ Darren Schroeder │ 343840+fdncred@users.noreply.github.com  │ Tue, 3 Nov 2020 15:46:42 -0600 │
│ 3 │ b674cee9 │ Remove the recursely-dep'd tests (#2727)       │ Jonathan Turner  │ jonathandturner@users.noreply.github.com │ Wed, 4 Nov 2020 09:26:07 +1300 │
│ 4 │ cb8491cf │ Bump to 0.22 (#2726)                           │ Jonathan Turner  │ jonathandturner@users.noreply.github.com │ Wed, 4 Nov 2020 07:31:41 +1300 │
╰───┴──────────┴────────────────────────────────────────────────┴──────────────────┴──────────────────────────────────────────┴────────────────────────────────╯
```

Yay, for columns! But wait, it would really be nice if those columns had something other than generically named column names.

Let's try adding the columns names to `split column` like this.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date`

Ahhh, that looks much better.
```
╭───┬──────────┬────────────────────────────────────────────────┬──────────────────┬──────────────────────────────────────────┬────────────────────────────────╮
│ # │ commit   │ subject                                        │ name             │ email                                    │ date                           │
├───┼──────────┼────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────────────┼────────────────────────────────┤
│ 0 │ 0ee054b1 │ Fix `to md` errors (#2729)                     │ Joseph T. Lyons  │ JosephTLyons@users.noreply.github.com    │ Fri, 6 Nov 2020 12:40:53 -0500 │
│ 1 │ 80b39454 │ Change Nu Shell and NuShell to Nushell (#2728) │ Leonhard Kipp    │ leonhard.kipp@web.de                     │ Fri, 6 Nov 2020 18:39:49 +0100 │
│ 2 │ 97f3671e │ web scraping with css selectors (#2725)        │ Darren Schroeder │ 343840+fdncred@users.noreply.github.com  │ Tue, 3 Nov 2020 15:46:42 -0600 │
│ 3 │ b674cee9 │ Remove the recursely-dep'd tests (#2727)       │ Jonathan Turner  │ jonathandturner@users.noreply.github.com │ Wed, 4 Nov 2020 09:26:07 +1300 │
│ 4 │ cb8491cf │ Bump to 0.22 (#2726)                           │ Jonathan Turner  │ jonathandturner@users.noreply.github.com │ Wed, 4 Nov 2020 07:31:41 +1300 │
╰───┴──────────┴────────────────────────────────────────────────┴──────────────────┴──────────────────────────────────────────┴────────────────────────────────╯
```

Hmmm, that date string is a string. If it were a date vs a string it could be used for sorting by date. The way we do that is we have to convert the date time to a real datetime and update the column. Try this.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime}`

Now this looks more nu-ish
```
╭───┬──────────┬────────────────────────────────────────────────┬──────────────────┬──────────────────────────────────────────┬────────────╮
│ # │ commit   │ subject                                        │ name             │ email                                    │ date       │
├───┼──────────┼────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────────────┼────────────┤
│ 0 │ 0ee054b1 │ Fix `to md` errors (#2729)                     │ Joseph T. Lyons  │ JosephTLyons@users.noreply.github.com    │ 3 days ago │
│ 1 │ 80b39454 │ Change Nu Shell and NuShell to Nushell (#2728) │ Leonhard Kipp    │ leonhard.kipp@web.de                     │ 3 days ago │
│ 2 │ 97f3671e │ web scraping with css selectors (#2725)        │ Darren Schroeder │ 343840+fdncred@users.noreply.github.com  │ 5 days ago │
│ 3 │ b674cee9 │ Remove the recursely-dep'd tests (#2727)       │ Jonathan Turner  │ jonathandturner@users.noreply.github.com │ 5 days ago │
│ 4 │ cb8491cf │ Bump to 0.22 (#2726)                           │ Jonathan Turner  │ jonathandturner@users.noreply.github.com │ 5 days ago │
╰───┴──────────┴────────────────────────────────────────────────┴──────────────────┴──────────────────────────────────────────┴────────────╯
```
If we want to revert back to a date string we can do something like this with the `nth` command and the `get` command.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | nth 3 | get date`

```
2020-11-03 20:26:07 UTC
```

Cool! Now that we have a real datetime we can do some interesting things with it like `group-by` or `sort-by` or `where`.
Let's try `sort-by` first

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | sort-by date`

```
╭────┬──────────┬───────────────────────────────────────────────────────────────────────────────────────┬────────────────────┬──────────────────────────────────────────────┬─────────────╮
│ #  │ commit   │ subject                                                                               │ name               │ email                                        │ date        │
├────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────┼────────────────────┼──────────────────────────────────────────────┼─────────────┤
│  0 │ 1d833ef9 │ Set weather chars as emoji only (#2691)                                               │ Chris Gillespie    │ 6572184+gillespiecd@users.noreply.github.com │ 2 weeks ago │
│  1 │ 77ffd067 │ Allow appending table literals. (#2693)                                               │ Andrés N. Robalino │ andres@androbtech.com                        │ 2 weeks ago │
│  2 │ 22f67be4 │ added some weather symbols back and changed to emoji (#2695)                          │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 2 weeks ago │
│  3 │ 502c9ea7 │ Radix added to str decimal conversion (#2696)                                         │ Chris Gillespie    │ 6572184+gillespiecd@users.noreply.github.com │ 2 weeks ago │
│  4 │ 6951fb44 │ Remove it expansion (#2701)                                                           │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 2 weeks ago │
│  5 │ a6fdee4a │ bump to 0.21.1 (#2702)                                                                │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 2 weeks ago │
│  6 │ 1b0ed305 │ Added a bunch of extensions as helpers (#2698)                                        │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 2 weeks ago │
│  7 │ c283db37 │ Always escape non-literal arguments when running external command (#2697)             │ Benoît C           │ benoit.cortier@fried-world.eu                │ 1 week ago  │
│  8 │ ee765235 │ Add in parameter inference for blocks (#2706)                                         │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 1 week ago  │
│  9 │ 8229af75 │ Improve parameter inference for blocks (#2708)                                        │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 1 week ago  │
│ 10 │ 46d1938f │ add unicode to char command to print any unicode character (#2709)                    │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 1 week ago  │
│ 11 │ c6fe5846 │ Change alias shape inference to proposal of RFC#4 (#2685)                             │ Leonhard Kipp      │ leonhard.kipp@web.de                         │ 1 week ago  │
│ 12 │ 666fbbb0 │ Precision added to round cmd (#2710)                                                  │ Chris Gillespie    │ 6572184+gillespiecd@users.noreply.github.com │ 1 week ago  │
│ 13 │ 4e17292a │ Seq for nushell (#2704)                                                               │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 1 week ago  │
│ 14 │ 5faa82e3 │ Update required rust version (#2718)                                                  │ Joshua Shanks      │ jjshanks@gmail.com                           │ 1 week ago  │
│ 15 │ f97561c4 │ Inode added to ls -l (#2711)                                                          │ Chris Gillespie    │ 6572184+gillespiecd@users.noreply.github.com │ 1 week ago  │
│ 16 │ ec77c572 │ handle precision a tiny bit better than just hard coding to 4 decimal places. (#2712) │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 1 week ago  │
│ 17 │ 0f7e1d4d │ Support broad range of escape sequences (#2719)                                       │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 1 week ago  │
│ 18 │ 50dd56d3 │ bugfix for when pathext ends in ';' (#2723)                                           │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 6 days ago  │
│ 19 │ 8196b031 │ Delete comments showing output of older nu version (#2717)                            │ Leonhard Kipp      │ leonhard.kipp@web.de                         │ 6 days ago  │
│ 20 │ cb8491cf │ Bump to 0.22 (#2726)                                                                  │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 5 days ago  │
│ 21 │ b674cee9 │ Remove the recursely-dep'd tests (#2727)                                              │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 5 days ago  │
│ 22 │ 97f3671e │ web scraping with css selectors (#2725)                                               │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 5 days ago  │
│ 23 │ 80b39454 │ Change Nu Shell and NuShell to Nushell (#2728)                                        │ Leonhard Kipp      │ leonhard.kipp@web.de                         │ 3 days ago  │
│ 24 │ 0ee054b1 │ Fix `to md` errors (#2729)                                                            │ Joseph T. Lyons    │ JosephTLyons@users.noreply.github.com        │ 3 days ago  │
╰────┴──────────┴───────────────────────────────────────────────────────────────────────────────────────┴────────────────────┴──────────────────────────────────────────────┴─────────────╯
```
That's neat but what if I want it sorted in the opposite order?  Try the `reverse` command and notice the newest commits are at the top.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | sort-by date | reverse`

```
╭────┬──────────┬───────────────────────────────────────────────────────────────────────────────────────┬────────────────────┬──────────────────────────────────────────────┬─────────────╮
│ #  │ commit   │ subject                                                                               │ name               │ email                                        │ date        │
├────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────┼────────────────────┼──────────────────────────────────────────────┼─────────────┤
│  0 │ 0ee054b1 │ Fix `to md` errors (#2729)                                                            │ Joseph T. Lyons    │ JosephTLyons@users.noreply.github.com        │ 3 days ago  │
│  1 │ 80b39454 │ Change Nu Shell and NuShell to Nushell (#2728)                                        │ Leonhard Kipp      │ leonhard.kipp@web.de                         │ 3 days ago  │
│  2 │ 97f3671e │ web scraping with css selectors (#2725)                                               │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 5 days ago  │
│  3 │ b674cee9 │ Remove the recursely-dep'd tests (#2727)                                              │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 5 days ago  │
│  4 │ cb8491cf │ Bump to 0.22 (#2726)                                                                  │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 5 days ago  │
│  5 │ 8196b031 │ Delete comments showing output of older nu version (#2717)                            │ Leonhard Kipp      │ leonhard.kipp@web.de                         │ 6 days ago  │
│  6 │ 50dd56d3 │ bugfix for when pathext ends in ';' (#2723)                                           │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 6 days ago  │
│  7 │ 0f7e1d4d │ Support broad range of escape sequences (#2719)                                       │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 1 week ago  │
│  8 │ ec77c572 │ handle precision a tiny bit better than just hard coding to 4 decimal places. (#2712) │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 1 week ago  │
│  9 │ f97561c4 │ Inode added to ls -l (#2711)                                                          │ Chris Gillespie    │ 6572184+gillespiecd@users.noreply.github.com │ 1 week ago  │
│ 10 │ 5faa82e3 │ Update required rust version (#2718)                                                  │ Joshua Shanks      │ jjshanks@gmail.com                           │ 1 week ago  │
│ 11 │ 4e17292a │ Seq for nushell (#2704)                                                               │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 1 week ago  │
│ 12 │ 666fbbb0 │ Precision added to round cmd (#2710)                                                  │ Chris Gillespie    │ 6572184+gillespiecd@users.noreply.github.com │ 1 week ago  │
│ 13 │ c6fe5846 │ Change alias shape inference to proposal of RFC#4 (#2685)                             │ Leonhard Kipp      │ leonhard.kipp@web.de                         │ 1 week ago  │
│ 14 │ 46d1938f │ add unicode to char command to print any unicode character (#2709)                    │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 1 week ago  │
│ 15 │ 8229af75 │ Improve parameter inference for blocks (#2708)                                        │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 1 week ago  │
│ 16 │ ee765235 │ Add in parameter inference for blocks (#2706)                                         │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 1 week ago  │
│ 17 │ c283db37 │ Always escape non-literal arguments when running external command (#2697)             │ Benoît C           │ benoit.cortier@fried-world.eu                │ 1 week ago  │
│ 18 │ 1b0ed305 │ Added a bunch of extensions as helpers (#2698)                                        │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 2 weeks ago │
│ 19 │ a6fdee4a │ bump to 0.21.1 (#2702)                                                                │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 2 weeks ago │
│ 20 │ 6951fb44 │ Remove it expansion (#2701)                                                           │ Jonathan Turner    │ jonathandturner@users.noreply.github.com     │ 2 weeks ago │
│ 21 │ 502c9ea7 │ Radix added to str decimal conversion (#2696)                                         │ Chris Gillespie    │ 6572184+gillespiecd@users.noreply.github.com │ 2 weeks ago │
│ 22 │ 22f67be4 │ added some weather symbols back and changed to emoji (#2695)                          │ Darren Schroeder   │ 343840+fdncred@users.noreply.github.com      │ 2 weeks ago │
│ 23 │ 77ffd067 │ Allow appending table literals. (#2693)                                               │ Andrés N. Robalino │ andres@androbtech.com                        │ 2 weeks ago │
│ 24 │ 1d833ef9 │ Set weather chars as emoji only (#2691)                                               │ Chris Gillespie    │ 6572184+gillespiecd@users.noreply.github.com │ 2 weeks ago │
╰────┴──────────┴───────────────────────────────────────────────────────────────────────────────────────┴────────────────────┴──────────────────────────────────────────────┴─────────────╯
```

Now let's try `group-by` and see what happens. This is a tiny bit tricky because dates are tricky. When you use `group-by` on dates you have to remember to use the `group-by date` subcommand so it's `group-by date date_column_name`.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | group-by date date`

```
╭───┬────────────────┬────────────────┬────────────────┬────────────────┬────────────────┬────────────────┬────────────────┬────────────────┬────────────────╮
│ # │ 2020-11-06     │ 2020-11-03     │ 2020-11-02     │ 2020-10-30     │ 2020-10-29     │ 2020-10-28     │ 2020-10-27     │ 2020-10-26     │ 2020-10-22     │
├───┼────────────────┼────────────────┼────────────────┼────────────────┼────────────────┼────────────────┼────────────────┼────────────────┼────────────────┤
│ 0 │ [table 2 rows] │ [table 4 rows] │ [table 1 rows] │ [table 4 rows] │ [table 2 rows] │ [table 2 rows] │ [table 3 rows] │ [table 4 rows] │ [table 3 rows] │
╰───┴────────────────┴────────────────┴────────────────┴────────────────┴────────────────┴────────────────┴────────────────┴────────────────┴────────────────╯
```
This would look better if we pivot the data and name the columns

`git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | group-by date date | pivot date count`

```
╭───┬────────────┬────────────────╮
│ # │ date       │ count          │
├───┼────────────┼────────────────┤
│ 0 │ 2020-11-06 │ [table 2 rows] │
│ 1 │ 2020-11-03 │ [table 4 rows] │
│ 2 │ 2020-11-02 │ [table 1 rows] │
│ 3 │ 2020-10-30 │ [table 4 rows] │
│ 4 │ 2020-10-29 │ [table 2 rows] │
│ 5 │ 2020-10-28 │ [table 2 rows] │
│ 6 │ 2020-10-27 │ [table 3 rows] │
│ 7 │ 2020-10-26 │ [table 4 rows] │
│ 8 │ 2020-10-22 │ [table 3 rows] │
╰───┴────────────┴────────────────╯
```

How about `where` now? Show only the records that are less than a year old.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | where date < 365day`

```
╭─────┬──────────┬─────────────────────────────────────────────────────────────────────────┬──────────────────────────┬───────────────────────────────────────────────────┬───────────────╮
│  #  │ commit   │ subject                                                                 │ name                     │ email                                             │ date          │
├─────┼──────────┼─────────────────────────────────────────────────────────────────────────┼──────────────────────────┼───────────────────────────────────────────────────┼───────────────┤
│   0 │ 0ee054b1 │ Fix `to md` errors (#2729)                                              │ Joseph T. Lyons          │ JosephTLyons@users.noreply.github.com             │ 3 days ago    │
│   1 │ 80b39454 │ Change Nu Shell and NuShell to Nushell (#2728)                          │ Leonhard Kipp            │ leonhard.kipp@web.de                              │ 3 days ago    │
│   2 │ 97f3671e │ web scraping with css selectors (#2725)                                 │ Darren Schroeder         │ 343840+fdncred@users.noreply.github.com           │ 5 days ago    │
│   3 │ b674cee9 │ Remove the recursely-dep'd tests (#2727)                                │ Jonathan Turner          │ jonathandturner@users.noreply.github.com          │ 5 days ago    │
│   4 │ cb8491cf │ Bump to 0.22 (#2726)                                                    │ Jonathan Turner          │ jonathandturner@users.noreply.github.com          │ 6 days ago    │
│   5 │ 8196b031 │ Delete comments showing output of older nu version (#2717)              │ Leonhard Kipp            │ leonhard.kipp@web.de                              │ 6 days ago    │
│   6 │ 50dd56d3 │ bugfix for when pathext ends in ';' (#2723)                             │ Darren Schroeder         │ 343840+fdncred@users.noreply.github.com           │ 6 days ago    │
│   7 │ 0f7e1d4d │ Support broad range of escape sequences (#2719)                         │ Darren Schroeder         │ 343840+fdncred@users.noreply.github.com           │ 1 week ago    │
│   8 │ ec77c572 │ handle precision a tiny bit better than just hard coding to 4 decimal   │ Darren Schroeder         │ 343840+fdncred@users.noreply.github.com           │ 1 week ago    │
│     │          │ places. (#2712)                                                         │                          │                                                   │               │
│   9 │ f97561c4 │ Inode added to ls -l (#2711)                                            │ Chris Gillespie          │ 6572184+gillespiecd@users.noreply.github.com      │ 1 week ago    │
│  10 │ 5faa82e3 │ Update required rust version (#2718)                                    │ Joshua Shanks            │ jjshanks@gmail.com                                │ 1 week ago    │
│  11 │ 4e17292a │ Seq for nushell (#2704)                                                 │ Darren Schroeder         │ 343840+fdncred@users.noreply.github.com           │ 1 week ago    │
│  12 │ 666fbbb0 │ Precision added to round cmd (#2710)                                    │ Chris Gillespie          │ 6572184+gillespiecd@users.noreply.github.com      │ 1 week ago    │
  ...
  ```

Or even show me all the commits in the last 7 days.
`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | where date < 7day`

```
╭───┬──────────┬────────────────────────────────────────────────────────────┬──────────────────┬──────────────────────────────────────────┬────────────╮
│ # │ commit   │ subject                                                    │ name             │ email                                    │ date       │
├───┼──────────┼────────────────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────────────┼────────────┤
│ 0 │ 0ee054b1 │ Fix `to md` errors (#2729)                                 │ Joseph T. Lyons  │ JosephTLyons@users.noreply.github.com    │ 3 days ago │
│ 1 │ 80b39454 │ Change Nu Shell and NuShell to Nushell (#2728)             │ Leonhard Kipp    │ leonhard.kipp@web.de                     │ 3 days ago │
│ 2 │ 97f3671e │ web scraping with css selectors (#2725)                    │ Darren Schroeder │ 343840+fdncred@users.noreply.github.com  │ 5 days ago │
│ 3 │ b674cee9 │ Remove the recursely-dep'd tests (#2727)                   │ Jonathan Turner  │ jonathandturner@users.noreply.github.com │ 6 days ago │
│ 4 │ cb8491cf │ Bump to 0.22 (#2726)                                       │ Jonathan Turner  │ jonathandturner@users.noreply.github.com │ 6 days ago │
│ 5 │ 8196b031 │ Delete comments showing output of older nu version (#2717) │ Leonhard Kipp    │ leonhard.kipp@web.de                     │ 6 days ago │
╰───┴──────────┴────────────────────────────────────────────────────────────┴──────────────────┴──────────────────────────────────────────┴────────────╯
```

Now, with the 365 day slice of data, let's `group-by` name where the commits are less than a year old. This table has a lot of columns so it's unreadable. However, if we `group-by` name and `pivot` the table things will look much cleaner. `Pivot` takes rows and turns them into columns or turns columns into rows.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | where date < 365day | group-by name | pivot`


  ```
╭─────┬──────────────────────────┬──────────────────╮
│  #  │ Column0                  │ Column1          │
├─────┼──────────────────────────┼──────────────────┤
│   0 │ Joseph T. Lyons          │ [table 77 rows]  │
│   1 │ Leonhard Kipp            │ [table 5 rows]   │
│   2 │ Darren Schroeder         │ [table 101 rows] │
│   3 │ Jonathan Turner          │ [table 442 rows] │
│   4 │ Chris Gillespie          │ [table 39 rows]  │
│   5 │ Joshua Shanks            │ [table 1 rows]   │
│   6 │ Benoît C                 │ [table 1 rows]   │
│   7 │ Andrés N. Robalino       │ [table 141 rows] │
│   8 │ morbatex                 │ [table 1 rows]   │
│   9 │ rjboas                   │ [table 1 rows]   │
│  10 │ Avery Harnish            │ [table 1 rows]   │
 ```
Side note: If you happen to get errors, pay attention to the error message. For instance, this error means that the data being returned from `git log` is somehow incomplete. Specifically, there is a missing date column. I've seen git commands work perfectly on Windows and not work at all on Linux or Mac. I'm not sure why. If you run into this issue, one easy way to temporarily avoid it is to limit `git log` results to a certain number like `git log -n 100`.

```
error: Unknown column
  ┌─ shell:1:124
  │
1 │ git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | where date < 365day
  │                                                                                                                            ^^^^
  │                                                                                                                            │
  │                                                                                                                            There isn't a column named 'date'
  │                                                                                                                            Perhaps you meant 'commit'? Columns available: commit, subject
  ```

Here's one tip for dealing with this error. We have a `do` command that has an `--ignore_errors` parameter. This is how you'd use it in the above example, if it were giving errors.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | do -i { split column "»¦«" commit subject name email date } | update date { get date | str to-datetime} | where date < 365day | group-by name | pivot`

Now, back to parsing.
What if we throw in the `sort-by` and `reverse` commands for good measure?

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | where date < 365day | group-by name | pivot | sort-by Column1 | reverse`

```
╭─────┬──────────────────────────┬──────────────────╮
│  #  │ Column0                  │ Column1          │
├─────┼──────────────────────────┼──────────────────┤
│   0 │ Jonathan Turner          │ [table 442 rows] │
│   1 │ Andrés N. Robalino       │ [table 141 rows] │
│   2 │ Darren Schroeder         │ [table 101 rows] │
│   3 │ Joseph T. Lyons          │ [table 77 rows]  │
│   4 │ Jason Gedge              │ [table 63 rows]  │
│   5 │ Chris Gillespie          │ [table 39 rows]  │
│   6 │ Sebastian Jung           │ [table 23 rows]  │
│   7 │ Yehuda Katz              │ [table 22 rows]  │
│   8 │ Shaurya Shubham          │ [table 21 rows]  │
│   9 │ Corvus Corax             │ [table 15 rows]  │
│  10 │ Arash Outadi             │ [table 15 rows]  │
│  11 │ Sean Hellum              │ [table 11 rows]  │
│  12 │ Jörn Zaefferer           │ [table 10 rows]  │
  ...
  ```

This is still a lot of data so let's just look at the top 10 and use the `rename` command to name the columns. We could've also provided the column names with the pivot command.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | where date < 365day | group-by name | pivot | sort-by Column1 | rename name commits | reverse | first 10`

```
╭───┬────────────────────┬──────────────────╮
│ # │ name               │ commits          │
├───┼────────────────────┼──────────────────┤
│ 0 │ Jonathan Turner    │ [table 442 rows] │
│ 1 │ Andrés N. Robalino │ [table 141 rows] │
│ 2 │ Darren Schroeder   │ [table 101 rows] │
│ 3 │ Joseph T. Lyons    │ [table 77 rows]  │
│ 4 │ Jason Gedge        │ [table 63 rows]  │
│ 5 │ Chris Gillespie    │ [table 39 rows]  │
│ 6 │ Sebastian Jung     │ [table 23 rows]  │
│ 7 │ Yehuda Katz        │ [table 22 rows]  │
│ 8 │ Shaurya Shubham    │ [table 21 rows]  │
│ 9 │ Corvus Corax       │ [table 15 rows]  │
╰───┴────────────────────┴──────────────────╯
```
Let's get rid of that [table x rows] thing because it's kind of ugly and just report the `count`.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | where date < 365day | group-by name | pivot | sort-by Column1 | rename name commits | reverse | first 10 | update commits {get commits | count }`
```
╭───┬────────────────────┬─────────╮
│ # │ name               │ commits │
├───┼────────────────────┼─────────┤
│ 0 │ Jonathan Turner    │     442 │
│ 1 │ Andrés N. Robalino │     141 │
│ 2 │ Darren Schroeder   │     101 │
│ 3 │ Joseph T. Lyons    │      77 │
│ 4 │ Jason Gedge        │      63 │
│ 5 │ Chris Gillespie    │      39 │
│ 6 │ Sebastian Jung     │      23 │
│ 7 │ Yehuda Katz        │      22 │
│ 8 │ Shaurya Shubham    │      21 │
│ 9 │ Corvus Corax       │      15 │
╰───┴────────────────────┴─────────╯
```
And there you have it. The top 10 committers and we learned a little bit of parsing along the way.

Here's one last little known command. Perhaps you don't want your table numbered starting with 0. Here's a way to change that with the `table` command.

`> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | update date { get date | str to-datetime} | where date < 365day | group-by name | pivot | sort-by Column1 | rename name commits | reverse | first 10 | update commits {get commits | count } | table -n 1`

```
╭────┬────────────────────┬─────────╮
│ #  │ name               │ commits │
├────┼────────────────────┼─────────┤
│  1 │ Jonathan Turner    │     442 │
│  2 │ Andrés N. Robalino │     141 │
│  3 │ Darren Schroeder   │     101 │
│  4 │ Joseph T. Lyons    │      77 │
│  5 │ Jason Gedge        │      63 │
│  6 │ Chris Gillespie    │      39 │
│  7 │ Sebastian Jung     │      23 │
│  8 │ Yehuda Katz        │      22 │
│  9 │ Shaurya Shubham    │      21 │
│ 10 │ Corvus Corax       │      15 │
╰────┴────────────────────┴─────────╯
```

Created on 11/9/2020 with Nushell on Windows 10.

| version | commit_hash                              | features                  |
| ------- | ---------------------------------------- | ------------------------- |
| 0.22.0  | 97f3671e2c649e9aef5a63ee4fd906bd37e6c371 | default, clipboard, trash |
