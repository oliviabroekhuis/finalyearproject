#FIND_AND_ENCODE_FACES.PY
from imutils import paths
import face_recognition
import argparse
import pickle
import cv2
import os

newEncodings = []
newNames = []
# ARGUMENT PARSER
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--dataset", required=True, default="../dataset/")
ap.add_argument("-e", "--encodings", required=True, default="encodings.pickle")
args = vars(ap.parse_args())

#GETS FACES
datasetImages = list(paths.list_images(args["dataset"]))

#GET IMAGES FROM THE DATASET 
for (i, datasetImages) in len(datasetImages):
	#Get person name
	name = datasetImages.split(os.path.sep)[-2]

	#Convert from colour to dlib processor
	image = cv2.imread(datasetImages)
	rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

	#GEt x and y coordinates of face
	boxes = face_recognition.face_locations(rgb, model="hog")

	#Create the encodings
	encodings = face_recognition.face_encodings(rgb, boxes)

	#Loop over the encodings made using hte library
	for encoding in encodings:
		#Append the list of names and faces to intialised variables
		newEncodings.append(encoding)
		newNames.append(name)

#Put encodings into the pickle file
data = {"encodings": knownEncodings, "names": knownNames}
f = open(args["encodings"], "wb")
f.write(pickle.dumps(data))
#Close File
f.close()