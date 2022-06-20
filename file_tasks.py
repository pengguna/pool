import pandas as pd

def get_players():
    df = pd.read_csv("history", sep=" ", names=["date", "winner", "loser"])
    df = df.set_index('date')
    return pd.unique(df[['winner','loser']].values.ravel('K'))

