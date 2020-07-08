import sys

found_token = 0
with open(sys.argv[1],'r') as tf:
    for line in tf:
        if found_token == 0:
            if 'token' in line:
                tokenline = line.split('token=')[1]
                token = tokenline.split('"')[0]
                found_token = 1
                print(token)
            else:
                pass
        else:
            break
