---
layout: post
title: "SSH for Git Quick Reference"
date: 2026-04-10
subtitle: "stop typing your password every single time"
tags: [git, ssh, github, linux]
comments: true
---

Every time I set up a new machine, I forget at least one of these steps. So here's the whole thing in one place.

## Generate a key

{% include codeHeader.html %}
```bash
ssh-keygen -t ed25519 -C "any label you want"
```

Accept the default location (`~/.ssh/id_ed25519`). Set a passphrase if you want the extra security. Then grab the public key:

{% include codeHeader.html %}
```bash
cat ~/.ssh/id_ed25519.pub
```

Copy that output, go to GitHub User Account Icon (top-right) Menu → Settings → SSH and GPG keys → New SSH key, paste it in, save. Then test the connection:

{% include codeHeader.html %}
```bash
ssh -T git@github.com
# Expected: Hi markgodiy! You've successfully authenticated...
```

If you get that response, you're good.

## Day-to-day

Once the key is on GitHub, cloning over SSH just works:

{% include codeHeader.html %}
```bash
git clone git@github.com:username/repo.git
```

From there, `git pull` and `git push` work like normal, no credentials prompt.

If you've got an existing repo that's pointing at HTTPS, swap the remote:

{% include codeHeader.html %}
```bash
git remote set-url origin git@github.com:username/repo.git
git remote -v  # verify
```

## SSH Agent (stop retyping the passphrase)

If you set a passphrase on your key, SSH will ask for it every time unless you've got an agent running. This fixes that:

{% include codeHeader.html %}
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

To make it automatic on login, throw this in your `~/.bashrc` or `~/.zshrc`:

{% include codeHeader.html %}
```bash
eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519
```

## Generating multiple keys

The default key name is `id_ed25519`, but if you've got more than one purpose (personal GitHub, work GitHub, a home server, etc.), you want separate keys. Just give each one a name with `-f`:

{% include codeHeader.html %}
```bash
ssh-keygen -t ed25519 -C "personal github" -f ~/.ssh/id_ed25519_personal
ssh-keygen -t ed25519 -C "work github"     -f ~/.ssh/id_ed25519_work
ssh-keygen -t ed25519 -C "home server"     -f ~/.ssh/id_ed25519_homelab
```

Each command drops two files in `~/.ssh/` — the private key and `.pub` counterpart. The label after `-C` is just a comment so you can tell them apart in GitHub's key list or `ssh-add -l`. Put anything you want there.

Then add each one to the agent:

{% include codeHeader.html %}
```bash
ssh-add ~/.ssh/id_ed25519_personal
ssh-add ~/.ssh/id_ed25519_work
ssh-add ~/.ssh/id_ed25519_homelab
```

## Multiple GitHub accounts

This one tripped me up for a while. If you've got a personal account and a work account, you can't just point two keys at the same hostname. The fix is aliases in `~/.ssh/config`:

{% include codeHeader.html %}
```
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
```

Then clone using the alias instead of `github.com`:

{% include codeHeader.html %}
```bash
git clone git@github-personal:username/repo.git
```

SSH resolves the alias and picks the right key automatically.

## Key files worth knowing

| File | What it is |
|------|------------|
| `~/.ssh/id_ed25519` | Private key. Never share this. |
| `~/.ssh/id_ed25519.pub` | Public key. This one goes on GitHub. |
| `~/.ssh/config` | Host aliases and per-host key config. |
| `~/.ssh/known_hosts` | Verified remote host fingerprints. |

## When things break

{% include codeHeader.html %}
```bash
# Verbose output -- shows exactly which keys are being tried
ssh -vT git@github.com

# See what's loaded in the agent
ssh-add -l

# Fix permissions (SSH is strict about this)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

The permissions one catches me sometimes after copying keys between machines. SSH silently refuses to use a private key if the permissions are too open, and it doesn't always tell you why.
