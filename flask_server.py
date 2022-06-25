from flask import Flask, request, jsonify 
from flask_cors import CORS, cross_origin
import file_tasks
import pd_pool

app = Flask(__name__)
CORS(app)


pool_handler = pd_pool.PoolHandler()

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

@app.get('/player')
def get_player():
    args = request.args
    player_name = args.get('name')
    if player_name:
        player = pool_handler.get_player(player_name)

        if player:
            response = player.serialise()
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

@app.get('/player_list')
def get_player_list():
    print('called get players')
    players = file_tasks.get_players().tolist()
    data = dict()
    data['players'] = players
    return {'data': data}, 200


@app.errorhandler(404)
def showMessage(error=None):
    message = {
        'status': 404,
        'message': 'a lil oopsy woopsy: ' + request.url,
    }
    response = jsonify(message) # unnecessary?
    response.status_code = 404
    return response

if __name__ == '__main__':
    app.run(host='localhost', port=5000);

