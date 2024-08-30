from google.oauth2 import id_token
from google.auth.transport import requests
import functions_framework
from flask_cors import cross_origin
from firebase_admin import firestore, initialize_app
import google.cloud.firestore

initialize_app()
db: google.cloud.firestore.Client = firestore.client()

def verify(token):
    request = requests.Request()
    values = id_token.verify_oauth2_token(
        token,
        request,
        audience="876401151866-eh0r26s88b9r2ef55m4ium8f4k3r2q6j.apps.googleusercontent.com",
    )
    return values

@functions_framework.http
@cross_origin()
def hello_http(request):
    nexus_id = None
    if request.content_type == 'application/x-www-form-urlencoded':
        nexus_id = request.form.get('nexus_id')
    elif request.content_type == 'application/json':
        nexus_id = request.get_json().get('nexus_id')

    if not nexus_id:
        return {"error": "Provide nexus_id"}
    
    email = nexus_id.split("@")[0] + "@gmail.com"
    print(email)
    
    result = db.collection("nexuspay").document("email_mapping").collection("emails").document(email).get()
    if result.exists:
        return {
            "wallet": result.to_dict()["wallet"]
        }
    else:
        return {
            "wallet": None
        }