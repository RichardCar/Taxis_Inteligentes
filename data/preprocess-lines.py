import json
import datetime
import csv

from pprint import pprint

with open('actividad.json') as f:
  data = json.load(f)

with open('actividad.csv', 'w') as csvfile:
  fieldnames = ['h','fecha','hora','estado','lat','lon']
  writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

  writer.writeheader()

  for row in data:
    dt = datetime.datetime.strptime(row["fechaHora"], '%Y/%m/%d %H:%M:%S')
    st = "null"
    if(row["estado"] == "F"):
      st = "ocupado"
    if(row["estado"] == "D"):
      st = "pedido"

    writer.writerow({"h":str(dt.hour),"fecha":str(dt.year)+"-"+str(dt.month)+"-"+str(dt.day),"hora":str(dt.hour)+":"+str(dt.minute),"estado":st,"lat":row["latitud"],"lon":row["longitud"]})

print("finished")
