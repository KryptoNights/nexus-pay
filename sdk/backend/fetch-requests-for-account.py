import functions_framework
from flask_cors import cross_origin
from firebase_admin import firestore, initialize_app
import google.cloud.firestore
import requests as req
import random

initialize_app()
db: google.cloud.firestore.Client = firestore.client()

@functions_framework.http
@cross_origin()
def hello_http(request):
    request_auth_token = request.headers.get('Authorization').split(' ')[1]
    if not request_auth_token:
        return {"error": "Provide authorization token"}
    
    request_id = None
    email = None

    if request.content_type == 'application/x-www-form-urlencoded':
        request_id = request.form.get('id')
        email = request.form.get('email')
    elif request.content_type == 'application/json':
        request_id = request.get_json().get('id')
        email = request.get_json().get('email')

    if not email:
        return {"error": "Provide all details: email"}
    
    doc_ref = db.collection("nexuspay").document("email_mapping").collection("emails").document(email)
    doc = doc_ref.get().to_dict()

    if not doc:
        return {"error": "Email not found"}
    
    approvals = doc.get('approvals')
    if not approvals:
        approvals = []
    
    if not request_id:
        # return approval requests
        return {"approvals": approvals}
    else:
        # fetch specific approval request
        for approval in approvals:
            if approval['id'] == request_id:
                return {"approval": approval}
        return {"error": "Approval request not found"}
