# Things I learned

ls -al *
    Lists all files and their sizes in sub directories
cat
    Reads out the file data

find / -size XXc
    Finds files of XX bytes

2> /dev/null
    Discards all error logs from command into ""/dev/null"

grep "<text to find here>" filename.txt
    Finds the line of text wanted inside filename.txt

sort data.txt| uniq -u
    Sorts the data first then finds the unique string(NOTE: uniq does not work on unsorted data)

ssh bandit.labs.overthewire.org -l <username> -p <port number>
    SSH's into the bandit server with login username -l and portnumber -l

strings <filename>
    Finds the readable strings inside the file and displays them

base64 -d <filename>
    Decodes the base64 encoded file and prints it out

cat data.txt | tr '[a-z]' '[n-za-m]'
    Reads out cat after mapping [a-z] characters into starting from [nopqrstuvwxyzabcdefghijklm] (also called a ROT13 encoding). Replaces letters at each one with another one when met, eg. A -> N, B -> O ect.

>
    Makes a new file placing contents of previous command into the new file. Ex: (xxd -data.txt >data1.txt)

mv
    Moves the file to a new filename

tar
will make the file into compressed file

file
tells you type of file (eg. compressed)

gunzip/bunzip2
unzips the respective .gz or .bz2 files

vim <filename>
allows you to edit files inside terminal

ssh -i sshkey.private bandit14@localhost
allows you to ssh with a private key using bandi14 username at localhost(in this case it was already banditlabs)

nc <host> <port number>
allows you to read/write data accross network connections (eg. a ssh key)

nc -plv 3000
    listens verbosly to localhost port 3000

openssl s_client -connect localhost:30001
    allows you to connect to  your localhost ip using ssl(since port will be listening for HTTPS)

nmap -p 31000-32000 localhost -sV --version-intensity 1
    scans ports between 31000 and 32000 on localhost with probe intensity of 1.

ssh omar@omar.com cat readme
    you can cat stuff on a remote server using ssh

stat -c "%a %U:%G %n" /usr/bin/passwd
    You can change the run id of a file as root or a certain group
    so that you don't have to give a user rights to a file explicitly

/etc/passwd
    is a text file containing attributes of each user or account on a linux computer.

more
    is useful for displaying more information about a command in terminal. Will only be called if screen size is too small. Can enter `vi` from more.
