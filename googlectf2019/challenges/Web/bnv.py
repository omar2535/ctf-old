import requests
import json
import pdb

with open('cities.json') as f:
  data = json.load(f)

# sample data: {'country': 'AD', 'name': 'Ordino', 
#               'lat': '42.55623', 'lng': '1.53319'}
blindvalues = [
  "10", #a
  "120", #b
  "140", #b
  "1450", #d
  "150", #e
  "1240", #f
  "12450", #g
  "1250", #h
  "240", #i
  "2450", #j
  "130", #k
  "1230", #l
  "1340", #m
  "13450", #n
  "1350", #o
  "12340", #p
  "123450", #q
  "12350", #r
  "2340", #s
  "23450", #t
  "1360", #u
  "12360", #v
  "24560", #w
  "13460", #x
  "134560", #y
  "13560" #z
]

def brailConverter(message):
  blindmap = [None] * 999999
  message = message.lower()
  new_message = ""
  for i in range(0, len(blindvalues)):
    blindmap[i + 97] = blindvalues[i]
  
  for i in range(0, len(message)):
    new_message += str(blindmap[ord(message[i])])
  return new_message

#print(brailConverter(data[0]['name']))
for city in data:
  my_request = requests.post(
    'https://bnv.web.ctfcompetition.com/api/search',
    json={"message": brailConverter(city['name'])}
  )
  if(eval(my_request.text)['ValueSearch'] != 'No result found'):
    print(city['name'] + my_request.text)
