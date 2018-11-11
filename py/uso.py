import json
import csv

f = open('/Users/fabiancamilo/Downloads/abril.json')
data = json.load(f)
f.close()

with open('/Users/fabiancamilo/Downloads/abrilP.csv', 'w') as csvfile:
    fieldnames = ['ID', 'fecha','origenX','origenY','destinoX','destinoY','costo','aceptado']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for item in data:
        try:
            print(item['id_carrera'])
            writer.writerow({'aceptado':item['aceptada'],'ID': item['id_carrera'], 'fecha': item['fecha_acerech']['$date'], 'origenX': item['origen']['longitud'],'origenY':item['origen']['latitud'],'destinoX':item['destino']['longitud'],'destinoY':item['destino']['latitud'],'costo':item['valor_calculado']})
        except ValueError:
            print ("Oops!  That was no valid number.  Try again...")

