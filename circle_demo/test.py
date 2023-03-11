from matplotlib.pyplot import *
from numpy import *
width = 3 # total width including rounded ends
height = 2
nplayer = 10



circ = 2*(w-h) + pi*h # circumference
delta = circ/nplayers

zones = [0.5*(w-h), # right bottom half
         0.5*pi*h,
         w-h,
         0.5*pi*h,
         0.5*w*h] # left bottom half
         
czones = cumsum(zones)
x = [array([0,-h/2])] # right below middle
c = 0 # circumferential position
for i in range(nplayer):
    c += delta
    ipos = searchsorted(c, czones, side='left')
    if ipos == 1:
        x +=  [x[-1] + array([delta, 0])]
    elif ipos == 2:
        d = c - 0.5*(w-h)
        ang = 2*d/h
        x += [array([0.5*(w-h)/2, -h/2]) + array([sin(ang), h/2-cos(ang)])]
    elif ipos == 3:
        d = c - 0.5*(w-h) - pi*d/2
        x += [array([0.5*(w-h)/2, h/2]) - array([d, 0])
    elif ipos == 4:
        d = c - (3/2)*(w-h) - pi*d/2
        ang = 2*d/h
        x += [array([-0.5*(w-h)/2, h/2]) + array([-sin(ang), -h/2+cos(ang)])]
    elif ipos == 5:
        d = c - (3/2)*(w-h) - pi*d
        x += [array([-0.5*(w-h)/2, -h/2]) + array([d, 0])]
    

