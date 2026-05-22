respuesta = input("asiste a todas las clases")
respuesta2 = input("entrego todas las tareas a tiempo? ")
respuesta3 = input("obtuvo calificacion igual o superior a 7 en el examen?")
respuesta4 = input("participa activa en almenos tres clases?")

if(respuesta == "si" and respuesta2 == "si" and respuesta3 == "si" and respuesta4 == "si"):
    print("felicidades aprobaste el curso")
else :
    print("lo sentimos no aprobaste el curso")