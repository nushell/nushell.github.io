---
title: Nushell 2023 Survey Results
author: The Nu Authors
author_site: https://twitter.com/nu_shell
author_image: https://www.nushell.sh/blog/images/nu_logo.png
excerpt: Let's take a look at the results of the 2023 Nushell survey
---

## Nushell Survey 2023

In August/September of this year, we put out a survey to learn about how Nushell was being used and to learn what was holding people back from using Nushell. In this post, we'll detail the results of that survey.

The survey had 451 responses, nearly triple what our 2019 survey had.

## Do you use Nushell?

![graph showing over half of respondents using Nushell](/assets/images/nushell_survey_2023_use_nushell.png)

Heart-warmingly, over half of the respondents say they're using Nushell. This gives us both a good view of how Nushell is being used, as well as good info about why it isn't.

Let's first look at how Nushell is being used.

## Where are you running Nushell?

![graph showing 93% personal machine, 52.9% work, 13.1% server, 3.7% cloud](/assets/images/nushell_survey_2023_running_nushell.png)

While the vast majority of Nushell users use Nushell on their personal machines, we couldn't help but notice over 50%(!) of users are using Nushell at work.

That's a great vote of confidence for Nushell as a tool in the toolbox.

## What area(s) should Nushell prioritize?

![graph showing a variety of different topics including file operations, completions, GUI and more](/assets/images/nushell_survey_2023_priorities.png)

The four main areas people wanted the Nushell project to focus on are:

- Completions (55.4%)
- Documentation (45.9%)
- Command/Subcommand discoverability (44.6%)
- Scripting support (41.6%)

These will be key areas to fill out as we approach 1.0, so that Nushell will be more of a polished experience.

## Do you use dataframes in Nushell?

Of Nushell users, 23.9% said they use dataframes in Nushell. Dataframes have long been a hopeful feature of Nushell, and it's encouraging to see it start to pick up momentum.

One of the challenges for Nushell going forward is to find the best way to integrate it with the rest of the system.

## Areas people like about Nushell

The areas people most liked about Nushell revolved around two areas: its use of structured data and the language built around working with structured data.

Another important topic was being crossplatform, allowing for users to drop into Nushell from Windows as easily as they might drop into a shell from a Unix-based system.

People also applauded the combination of good typechecking and good error messages to help guide the developer towards fixing issues in the code.

## Areas of improvement for Nushell

Areas that people felt Nushell could improve on varied widely, though there were a few areas that did come to the top:

### Language improvements

The need for consistency in the design of commands came up a few times, where people weren't sure why some commands take input and others take parameters.

### Documentation

In the responses, we also saw requests for more onboarding documentation, more recipes in cookbook style, and generally just better ways to discover and learn about Nushell.

### Stability

A few responders were annoyed that Nushell wasn't yet 1.0, which meant breakages between versions. Folks requested longer deprecation times to move code over, while others generally bemoaned having to update the configuration files after an upgrade.

### Bash-compatibility

People coming to Nushell from shells like Bash mentioned the difficulty in making the transition, both in terms of not all flags being supported in common commands like `ps` to Bash shorthands, to working with legacy Bash scripts.

## What platform(s) are you running Nushell on?

![graph showing different platforms (described below)](/assets/images/nushell_survey_2023_platforms.png)

Our top four platforms for Nushell area:

- Linux (79.9%)
- Windows (44.7%)
- macOS (32.8%)
- Android/Termux (7%)

## How did you install Nushell

![graph showing how people install Nushell (described below)](/assets/images/nushell_survey_2023_how_install.png)

- cargo install nu (44.7%)
- native package manager (37.7%)
- non-native package manager (27%)
- binary release (13.5%)
- build it myself (9.8%)

## Which version of Nushell are you running?

The majority of users use the latest version of Nushell their package manager supports (61.7%), followed by the latest released version (27.2%).

## Which terminal emulator do you use with Nushell?

The most popular terminals for working with Nushell are:

- Windows Terminal (38.8%)
- Alacritty (32.9%)
- Wezterm (20%)
- gnome-terminal (17.9%)
- iterm2 (12.5%)

## Why aren't you using Nushell?

- Prefer other shells/scripting language (26.3%)
- Too difficult to learn (13.2%)
- Doesn't help me achieve my goals (11.2%)

Amongst the free-form responses, we also saw themes of not needing Nushell's specific feature set, the need for more POSIX support (and working in restricted environments where only certain tools are allowed), and a big factor for folks was just having enough time to invest in learning a new system.

## Thank you!

A big "thank you!" to everyone who responded to the survey. It really means a lot to us, and it's a big help to make sure we continue to improve Nushell in the ways we need to for a good 1.0.

Below are some kind messages sent to us as part of the survey. Enjoy!

> "My heart belongs to Nushell! ❤️😉"

> "nushell is super cool and I wish you all the best!"

> "Appreciate the effort you've put into changing the shell landscape."

> "Awesome project, we've needed this for a long time. 🙏"

> "Please keep it up. Lovely discord and very nice community!"
