from flask import Flask, request, jsonify, render_template
from PIL import Image
from io import BytesIO
import requests
import base64
import firebase_admin
from firebase_admin import credentials, firestore
from PIL import Image, ImageDraw, ImageOps


# Initialize Firebase Admin SDK
cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')



# @app.route('/create/<int:id>', methods=['POST'])
@app.route('/campaign/<string:user_id>')

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
        return {"client_details":[user_id,frame_image,client_title]}
    
@app.route('/campaign/<string:user_id>/download',methods=['POST'])
def image_rendering(user_id):
    users_ref = db.collection('users').document(user_id)
    user = users_ref.get()
    if user.exists:
        user_data = user.to_dict()
        frame_image = user_data['user_image']
        
        # Receive cropped image data from the frontend
        cropped_image_data = request.json.get('croppedImage')

        # Decode base64 data and process the cropped image
        img_data = base64.b64decode(cropped_image_data)
        cropped_image = Image.open(BytesIO(img_data))
        
        # Fetch and process the frame image
        response = requests.get(frame_image)
        if response.status_code == 200:
            with open('img2', 'wb') as file:
                file.write(response.content)
        fp = Image.open('img2')
        
        # Perform image merging or manipulation as needed
        # ... (Your merging logic using PIL)

        # Encode the merged image to base64
        buffered = BytesIO()
        # Save the merged image to 'buffered'
        # ...

        # Encode the merged image as base64 for sending back to the frontend
        merged_image_url = base64.b64encode(buffered.getvalue()).decode('utf-8')

        return jsonify({'image_url': merged_image_url})
    else:
        return jsonify({'error': 'User not found'}), 404

    img1 = request.files['user_image']
    
    from PIL import Image, ImageDraw, ImageOps

        # Open your images
    fc = Image.open(img1)
    response = requests.get(frame_image)
    if response.status_code == 200:
        with open('img2', 'wb') as file:
            file.write(response.content)
    
    fp = Image.open('img2')

        # Resize the second image
    r = fc.resize((150, 200))

        # Create a new image for the mask
    mask = Image.new('L', r.size, 0)

        # Create a draw object
    draw = ImageDraw.Draw(mask)

        # Draw a white ellipse on the mask
    draw.ellipse((0, 0, 150, 200), fill=255)

        # Create a composite image using the resized image and the mask
    result = ImageOps.fit(r, mask.size, method=0, bleed=0.0, centering=(0.5, 0.5))
    result.putalpha(mask)
        
        # Paste the result image onto the first image
    fp.paste(result, (200, 150), result)
    buffered = BytesIO()
    fp.save(buffered, format="PNG")
    image_url = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        # Save the merged image as 'merged_image.png'

        # Read the saved image file and encode it as base64


    return render_template('result.html',image_url=image_url)

if __name__ == '__main__':
    app.run(debug=True)
