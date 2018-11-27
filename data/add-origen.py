import json
import datetime
import csv

from pprint import pprint

data = []
orig_list = []

with open('actividad3.csv') as f:
    reader = csv.DictReader(f)
    last_cid = -1
    for row in reader:
        orig = "false"
        if(last_cid != row["cid"] and row["estado"] == "ocupado" and not row["cid"] in orig_list):
            orig = "true"
            orig_list.append(row["cid"])
        
        last_cid = row["cid"]
        data.append({"tid":row["tid"],"cid":row["cid"],"h":row["h"],"fecha":row["fecha"],"hora":row["hora"],"estado":row["estado"],"lat":row["lat"],"lon":row["lon"],"origen":orig})

with open('actividad4.csv', 'w') as csvfile:
    fieldnames = ['tid','cid','h','fecha','hora','estado','lat','lon','origen']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    writer.writeheader()
    
    for row in data:
        writer.writerow(row)

print("finished")
