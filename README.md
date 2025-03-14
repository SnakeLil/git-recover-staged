# Introduce

A git extension to recover your staged file after a hard reset: $ git reset --hard &amp;&amp; git recover-staged

# Install

```
npm i git-recover-staged -g
```

# Quick usage

```
$ cd /path/to/your/repo
$ npm i git-recover-staged -g
$ git-recover-staged
> 1 lost file(s)/commit(s) found. Processing...
> Done.
> Find recovered commits at /path/to/your/repo/GIT_RECOVERED_NOT_FOUND
```

You can now view your files in the ./GIT_RECOVERED_NOT_FOUND directory. Please note that this process does not recover the file names.


![20250117105152](https://github.com/user-attachments/assets/2d330843-33d2-444b-9440-1219cb1095ac)



If you find this project helpful, consider giving it a star. 
I'm not sure how useful it is, but I will continuously improving it. Thanks！！
