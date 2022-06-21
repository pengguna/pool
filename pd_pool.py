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

    print(games['winner'].value_counts().div(games[['winner', 'loser']].stack().value_counts()))

def GetWinRates(df):
    wr = df['winner'].value_counts().div(
            df[['winner', 'loser']].stack().value_counts()
            ).fillna(0)
    print(wr[df[['winner', 'loser']].stack().value_counts() > MIN_GAMES][::-1])

print(GetPairWinRate(df, 'callum', 'kevin'))

test_df = df.groupby(df.columns.tolist(), as_index=False).size()
print(test_df)

players = df[['winner', 'loser']].stack().unique()
