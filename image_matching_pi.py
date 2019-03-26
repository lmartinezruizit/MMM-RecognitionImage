import cv2
import numpy as np
from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import imutils
import sys
import json
import time
import cv2
import config
import signal

def to_node(type, message):
    # convert to json and print (node helper will read from stdout)
    try:
        print(json.dumps({type: message}))
    except Exception:
        pass
    # stdout has to be flushed manually to prevent delays in the node helper communication
    sys.stdout.flush()


to_node("status", "Card Recognition started...")

# Setup variables
current_user = None
last_match = None
detection_active = True
login_timestamp = time.time()
same_user_detected_in_row = 0


camera = PiCamera()
camera.resolution = (640, 480)
camera.framerate = 32
rawCapture = PiRGBArray(camera, size=(640, 480))

time.sleep(0.1)

for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
    image = frame.array
    #return_value, image = cap.read()
    cv2.imwrite('compare.jpg', image)
    
    url='https://bicihome.com/wp-content/uploads/2017/10/descarga.png'
    original = imutils.url_to_image(url)
    #original = cv2.imread("bicimad_roja.png")
    image_to_compare = cv2.imread('compare.jpg')
    
    
    # 1) Check if 2 images are equals
    if original.shape == image_to_compare.shape:
        #print("The images have same size and channels")
        difference = cv2.subtract(original, image_to_compare)
        b, g, r = cv2.split(difference)
    
        #if cv2.countNonZero(b) == 0 and cv2.countNonZero(g) == 0 and cv2.countNonZero(r) == 0:
            #print("The images are completely Equal")
        #else:
            #print("The images are NOT equal")
    
    # 2) Check for similarities between the 2 images
    sift = cv2.xfeatures2d.SIFT_create()
    kp_1, desc_1 = sift.detectAndCompute(original, None)
    kp_2, desc_2 = sift.detectAndCompute(image_to_compare, None)
    
    index_params = dict(algorithm=0, trees=5)
    search_params = dict()
    flann = cv2.FlannBasedMatcher(index_params, search_params)
    
    matches = flann.knnMatch(desc_1, desc_2, k=2)
    
    good_points = []
    for m, n in matches:
        if m.distance < 0.6*n.distance:
            good_points.append(m)
    
    # Define how similar they are
    number_keypoints = 0
    if len(kp_1) <= len(kp_2):
        number_keypoints = len(kp_1)
    else:
        number_keypoints = len(kp_2)
    
    
    #print("Keypoints 1ST Image: " + str(len(kp_1)))
    #print("Keypoints 2ND Image: " + str(len(kp_2)))
    #print("GOOD Matches:", len(good_points))
    #print("How good it's the match: ", len(good_points) / number_keypoints * 100)
    
    confidence = (len(good_points) / number_keypoints * 100);
    
    if (confidence < 10):
        # callback logout to node helper
        to_node("logout", {"user": None})
        same_user_detected_in_row = 0
        #current_user = None
    if (confidence > 10):
        #current_user = 'luis'
        # Callback current user to node helper
        to_node("login", {"user": 'Madrid', "confidence": str(confidence)})
        time.sleep(10)
    
    
    result = cv2.drawMatches(original, kp_1, image_to_compare, kp_2, good_points, None)
    
    
   # cv2.imshow("result", cv2.resize(result, None, fx=0.4, fy=0.4))
    #cv2.imwrite("feature_matching.jpg", result)
    
    
    #cv2.imshow("Original", cv2.resize(original, None, fx=0.4, fy=0.4))
    #cv2.imshow("Duplicate", cv2.resize(image_to_compare, None, fx=0.4, fy=0.4))
    rawCapture.truncate(0)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
#cap.release()
cv2.destroyAllWindows()
