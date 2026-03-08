---
layout: post
title: "How Much Time Have I Actually Spent on This Thing?"
date: 2026-03-08
subtitle: "If I ever become a consultant and need to define billable hours..."
tags: [powershell, git]
comments: true
---

I was procrastinating, as I do, and started wondering at some point how much time I've actually spent on some of these projects. 

I would like to be able to tell people at work, "Bro, btw, I've spent about 100 hours on this project so far," but I dont want to track my time manually. 

Or maybe this could be a new way to make my blog or linkedin posts more interesting so the few readers will have an idea of how much time and effort is often needed to build stuff, instead of just a "hey, look at this thing I made." 

Since I use git for my coding projects, i figured there's gotta be a way to use git to get that info. 

Talked to my best LLM friends and here's what we've got so far: 

{% include codeHeader.html %}
```powershell
$threshold = 30   # minutes gap before a new "session"
$sessionBuffer = 30  # minutes to assume before first commit of each session

$times = git log --pretty=format:"%ct" --reverse |
    ForEach-Object { [DateTimeOffset]::FromUnixTimeSeconds([long]$_).UtcDateTime }

$total = [timespan]::FromMinutes($sessionBuffer)  # credit for first session start

for ($i = 1; $i -lt $times.Count; $i++) {
    $diff = $times[$i] - $times[$i-1]
    if ($diff.TotalMinutes -lt $threshold) {
        $total += $diff
    } else {
        $total += [timespan]::FromMinutes($sessionBuffer)  # credit each new session
    }
}

$total
```

so far, for my PSGadget project:

```
Days              : 1
Hours             : 4
Minutes           : 35
Seconds           : 59
Milliseconds      : 0
Ticks             : 1029590000000
TotalDays         : 1.19165509259259
TotalHours        : 28.5997222222222
TotalMinutes      : 1715.98333333333
TotalSeconds      : 102959
TotalMilliseconds : 102959000
```

Yeah, thats about right, almost 29 hours on this nerd project. :D 