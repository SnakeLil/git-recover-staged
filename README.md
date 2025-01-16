# Introduce

A git extension to recover your staged file after a hard reset: $ git reset --hard &amp;&amp; git recover-staged

# Install

```
npm i @lilsnake/git-recover-staged -g
```

# Quick usage

```
$ cd /path/to/your/repo
$ npm i @lilsnake/git-recover-staged -g
$ recover-staged
> 1 lost file(s)/commit(s) found. Processing...
> Done.
> Find recovered commits at /path/to/your/repo/GIT_RECOVERED_NOT_FOUND
```

You can now view your files in the ./GIT_RECOVERED_NOT_FOUND directory. Please note that this process does not recover the file names
