from flask import Flask, request, jsonify 
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.post('/newgame')
def apply_newgame():
    args = request.args
    winner = args.get('winner')
    loser = args.get('loser')

    if winner and loser:
        response = {'beep': 'boop'}
        response = jsonify(response)
        response.status_code = 200
        return response
    else:
        return showMessage()

@app.get('/stats')
def get_stats():
    data = dict()
    data['callum'] = 2000
    data['marin'] = 1
    return {'data': data}, 200



if __name__ == '__main__':
    app.run(host='localhost', port=5000);

@app.errorhandler(404)
def showMessage(error=None):
    message = {
        'status': 404,
        'message': 'a lil oopsy woopsy: ' + request.url,
    }
    response = jsonify(message) # unnecessary?
    response.status_code = 404
    return response
