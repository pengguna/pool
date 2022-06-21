import json
import socket
import os
from enum import Enum
from datetime import datetime

class ExtendedEnum(Enum):
    @classmethod
    def list(cls):
        return list(map(lambda c: c.value, cls))

class Actions(ExtendedEnum):

    ADD = 'ADD'
    LEADERBOARD = 'LEADERBOARD'
    PLAY = 'PLAY'
    REGEN = 'REGEN'
    TEST = 'TEST'
    WINRATE = 'WINRATE'
    NOACTION = 'NOACTION'
    QUIT = 'QUIT'
    HELP = 'HELP'
    GAMESPLAYED = 'GAMESPLAYED'


def ConvertToAction(action):
    if action.upper() in Actions.list():
        return Actions[action.upper()]
    if action == 'ng':
        return Actions.PLAY
    if action == 'board':
        return Actions.LEADERBOARD
    if action == 'wr':
        return Actions.WINRATE
    if (action == 'q') or (action == 'exit'):
        return Actions.QUIT
    if (action == 'h') or (action == '?'):
        return Actions.HELP
    if (action == 'gp'):
        return Actions.GAMESPLAYED
    return Actions.NOACTION

BASE_PATH = os.path.dirname(os.path.abspath(__file__))

def ExpectedScore(Ra, Rb):
    return 1.0/(1.0+10.0**((Rb-Ra)/400.0))

def UpdatedScore(Sa, Ea):
    K = 20.0
    return K*(Sa-Ea)

def UpdateGame(Ra, Rb):
    # n.b. not needed since loss gain is symmetric
    ResA = UpdatedScore(1, ExpectedScore(Ra,Rb))
    ResB = UpdatedScore(0, ExpectedScore(Rb,Ra))
    return (ResA, ResB)

def AddPlayer(players):
    name = input('name: ')
    if name == '':
        print('empty name :(')
        return

    if name in players:
        print("player exists")
        return
    players[name] = 1000

def Finish(players):
    with open(BASE_PATH + '/' + 'players', 'w') as f:
        f.write(json.dumps(players))

def GetPlayers():
    with open(BASE_PATH + '/' + 'players', 'r') as f:
        d = json.load(f)
        return d

def ResolvePlayerName(name):
    players = GetPlayers()
    if name.lower() in players:
        return name.lower()
    if name == 'john':
        return 'johnny'
    if name == 'yudi':
        return 'george'
    return None 

def GetAction(prompt):
    txt = Actions.NOACTION
    while txt == Actions.NOACTION:
        print('lup')
        txt = ConvertToAction(input(prompt))
    return txt

def GetPlayer(players, prompt):
    p = ''
    while not p in players:
        p = GetNonNull(prompt)
    return p

def StoreGame(p1, p2):
    dt = datetime.now().strftime("%Y-%m-%d")
    with open(BASE_PATH + '/' + 'history', 'a') as f:
        f.write(dt + ' ' + p1 + ' ' + p2 + '\n')

def Leaderboard(players):
    print('\nPlayer\t\tElo\n')
    for item in (sorted(players.items(), key = lambda item:item[1], reverse=True)):
        print(item[0], '\t\t', round(item[1], 3))

def TestGame(players, p1, p2):
    if p1 not in players:
        return p1 + " is not in player list"
    if p2 not in players: 
        return p2 + " is not in player list"

    message = ''
    
    res = UpdateGame(players[p1], players[p2])
    message += f'if {p1} wins the delta is {res[0]}\n'
    res = UpdateGame(players[p2], players[p1])
    message += f'if {p2} wins the delta is {res[0]}\n'
    return message

def Regenerate():
    players = dict()
    
    def assertPlayers(p1, p2):
        if not (p1 in players):
            players[p1] = 1000
        if not (p2 in players):
            players[p2] = 1000
    
    with open(BASE_PATH + '/' + 'history', 'r') as f:
        for line in f:
            dt, p1, p2 = line.split()
            assertPlayers(p1, p2)
            
            res = UpdateGame(players[p1], players[p2]) # know p1 won due to storage
            players[p1] += res[0]
            players[p2] += res[1]

    Leaderboard(players)
    Finish(players)
    return players

def WinRate():
    message_parts = []
    message = ''
    all_games = []
    allPlayers = set()
    with open(BASE_PATH + '/' + 'history', 'r') as f:
        for line in f:
            dt, p1, p2 = line.split()
            allPlayers.add(p1)
            allPlayers.add(p2)
            all_games.append((p1,p2))

    remove_players = []
    for p in allPlayers:
        count = 0
        for game in all_games:
            if p in game:
                count = count + 1
        if count < 10:
            remove_players.append(p)

    for p in [p for p in allPlayers if p not in remove_players]:
        total = 0
        wins = 0
        for p1, p2 in all_games:
            if p1 == p:
                total += 1
                wins += 1
            if p2 == p:
                total += 1
        message_parts.append((p,total,wins))

    last_10_wins = dict()

    for p in [p for p in allPlayers if p not in remove_players]:
        win_string = ''
        total = 0
        wins = 0

        for p1, p2 in reversed(all_games):
            if total >= 10:
                break
            if p1 == p:
                total += 1
                wins += 1
                win_string = 'W' + win_string
            if p2 == p:
                total += 1
                win_string = 'L' + win_string
        
        last_10_wins[p] = f'{100*(wins/total):.0f}% ' + win_string

    message_parts = sorted(message_parts, key=lambda x: x[2]/x[1], reverse=True)
    message += '\nPlayer\t\tWR (All)\tWR (10)\n\n'
    for m in message_parts:
        message += f'{m[0]}\t\t{100*(m[2]/m[1]):.2f}%\t\t{last_10_wins[m[0]]}\n'
    return message

def GetLeaderboard(players):
    message = '\nPlayer\t\tElo\n\n'
    for item in (sorted(players.items(), key = lambda item:item[1], reverse=True)):
        message += item[0] + '\t\t' + str(round(item[1], 3)) + '\n'
    return message

def PlayGameRequest(players, winner, loser):
    winner = ResolvePlayerName(winner)
    loser = ResolvePlayerName(loser)
    if winner not in players:
        return 'invalid winner name'
    if loser not in players: 
        return 'invalid loser name'
    if winner == loser:
        return 'you can play yourself, just not here'

    res = UpdateGame(players[winner], players[loser])
    players[winner] += res[0]
    players[loser] += res[1]
    StoreGame(winner, loser)
    return GetLeaderboard(players)


# note this is major code duplication
def PairGamesPlayed(return_dict=False):
    all_games = []
    all_players = set()
    with open(BASE_PATH + '/' + 'history', 'r') as f:
        for line in f:
            dt, p1, p2 = line.split()
            all_players.add(p1)
            all_players.add(p2)
            all_games.append((p1,p2))


    players_to_remove = []
    for player in all_players:
        count = 0
        for game in all_games:
            if player in game:
                count = count + 1
        if count < 10:
            players_to_remove.append(player)



    pair_games = [tuple(sorted((p1 ,p2))) for p1,p2 in all_games]
    pair_games = list(set(pair_games))

    matrix = dict()

    for p1 in all_players:
        matrix[p1] = dict()
        for p2 in all_players:
            if p1 == p2:    
                matrix[p1][p2] = "X" 
            else:
                matrix[p1][p2] = ""

    for pair in pair_games:
        ref1, ref2 = list(pair)
        p1wins = 0
        p2wins = 0
        total = 0

        for p1, p2 in all_games:
            if set([p1,p2]) == set(pair):
                total += 1

        matrix[ref1][ref2] = total
        matrix[ref2][ref1] = total

    for pdict in matrix:
        for p in players_to_remove:
            matrix[pdict].pop(p)

    for p in players_to_remove:
        matrix.pop(p)


    global_played = matrix

    message_parts = []
    header = ' total\t'

    for k, v in matrix.items():
        header = header + k + '\t'

    for k, v in matrix.items():
        message = k + '\t'
        for k2, v2, in v.items():
            if isinstance(v2, str): 
                message = message + v2 + "\t"
            else:
                message = message + str(v2) + '\t'

        message_parts.append(message)

    message = header + '\n' 
    for m in message_parts:
        message = message + m + '\n' 

    if return_dict:
        return matrix
    return message

def PairWinRate(return_dict=False):
    all_games = []
    all_players = set()
    with open(BASE_PATH + '/' + 'history', 'r') as f:
        for line in f:
            dt, p1, p2 = line.split()
            all_players.add(p1)
            all_players.add(p2)
            all_games.append((p1,p2))


    players_to_remove = []
    for player in all_players:
        count = 0
        for game in all_games:
            if player in game:
                count = count + 1
        if count < 10:
            players_to_remove.append(player)



    pair_games = [tuple(sorted((p1 ,p2))) for p1,p2 in all_games]
    pair_games = list(set(pair_games))

    matrix = dict()

    for p1 in all_players:
        matrix[p1] = dict()
        for p2 in all_players:
            if p1 == p2:    
                matrix[p1][p2] = "X" 
            else:
                matrix[p1][p2] = ""

    for pair in pair_games:
        ref1, ref2 = list(pair)
        p1wins = 0
        p2wins = 0
        total = 0

        for p1, p2 in all_games:
            if set([p1,p2]) == set(pair):
                if (p1 == ref1):
                    p1wins = p1wins +1
                else:
                    p2wins = p2wins + 1
                total += 1

        matrix[ref1][ref2] = p1wins/total
        matrix[ref2][ref1] = p2wins/total


    for pdict in matrix:
        for p in players_to_remove:
            matrix[pdict].pop(p)

    for p in players_to_remove:
        matrix.pop(p)

    players = GetPlayers()
    useful_players = list(matrix.keys())
    worth_elo = dict()

    for p in useful_players:
        worth_elo[p] = dict()
        for p2 in useful_players:
            if p is not p2:
                if isinstance(matrix[p][p2], str):
                    # not a real result
                    worth_elo[p][p2] = "PLAY!"
                else:
                    worth_elo[p][p2] = matrix[p][p2] - ExpectedScore(players[p], players[p2])
            else:
                worth_elo[p][p2] = 'X'

    message_parts = []
    header = ' w\\l\t'

    for k, v in matrix.items():
        header = header + k + '\t'

    for k, v in matrix.items():
        message = k + '\t'
        for k2, v2, in v.items():
            if isinstance(v2, str): 
                message = message + v2 + "\t"
            else:
                message = message + str(round(v2*100,1)) + '\t'

        message_parts.append(message)


    final_message = header + '\n' 
    for m in message_parts:
        final_message = final_message + m + '\n' 
    # add need the "worthness"

    message_parts = []
    message_parts.append('\n\n' + header + '\n')
    for k,v in worth_elo.items():
        message = k + '\t'
        for k2, v2, in v.items():
            if isinstance(v2, str):
                message = message + v2 + '\t'
            else:
                message = message + str(round(v2*100,1)) + '\t'

        message_parts.append(message)

    for m in message_parts:
        final_message = final_message + m + '\n'
    

    if return_dict:
        return matrix
    return final_message

def GetRecommendedMatch(user):
    matrix = PairGamesPlayed(True)

    if user not in matrix:
        return 'you need to play more games\n'

    min = 9999999
    user_to_play = 'error'

    for k,v in matrix[user]:
        if k is not user:
            if v < min:
                min = v
                user_to_play = k

    return f'you should play {user_to_play} since you\'ve only played {min} games.\n'

def PerformAction(actionDict):
    players = GetPlayers()

    action = ConvertToAction(actionDict['action'])
    message = 'something weird happened'

    if action== Actions.ADD: 
        message = 'Not available remotely...'
        # AddPlayer(players)
    elif action == Actions.PLAY:
        if 'winner' not in actionDict:
            message = 'winner dict key missing'
        elif 'loser' not in actionDict:
            message = 'loser dict key missing'
        else:
            message = PlayGameRequest(players, actionDict['winner'], actionDict['loser'])
    elif action == Actions.LEADERBOARD:
        message = GetLeaderboard(players)
    elif action == Actions.TEST:
        if 'winner' not in actionDict:
            message = 'winner dict key missing'
        elif 'loser' not in actionDict:
            message = 'loser dict key missing'
        message =  TestGame(players, actionDict['winner'], actionDict['loser'])
    elif action == Actions.REGEN:
        players = Regenerate()
    elif action == Actions.WINRATE:
        message = WinRate()
        message = message + '\n\n' + PairWinRate() #change back to WinRate()
    elif action == Actions.GAMESPLAYED:
        message = PairGamesPlayed() + '\n\n' + PairWinRate()
    elif action == Actions.NOACTION:
        message = "no action taken, why would you choose that?"
    else:
        message = 'something weird, nothing done'

    Finish(players)
    return message

s = socket.socket()
host = '127.0.0.1'
port = 49023

s.bind((host,port))
s.listen(10)

global_players = GetPlayers()

try:
    while True:
        c, addr = s.accept()
        print( addr)
        status = 'OK'

        while True:
            content = c.recv(100).decode()

            if not content:
                c.sendall("didnt get any content?".encode())
                break
            data = json.loads(content) 
            dt = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(dt, data)
            if ('user' not in data):
                print('user not supplied')
                res = 'user not supplied'
                status = 'ERROR'

            user = data['user'].split('.')[0]
            user = ResolvePlayerName(user)

            if user not in global_players:
                print('user not found')
                res = 'for some reason your user isnt valid'
                status = 'ERROR'

            if status == 'OK': 
                res = PerformAction(data)

            response = dict()
            response['message'] = res
            response['status'] = status
            # action = ConvertToAction(data['action'])
            # if action == Actions.PLAY:
                # response['message'] = GetRecommendedMatch(user) + '\n' + response['message']

            c.sendall(json.dumps(response).encode())

except Exception  as e:
    print(e)
    s.close()

