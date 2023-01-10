import random

n = random.randint(2,8)
cad = []
dch = 0
izd = 0

for i in range(0,n,1):
    aux = random.randint(0,1)
    if aux == 0:
        cad.append("[")
        izd+=1
    else:
        cad.append("]")
        dch+=1

def balan(cad):
    if dch == izd:
        for i in range(0,n-1,1):
            if len(cad) == 0:
                break
            if cad[i] == "[":
                cad.pop(i)
                for j in range(i,n-1,1):
                    if len(cad) < j:            
                        break
                    if cad[j] == "]":
                        cad.pop(j)
        
    if len(cad) == 0:
        return True
    else:
        return False



