from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mimetypes,requests,firebase_admin,base64,cv2,numpy as np
from io import BytesIO
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


app = Flask(__name__)
CORS(app,resources={r"/campaign/*": {"origins": "*"}},methods=['POST'],allow_headers=["Access-Control-Allow-Origin"],origins="*")

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

def campaign(user_id):
    users_ref = db.collection('users').document(user_id)
    user = users_ref.get()
    if user.exists:
        
            
        # user_data = []
        # for doc in docs:
        #     user_data.append(doc.to_dict())
        user_data = user.to_dict()
        display_frame_url=user_data['display_frame']
        edit_frame_url=user_data['edit_frame']
        response = requests.get(edit_frame_url)
        edit_frame_data = response.content
        edit_frame_np = np.frombuffer(edit_frame_data, np.uint8)
        edit_frame = cv2.imdecode(edit_frame_np, cv2.IMREAD_COLOR)
        client_title=user_data['user_title']
        hsv = cv2.cvtColor(edit_frame, cv2.COLOR_BGR2HSV)

                # Define range for yellow color in HSV
        lower_yellow = np.array([10, 100, 100])
        upper_yellow = np.array([40, 255, 255])

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

        aspect_ratio_yellow = w / h

        # return render_template("campaign.html",user_image=frame_image,user_title=client_title,user_id=user_id)
        return jsonify({
            "user_id": user_id,
            "frame_image": display_frame_url,
            "client_title": client_title,
            "aspect_ratio":aspect_ratio_yellow
        })
    return jsonify(frame_image="Error")
    
@app.route('/campaign/<string:user_id>/download',methods=['POST'])

def image_rendering(user_id):
    users_ref = db.collection('users').document(user_id)
    user = users_ref.get()
    if user.exists:
        user_data = user.to_dict()
        edit_frame_url = user_data['edit_frame']
        response = requests.get(edit_frame_url)
        edit_frame_data = response.content
        edit_frame_np = np.frombuffer(edit_frame_data, np.uint8)
        edit_frame = cv2.imdecode(edit_frame_np, cv2.IMREAD_COLOR)

        # img = cv2.imdecode(np.frombuffer(cropped_image.read(), np.uint8), cv2.IMREAD_COLOR)
        text_data = (request.form.get('textData'))
        cropped_image_base64 = request.files.get('croppedImage')  # Assuming 'croppedImage' contains base64 data
        if cropped_image_base64:
            cropped_image_data=cropped_image_base64.read()
            cropped_image=bytes(cropped_image_data)
            # Decode base64 data to bytes

            # Convert bytes to numpy array
            nparr = np.frombuffer(cropped_image, np.uint8)

              # Decode the image using OpenCV
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Convert the image from RGB to BGR
            if len(img.shape) == 3:  # Check if it's a color image
                new_image = img
            else:
                new_image = img
                
                # Convert PIL image to OpenCV format
                # new_image = cv2.cvtColor(np.array(img_cv2_bgr), cv2.COLOR_RGB2BGR)
                
                # Fetch and process the frame image
            # response = requests.get(frame_image)
            # frame_image=cv2.imread("post.jpg")

                # Load the frame_image and the image to be placed in the frame

                # Convert the frame_image to HSV color space
            hsv = cv2.cvtColor(edit_frame, cv2.COLOR_BGR2HSV)

                # Define range for yellow color in HSV
            lower_yellow = np.array([10, 100, 100])
            upper_yellow = np.array([40, 255, 255])

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

            aspect_ratio_yellow = w / h
                # Calculate the aspect ratio of the new image
            aspect_ratio = new_image.shape[1] / new_image.shape[0]

                # Calculate the new dimensions of the image
            # new_w = min(w, h * aspect_ratio)
            # new_h = new_w / aspect_ratio
            new_w = min(w, h * aspect_ratio_yellow)
            new_h = new_w / aspect_ratio_yellow

                # Resize the new image to fit within the frame while maintaining aspect ratio
            new_image_resized = cv2.resize(new_image, (int(new_w), int(new_h)))

                # Create a mask of the resized new image with the contour mask
            new_image_mask = np.zeros_like(edit_frame)
            new_image_mask[y:y + new_image_resized.shape[0], x:x + new_image_resized.shape[1]] = new_image_resized

                # Apply the contour mask to the new image mask
            new_image_mask = cv2.bitwise_and(new_image_mask, new_image_mask, mask=contour_mask)

                # Create an inverse mask of the frame_image
            poster_mask = cv2.bitwise_and(edit_frame, edit_frame, mask=cv2.bitwise_not(contour_mask))

                # Combine the new image with the frame_image
            result = cv2.add(poster_mask, new_image_mask)

            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 1
            font_color = (0,0,0)  # White color
            line_type = 2
            # cv2.putText(result, text_data, (int(x+150), int(y + new_h + 25)), font, font_scale, font_color, line_type)
            text_size, _ = cv2.getTextSize(text_data, font, font_scale, line_type)

# Calculate the x-coordinate of the center of the text
            center_x = int(x + (new_w - text_size[0]) / 2)

            cv2.putText(result, text_data, (center_x, int(y + new_h + 30)), font, font_scale, font_color, line_type)
            #     return jsonify({'image_url': merged_image_url})
            

            # Convert the resulting image to base64
            retval, buffer = cv2.imencode('.jpg', result)
            result_base64 = base64.b64encode(buffer).decode('utf-8')
            print("success")
            file_extension = mimetypes.guess_extension(mimetypes.types_map['.jpg'])
            mime_type = f"data:image/{file_extension[1:]};base64,"  # Extracting the extension without '.'

        # Prepend the MIME type to the base64 encoded image data
            result_base64_with_mime = f"{mime_type}{result_base64}"

            return jsonify(result_base64_with_mime)
        else:
    # Handle the error accordingly, e.g., return an error response
            return jsonify({'error': 'Image processing failed'})
if __name__ == '__main__':
    app.run(debug=True)