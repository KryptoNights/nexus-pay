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
    token = request.headers.get('Authorization').split(' ')[1]
    wallet = None
    if request.content_type == 'application/x-www-form-urlencoded':
        wallet = request.form.get('wallet')
    elif request.content_type == 'application/json':
        wallet = request.get_json().get('wallet')

    if not wallet:
        return {"error": "Provide wallet address"}
    
    values = verify(token)
    email = str(values['email'])

    email_wallet_doc_ref = db.collection("nexuspay").document("email_mapping").collection("emails").document(email)
    email_wallet_doc = email_wallet_doc_ref.get().to_dict()

    if email_wallet_doc:
        return {"message": "Email already exists", "added": False}
    else:
        email_wallet_doc_ref.set({"wallet": wallet, "email": email})
        return {"message": None, "added": True}
