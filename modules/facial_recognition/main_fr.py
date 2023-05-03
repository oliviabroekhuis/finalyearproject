#PROCESS OF RECOGNISING THE FACES FROM THE ENCODINGS
from imutils.video import VideoStream
from imutils.video import FPS
import picamera
import face_recognition
import argparse
import imutils
import json
import pickle
import time
import sys
import cv2

    
#Recieve commands
ap = argparse.ArgumentParser()
ap.add_argument("-c", "--cascade", type=str, required=False, default="haarcascade_frontalface_default.xml"")
ap.add_argument("-e", "--encodings", type=str, required=False, default="encodings.pickle")
args = vars(ap.parse_args())

#Getting the values from the encodings 
data = pickle.loads(open(args["encodings"], "rb").read())
#Use the OpenCV file
detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
# Start the video stream
videoStream = cv2.VideoCapture(0)

prevNames = []

time.sleep(2.0)
#Get frames from video stream and loop over 
while True:
	# Increase processing time
	ret, frame = videoStream.read()
	frame = imutils.resize(frame, width=500)
	
	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
	
	#Get coords
	coords = detector.detectMultiScale(gray, scaleFactor=1.1, 
		minNeighbors=5, minSize=(30, 30))
	
	#REorder the return of openCv coordinates
	boxes = [(y, x + w, y + h, x) for (x, y, w, h) in coords]
	
	#Compute matchings
	encodings = face_recognition.face_encodings(rgb, boxes)
	names = []

	#Check over encodings
	for encoding in encodings:
		# Match to stored faces
		matches = face_recognition.compare_faces(data["encodings"],encoding)
		name = "Unknown"
		# Check comparsion
		if True in matches:
			# Find the index of the matched person
			matchedIdxs = [i for (i, b) in enumerate(matches) if b]
			counts = {}
			
			for i in matchedIdxs:
				name = data["names"][i]
				counts[name] = counts.get(name, 0) + 1
			# Which face has the highest score is recognised as those in the images
			name = max(counts, key=counts.get)
		
		
	 names.append(name)

	for ((top, right, bottom, left), name) in zip(boxes, names):
		
		cv2.rectangle(frame, (left, top), (right, bottom),
			(0, 255, 0), 2)
		y = top - 15 if top - 15 > 15 else top + 15
		cv2.putText(frame, name, (left, y), cv2.FONT_HERSHEY_SIMPLEX,
			0.75, (0, 255, 0), 2)

	cv2.imshow('frame',frame)
	logins = []
	logouts = []
	# Check which users are logged in or logged out
	for n in names:
		if (prevNames.__contains__(n) == False and n is not None):
			logins.append(n)

	for n in prevNames:
		if (names.__contains__(n) == False and n is not None):
			logouts.append(n)

	#Restart names for next log in
	prevNames = names
	if cv2.waitKey(1) & 0xFF == ord('q'):break

#Terminate video streaming process
videoStream.release()
cv2.destroyAllWindows()
videoStream.stop()    
        

