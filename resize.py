import tensorflow as tf
from os import mkdir
from os.path import join, isdir
import matplotlib.pyplot as plt
import glob

#config
IMAGE_PATH="/home/songyi/worker/truetest/mod/HR/x4/"
SAVE_PATH="/home/songyi/worker/truetest/out/"


#config end
image_path=glob.glob(IMAGE_PATH+"/*")

print("total image:{}".format(len(image_path)))

def changesize(path,x):
    
    filename=path.split("/")[-1].split(".")[0]
    print(filename+".png ")
    image=tf.io.read_file(path)
    image=tf.image.decode_png(image,channels=3)
    image=tf.image.resize(image,[int(image.shape[0]/8*x),int(image.shape[1]/8*x)]  )    
    if not isdir(SAVE_PATH+'x{}'.format(x)):
        mkdir(SAVE_PATH+'x{}'.format(x))
    plt.imsave(SAVE_PATH+"x{}/{}".format(x,filename+'_bicLRx4.png'),tf.keras.preprocessing.image.array_to_img( image) )


#start run

for i in range(7):
    x=i+1
    print(x)
    print("\n")
    for path in image_path:
        changesize(path,x)

