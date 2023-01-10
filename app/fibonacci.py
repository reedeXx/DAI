import math
import sys
import os
#n = int(sys.argv[1])
    
def abrirFichero():
    n= open("valor.txt","r") 
    num = int(n.read())
    n.close()
    return n
    
def escribirFichero(n):
    file = open("resultado.txt", "w")
    file.write(str(fibonacci(n)))
    file.write( os.linesep)
    file.close()

def fib(n):
  t0=0
  t1=1
  
  v= str(t0) + "\n"
  v += str(t1) + "\n"
  for i in range(1 , n , 1):
    
    aux = t1
    t1 = t1 + t0
    t0 = aux
    v += str(t1) + "\n"

  return v




    




