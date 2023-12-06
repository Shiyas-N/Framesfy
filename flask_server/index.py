from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import flask
from io import BytesIO
import requests
import base64
import firebase_admin
from firebase_admin import credentials, firestore
from PIL import Image, ImageDraw, ImageOps
import cv2,numpy as np


# Initialize Firebase Admin SDK
cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(_name_)
CORS(app,resources={r"/campaign/*": {"origins": "*"}},methods=['POST'],allow_headers=['Content-Type',"Access-Control-Allow-Origin"],origins="*")

@app.route('/')
def index():
    return render_template('../frontend/index.html')



# @app.route('/create/<int:id>', methods=['POST'])
@app.route('/campaign/<user_id>')

    # if user.exists:
    #     user_data = user.to_dict()
    #     return render_template('user_template.html', user_data=user_data)
    # else:
    #     return f"No user found with ID: {user_id}", 404

def create(user_id):
    users_ref = db.collection('users').document(user_id)
    user = users_ref.get()
    if user.exists:
        
            
        # user_data = []
        # for doc in docs:
        #     user_data.append(doc.to_dict())
        user_data = user.to_dict()
        frame_image=user_data['user_image']
        client_title=user_data['user_title']

        # return render_template("campaign.html",user_image=frame_image,user_title=client_title,user_id=user_id)
        return jsonify({
            "user_id": user_id,
            "frame_image": frame_image,
            "client_title": client_title
        })
    return jsonify(frame_image="")
    
@app.route('/campaign/<string:user_id>/download',methods=['POST'])

def image_rendering(user_id):
    users_ref = db.collection('users').document(user_id)
    user = users_ref.get()
    if user.exists:
        user_data = user.to_dict()
        frame_image_url = user_data['user_image']  # Assuming 'user_image' stores the URL
        
        # Download the frame_image from the URL using requests
        response = requests.get(frame_image_url)
        frame_image_data = response.content
        
        # Convert the downloaded image data to a numpy array
        frame_image_np = np.frombuffer(frame_image_data, np.uint8)
        
        # Read the image using cv2
        frame_image = cv2.imdecode(frame_image_np, cv2.IMREAD_COLOR)

        cropped_image_data = request.json.get('croppedImage')
        
        # Decode base64 data and process the cropped image
        img_data = base64.b64decode(cropped_image_data)
        
        # cropped_image = (BytesIO(cropped_image_data))
        nparr = np.frombuffer(img_data, np.uint8)
    
    # Decode the image using cv2
        img_cv2 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  # Use cv2.IMREAD_GRAYSCALE for grayscale images
        
        # Convert the image from RGB to BGR
        try:
            if len(img_cv2.shape) == 3:  # Check if it's a color image
                new_image = cv2.cvtColor(img_cv2, cv2.COLOR_RGB2BGR)
            else:
                new_image = img_cv2
            
            # Convert PIL image to OpenCV format
            # new_image = cv2.cvtColor(np.array(img_cv2_bgr), cv2.COLOR_RGB2BGR)
            
            # Fetch and process the frame image
            response = requests.get(frame_image)
            if response.status_code == 200:
                with open('img2', 'wb') as file:
                    file.write(response.content)


            # Load the frame_image and the image to be placed in the frame

            # Convert the frame_image to HSV color space
            hsv = cv2.cvtColor(frame_image, cv2.COLOR_BGR2HSV)

            # Define range for yellow color in HSV
            lower_yellow = np.array([20, 100, 100])
            upper_yellow = np.array([30, 255, 255])

            # Threshold the HSV image to get only yellow colors
            mask = cv2.inRange(hsv, lower_yellow, upper_yellow)

            # Find contours in the mask image
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            # Assuming the frame is the largest yellow area, find the largest contour
            frame_contour = max(contours, key=cv2.contourArea)

            # Create an empty mask to draw the contour
            contour_mask = np.zeros_like(mask)

            # Draw the largest contour onto the mask
            cv2.drawContours(contour_mask, [frame_contour], -1, (255), thickness=cv2.FILLED)

            # Get the bounding rectangle for the largest contour
            x, y, w, h = cv2.boundingRect(frame_contour)

            # Calculate the aspect ratio of the new image
            aspect_ratio = new_image.shape[1] / new_image.shape[0]

            # Calculate the new dimensions of the image
            new_w = min(w, h * aspect_ratio)
            new_h = new_w / aspect_ratio

            # Resize the new image to fit within the frame while maintaining aspect ratio
            new_image_resized = cv2.resize(new_image, (int(new_w), int(new_h)))

            # Create a mask of the resized new image with the contour mask
            new_image_mask = np.zeros_like(frame_image)
            new_image_mask[y:y + new_image_resized.shape[0], x:x + new_image_resized.shape[1]] = new_image_resized

            # Apply the contour mask to the new image mask
            new_image_mask = cv2.bitwise_and(new_image_mask, new_image_mask, mask=contour_mask)

            # Create an inverse mask of the frame_image
            poster_mask = cv2.bitwise_and(frame_image, frame_image, mask=cv2.bitwise_not(contour_mask))

            # Combine the new image with the frame_image
            result = cv2.add(poster_mask, new_image_mask)

            # Save the result
            cv2.imwrite('result.jpg', result)
        #     return jsonify({'image_url': merged_image_url})
        

        # Convert the resulting image to base64
            retval, buffer = cv2.imencode('.jpg', result)
            result_base64 = base64.b64encode(buffer).decode('utf-8')
            return jsonify(result_base64)
        except Exception as e:
    # Print the exception or log it for debugging purposes
         print(f"Error: {e}")
    # Handle the error accordingly, e.g., return an error response
         return jsonify({'error': 'Image processing failed'})
if _name_ == '_main_':
    app.run(debug=True)