from google.oauth2 import id_token
from google.auth.transport import requests
# import functions_framework
# from flask_cors import cross_origin
from firebase_admin import firestore, initialize_app
import google.cloud.firestore
import sys

initialize_app()
db: google.cloud.firestore.Client = firestore.client()

# @functions_framework.http
# @cross_origin()
# def hello_http(request):
#     token = request.headers.get('Authorization').split(' ')[1]
#     verify(token)

#     query = None
#     if request.content_type == 'application/x-www-form-urlencoded':
#         query = request.form.get('query')
#     elif request.content_type == 'application/json':
#         query = request.get_json().get('query')

def test(nexus_id: str):

    if not nexus_id:
        return {"error": "Provide query address"}
    
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


if __name__ == "__main__":
    #   get from args
    string = sys.argv[1]
    res = test(string)
    print(res)
