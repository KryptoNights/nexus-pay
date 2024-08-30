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

def next_string(s):
    """
    Finds the next string in the chronological order of characters.

    Args:
        s: The input string.

    Returns:
        The next string in the chronological order of characters.
    """

    result = list(s)
    carryover = 1

    for i in range(len(result) - 1, -1, -1):
        if carryover == 0:
            break

        result[i] = chr(ord(result[i]) + carryover)
        if result[i] > 'z':
            carryover = 1
            result[i] = 'a'
        else:
            carryover = 0

    if carryover == 1:
        result.insert(0, 'a')

    return ''.join(result)

@functions_framework.http
@cross_origin()
def hello_http(request):
    token = request.headers.get('Authorization').split(' ')[1]
    verify(token)

    query = None
    if request.content_type == 'application/x-www-form-urlencoded':
        query = request.form.get('query')
    elif request.content_type == 'application/json':
        query = request.get_json().get('query')

# def test(query):

    if not query:
        return {"error": "Provide query address"}
    
    results = db.collection("nexuspay").document("email_mapping").collection("emails").where("email", ">=", query).where("email", "<", next_string(query)).limit(10).get()
    emails = [result.id.split('@')[0] + "@nexus" for result in results]

    print(emails)
    return {"emails": emails}


# if __name__ == "__main__":
#     #   get from args
#     # string = sys.argv[1]
#     # print(string, end=" -> ")
#     # string = next_string(string)
#     # print(string)

#     query = "deb"
#     test(query)
