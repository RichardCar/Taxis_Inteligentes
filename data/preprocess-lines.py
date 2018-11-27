import json
import datetime
import csv

from pprint import pprint

with open('reporteTaxi.json') as f:
  data = json.load(f)

with open('actividad2.csv', 'w') as csvfile:
  fieldnames = ['tid','cid','h','fecha','hora','estado','lat','lon']
  writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

  writer.writeheader()

  for row in data:
    dt = datetime.datetime.strptime(row["fechaHora"], '%Y/%m/%d %H:%M:%S')
    st = "null"
    if(row["estado"] == "O"):
      st = "ocupado"
    if(row["estado"] == "D"):
      st = "disponible"

    hour = dt.hour
    if(len(str(hour)) == 1):
      hour = "0"+str(hour)

    minutes = dt.minute
    if(len(str(minutes)) == 1):
      minutes = "0"+str(minutes)
    
    carrera = ""
    if("idCarrera" in row):
      carrera = row["idCarrera"]

    writer.writerow({"tid":row["tarjetaControl"],"cid":carrera,"h":str(dt.hour),"fecha":str(dt.year)+"-"+str(dt.month)+"-"+str(dt.day),"hora":str(hour)+":"+str(minutes),"estado":st,"lat":row["latitud"],"lon":row["longitud"]})

print("finished")
