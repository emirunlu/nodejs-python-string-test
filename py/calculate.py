import json

# Constants
STRING = 'LuxPMsoft'
ODD_COUNT = 20
NUM_COUNT = 8

def calculateString():
    resString = []
    strList = list(STRING)

    # Calculate odd numbers in range and reverse by num count
    odds = [odd for odd in range(1, ODD_COUNT*2+1,2)]
    reversedOdds = odds[-NUM_COUNT:][::-1]
    
    # Iterate over numbers to generate string
    for _ in range(NUM_COUNT):
        popstr = strList.pop(0)
        popodd = reversedOdds.pop(0)
        resString.append(popstr)
        resString.append(popodd)

    # Concat remaining characters in string
    resString += strList

    return json.dumps(resString)

print(calculateString())