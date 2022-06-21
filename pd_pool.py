import pandas as pd
import numpy as np
import os

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

    @property
    def wins(self):
        return self._wins

    def add_games(self, total, wins):
        self._total += total
        self._wins += wins


class Player:
    def __init__(self, name):
        self.elo = 1
        self.name = name
        self.games = dict()

    def add_games(self, opponent, wins, total=1):
        # optionally add more than 1 entry.
        if opponent not in self.games:
            self.games[opponent] = PairData(total, wins)
        else:
            self.games[opponent].add_games(total, wins)
    def print(self):
        print(self.name)
        print()
        for k, v in self.games.items():
            print(k, v.total, v.wins)
        print()

def debug(msg):
    IS_DEBUG = True
    if IS_DEBUG:
        print(msg)

def get_players():
    df = pd.read_csv("history", sep=" ", names=["date", "winner", "loser"])
    df = df.set_index('date')
    return pd.unique(df[['winner','loser']].values.ravel('K')).tolist()


all_matches = df.groupby(df.columns.tolist(), as_index=False).size()

all_players = dict()
for p in get_players():
    debug("creating player " + p)
    all_players[p] = Player(p)

for i, r in all_matches.iterrows():
    all_players[r.loc['winner']].add_games(r.loc['loser'], r.loc['size'], r.loc['size'])
    all_players[r.loc['loser']].add_games(r.loc['winner'], 0, r.loc['size'])


for k,v in all_players.items():
    v.print()


