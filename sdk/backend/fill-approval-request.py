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
    tx_hash = None
    email = None

    if request.content_type == 'application/x-www-form-urlencoded':
        request_id = request.form.get('id')
        tx_hash = request.form.get('tx_hash')
        email = request.form.get('email')
    elif request.content_type == 'application/json':
        request_id = request.get_json().get('id')
        tx_hash = request.get_json().get('tx_hash')
        email = request.get_json().get('email')

    if not request_id or not tx_hash or not email:
        return {"error": "Provide all details: id, tx_hash, email"}
    
    doc_ref = db.collection("nexuspay").document("email_mapping").collection("emails").document(email)
    doc = doc_ref.get().to_dict()

    if not doc:
        return {"error": "Email not found"}
    
    approvals = doc.get('approvals')
    if not approvals:
        approvals = []

    callback_url = None
    # mark approval request as approved and add tx_hash
    for approval in approvals:
        if approval['id'] == request_id:
            approval['is_filled'] = True
            approval['tx_hash'] = tx_hash
            callback_url = approval.get('callback_url')
            break

    response = None
    if callback_url:
        try:
            response = req.post(callback_url, json={"tx_hash": tx_hash, "id": request_id}).json()
        except:
            response = {"error": "Callback failed"}

    doc_ref.set({'approvals': approvals}, merge=True)

    return {"message": "Approval request filled", "response": response}
    
