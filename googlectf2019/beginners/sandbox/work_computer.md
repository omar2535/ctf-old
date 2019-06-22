# Writeup Work Computer

I made a netcat connection using:

```sh
nc readme.ctfcompetition.com 1337
```

Then doing a quick reconnaissance, I can see that I'm missing the bin files for cat and other commands. I also realize that the shell is running on some busybox version.

Doing a quick

```sh
ls -Al /bin
```

I see that the command `tar` is still available. Then I just tar the flag file in the homepage:

```sh
tar -c README.flag
```

and get the flag.
