---
layout: post
title: "Git Reset: Getting Back to a Known Good State"
subtitle: What to do when you're three commits deep and realize you made a mistake
date: 2026-05-20
tags: [git, workflow, version-control, lessons-learned]
author: Mark Go
---

So I made a classic mistake. I had what I thought was going to be a quick, simple change. "This'll take ten minutes," I told myself. "No need to branch." 

Three commits in, the whole thing had snowballed into something I didnt fully understand, the feature wasn't working, and now the codebase was in a worse state than when I started. I knew exactly where it was good. I just needed to get back there.

## Finding Where It All Went Wrong

First thing I needed was to figure out which commit was the last known good state. `git log` is your friend here:

```bash
git log --oneline
```

That'll give you a condensed view. Something like:

```
a1b2c3d (HEAD) broke everything trying to fix the other thing
e4f5a6b halfway through the new feature, nothing works
7c8d9e0 started adding the new feature
f1a2b3c this was the last known good state  <-- I want to go back here
```

Once you spot the commit hash you want to return to, you have a couple of options depending on how aggressive you want to be.

## Option 1: Soft Reset (Keep Your Changes)

If you want to undo the commits but keep all the file changes staged so you can review them:

```bash
git reset --soft f1a2b3c
```

Your working directory still has all the changes, they're just uncommitted. Useful if you want to salvage any of the work.

## Option 2: Hard Reset (Burn It All Down)

This is what I actually needed. I didnt want any of it. Just get me back to where things worked:

```bash
git reset --hard f1a2b3c
```

That nukes the commits and the file changes. The repo is now exactly as it was at that commit. Gone. Clean. Done.

If you're on the main branch and already pushed those commits, you'd need to force push, which is a whole thing. But in my case I hadn't pushed yet, so `git reset --hard` was clean and painless.

## What I Should Have Done: Branching First

The whole mess was avoidable. Any time you're doing something that isn't a trivial one-liner fix, make a branch. It takes about five seconds:

```bash
git checkout -b feature/my-new-thing
```

Work on it there. If it goes sideways, you just switch back to main and delete the branch:

```bash
git checkout main
git branch -D feature/my-new-thing
```

Main is completely untouched. Your working codebase is still good. No drama.

If the feature actually works out, you merge it in:

```bash
git checkout main
git merge feature/my-new-thing
```

Or if you want a cleaner history, rebase it. This is where rebase vs merge is worth understanding.

**Merge** takes your branch and stitches it into main with a merge commit. The full history of both branches stays intact, including the "I tried this, then that" commits. It's accurate but can get noisy.

**Rebase** replays your branch commits on top of main as if you had started from there. The result is a straight, linear history with no merge commit in the middle. Cleaner to read, but you're rewriting history, so don't rebase anything that's already been pushed and shared.

```bash
# from your feature branch
git rebase main
# then fast-forward merge on main
git checkout main
git merge feature/my-new-thing
```

## Squash: Cleaning Up Your Mess Before Anyone Sees It

This is where squash comes in. Say you made four commits on your branch: "WIP", "fixed typo", "okay this actually broke things", "finally got it". Those are real saves, but they're not great commit history for anyone reading later.

Squash lets you combine multiple commits into one clean commit before you merge. The most common way is an interactive rebase:

```bash
git rebase -i HEAD~4
```

That opens an editor showing your last 4 commits. Change `pick` to `squash` (or just `s`) on anything you want folded into the commit above it. You end up with one tidy commit that says what the feature actually did, not the play-by-play of how you got there.

You can also squash at merge time:

```bash
git merge --squash feature/my-new-thing
```

That stages all the changes as one commit, and you write the message yourself. Simple, no interactive editor.

## The Mental Model I Should Have Had

The rule I'm going with now: if I'm not 100% sure the change is a one-shot fix, it gets a branch. If I have any doubt at all, it gets a branch. The cost of `git checkout -b` is near zero. The cost of unwinding three bad commits when you're already frustrated is not.

Branching is the safety net. It lets you experiment without fear. If it works, great. If it doesn't, no harm done. You can always reset or delete the branch and start fresh without affecting the main codebase.

