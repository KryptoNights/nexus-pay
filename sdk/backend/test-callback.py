import functions_framework

@functions_framework.http
def hello_http(request):
    tx_hash = None
    id = None

    if request.content_type == 'application/x-www-form-urlencoded':
        tx_hash = request.form.get('tx_hash')
        id = request.form.get('id')
    elif request.content_type == 'application/json':
        tx_hash = request.get_json().get('tx_hash')
        id = request.get_json().get('id')

    return {"message": f"Received tx_hash: {tx_hash} and id: {id}"}