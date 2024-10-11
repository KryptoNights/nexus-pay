import functions_framework
from flask_cors import cross_origin
from firebase_admin import firestore, initialize_app
import google.cloud.firestore
import requests as req
import random
from datetime import datetime

def random_id(n = 12):
    return ''.join(random.choices('0123456789QWERTYUIOPASDFGHJKLZXCVBNMwertyuiopsdfghjklzxcvbnm', k=n))

initialize_app()
db: google.cloud.firestore.Client = firestore.client()

@functions_framework.http
@cross_origin()
def hello_http(request):
    request_auth_token = request.headers.get('Authorization').split(' ')[1]
    if not request_auth_token:
        return {"error": "Provide authorization token"}

    # TODO: Implement verify function and change architecture to prevent races
    # ...

    request_name = None
    request_details = None
    request_amount = None
    request_token = None
    email_to_request = None
    callback_url = None
    recipient_wallet = None

    if request.content_type == 'application/x-www-form-urlencoded':
        request_name = request.form.get('name')
        request_details = request.form.get('details')
        request_amount = request.form.get('amount')
        request_token = request.form.get('token')
        email_to_request = request.form.get('email_to_request')
        callback_url = request.form.get('callback_url')
        recipient_wallet = request.form.get('recipient_wallet')
    elif request.content_type == 'application/json':
        request_name = request.get_json().get('name')
        request_details = request.get_json().get('details')
        request_amount = request.get_json().get('amount')
        request_token = request.get_json().get('token')
        email_to_request = request.get_json().get('email_to_request')
        callback_url = request.get_json().get('callback_url')
        recipient_wallet = request.get_json().get('recipient_wallet')

    if not request_name or not request_details or not request_amount or not request_token or not email_to_request or not callback_url or not recipient_wallet:
        return {"error": "Provide all details: name, details, amount, token, email_to_request, callback_url, recipient_wallet"}
    
    doc_ref = db.collection("nexuspay").document("email_mapping").collection("emails").document(email_to_request)
    doc = doc_ref.get().to_dict()

    if not doc:
        return {"error": "Email not found"}

    approvals = doc.get('approvals')
    if not approvals:
        approvals = []

    # add approval request to start of list
    approvals.insert(0, {
        "name": request_name,
        "details": request_details,
        "amount": request_amount,
        "token": request_token,
        "callback_url": callback_url,
        "recipient_wallet": recipient_wallet,
        "id": random_id(),
        "is_filled": False,
        "timestamp": datetime.now()
    })

    doc_ref.set({"approvals": approvals}, merge=True)

    return {"message": None, "added": True, "approvals": approvals[0]}