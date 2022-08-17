import pandas as pd
import json
import os
import numpy as np
from datetime import datetime

pd.options.display.float_format = '{:.2%}'.format

MIN_GAMES = 10
def GetHistoryDataFrame():
    BASE_PATH = os.path.dirname(os.path.abspath(__file__))
    rows = []
    with open(BASE_PATH + '/' + 'history', 'r') as f:
        for line in f:
            dt, winner, loser = line.split()
            rows.append((dt, winner,loser))
    df = pd.DataFrame(rows, columns=['date', 'winner', 'loser'])
    df.set_index("date", inplace=True)
    return df

df = GetHistoryDataFrame()


def GetPairGames(df, p1, p2):
    return df.loc[df['loser'].isin([p1,p2]) & df['winner'].isin([p1,p2])]

def GetPairWinRate(df, p1, p2):
    games = GetPairGames(df, p1, p2)
    if not len(games):
        return ('X', 'X')

    print(games)
    print(games['winner'].value_counts().div(games[['winner', 'loser']].stack().value_counts()))

def GetWinRates(df):
    wr = df['winner'].value_counts().div(
            df[['winner', 'loser']].stack().value_counts()
            ).fillna(0)
    print(wr[df[['winner', 'loser']].stack().value_counts() > MIN_GAMES][::-1])

print(GetPairWinRate(df, 'callum', 'marin'))


players = df[['winner', 'loser']].stack().unique()


class PairData:
    def __init__(self, total, wins):
        self._total = total
        self._wins = wins

    @property
    def total(self):
        return self._total

    @total.setter
    def total(self, v):
        self._total = v

    @property
    def wins(self):
        return self._wins

    @wins.setter
    def wins(self, v):
        self._wins = v

    def add_games(self, total, wins):
        self._total += total
        self._wins += wins


class Player:
    def __init__(self, name):
        self._elo = 1000
        self._name = name
        self.games = dict()

    def add_games(self, opponent, wins, total=1):
        # optionally add more than 1 entry.
        if opponent not in self.games:
            self.games[opponent] = PairData(total, wins)
        else:
            self.games[opponent].add_games(total, wins)
    def print(self):
        print(self._name)
        print()
        for k, v in self.games.items():
            print(k, v.total, v.wins)
        print()

    def get_total_games(self):
        total = 0
        for k, v in self.games.items():
            total += v.total
        return total

    def get_winrate(self, opp):
        # takes a string, see if exists
        if opp in self.games:
            return self.games[opp].wins / self.games[opp].total
        return None

    def serialise(self):
        data = dict()
        data['elo'] = self._elo
        data['name'] = self._name
        data['games'] = dict()
        for k, v in self.games.items():
            data['games'][k.name] = dict()
            data['games'][k.name]['total'] = v.total
            data['games'][k.name]['wins'] = v.wins
        return data

    @property
    def elo(self):
        return self._elo

    @elo.setter
    def elo(self, v):
        self._elo = v

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, v):
        self._name = v


class EloCalculator:
    def __init__(self, winner, loser):
        # take in two player objects
        self.winner = winner
        self.loser = loser
        self._K = 20
        self._update_game()

    def _expected_score(self):
        return 1.0/(1.0+10.0**((self.loser.elo-self.winner.elo)/400.0))

    def _updated_score(self, ea):
        return self._K*(1.0-ea) # we pass the winner and its bo1

    def _update_game(self):
        self._delta = self._updated_score(self._expected_score())

    @property
    def delta(self):
        return self._delta

    @delta.setter
    def delta(self, v):
        if delta <= 0:
            raise Exception("delta can't be negative")
        self.delta = v


class PoolHandler:
    def __init__(self):
        self._BASE_PATH = os.path.dirname(os.path.abspath(__file__))
        self._MIN_GAMES = 10
        self.replay_history()
        
    # def _construct_players(self):
    #     # first just get a list of everyone.
    #     df = pd.read_csv("history", sep=" ", names=["date", "winner", "loser"])
    #     df = df.set_index('date')
    #     self.player_names = pd.unique(df[['winner','loser']].values.ravel('K')).tolist()

    #     self.all_players = dict()

    #     for p in self.player_names:
    #         self.all_players[p] = Player(p)
        
    #     # now need to add all the games.
    #     all_matches = df.groupby(df.columns.tolist(), as_index=False).size()
    #     for i, r in all_matches.iterrows():
    #         self.all_players[r.loc['winner']].add_games(r.loc['loser'], r.loc['size'], r.loc['size'])
    #         self.all_players[r.loc['loser']].add_games(r.loc['winner'], 0, r.loc['size'])

    def get_player(self, name):
        if name in self.all_players:
            return self.all_players[name]
        return None

    def map_elos(self):
        elo_dict = dict()

        for (name, data) in self.all_players.items():
            elo_dict[name] = data.elo
        return elo_dict

    def get_leaderboard(self):
        board = self.map_elos()
        return sorted(board.items(), key = lambda item:item[1], reverse=True)

    def write_game(self, winner, loser):
        # update seperate elo file
        with open(self._BASE_PATH + '/' + 'players', 'w') as f:
            f.write(json.dumps(self.map_elos()))

        # now add to history file
        dt = datetime.now().strftime("%Y-%m-%d")
        with open(self._BASE_PATH + '/' + 'history', 'a') as f:
            f.write(dt + ' ' + winner.name + ' ' + loser.name + '\n')

    def get_winrate_table(self):
        # want to construct a table of relative win rates.
        player_order = set(self.all_players.keys())

        for player in self.all_players:
            if player.get_total_games() < self._MIN_GAMES:
                player_order.remove(player.name)

        # untested, still need the header.
        display = ""
        for player in self.all_players:
            msg_line = player.name + ":\t"
            for opp in player_order:
                wr = player.get_winrate(opp)
                if wr:
                    msg_line += str(round(wr*100,1))
                msg_line += '\t'
            display += msg_line + '\n'

        return display


    def replay_history(self):

        # wipe existing
        self.all_players = dict()

        def _assert_player(player):
            if player not in self.all_players:
                self.all_players[player] = Player(player)
        
        with open(self._BASE_PATH + '/' + 'history', 'r') as f:
            for line in f:
                dt, winner_name, loser_name = line.split()
                _assert_player(winner_name)
                _assert_player(loser_name)

                self.new_game(winner_name, loser_name, True)

    def get_historical_elo(self):

        df = pd.read_csv('history', sep= ' ', header=None, names=['Date', 'Winner', 'Loser'])
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.set_index('Date')
        # this is bad, really this should throw. Should NEVER be the case.
        df = df.sort_index()

        elo = {}
        time_series = [] # js will interpret better if it's an array of dicts. 

        def _assert_players(*players):
            for p in players:
                if p not in elo:
                    elo[p] = Player(p)

        for date in pd.date_range(df.index[0], df.index[-1], freq="d"):
            if date in df.index:
                time_point = {'date': str(date.date())}
                # bit gross but .loc yields a series for single entries otherwise
                day = df.loc[date:date]

                for i, r in day.iterrows():
                    _assert_players(r['Winner'], r['Loser'])
                    winner = elo[r['Winner']]
                    loser = elo[r['Loser']]

                    calc = EloCalculator(winner, loser)
                    delta = calc.delta
                    winner.elo += delta
                    loser.elo -= delta

                    winner.add_games(loser, 1) 
                    loser.add_games(winner, 0) 

                for k,v in elo.items():
                    time_point[k] = v.elo

                time_series.append(time_point)

        return {'names': [name for name in elo.keys()], 'data': time_series}

    def new_game(self, winner_name, loser_name, replay_mode=False):
        print('in ng')
        if (winner_name not in self.all_players) or (loser_name not in self.all_players):
            print('winner and loser name not supplied')
            raise Exception("upsie wupsie lil fucky wucky")

        winner = self.all_players[winner_name]
        loser = self.all_players[loser_name]

        print('located players')

        calc = EloCalculator(winner, loser)
        delta = calc.delta

        winner.elo += delta
        loser.elo -= delta

        winner.add_games(loser, 1) 
        loser.add_games(winner, 0) 

        if not replay_mode:
            self.write_game(winner, loser)





