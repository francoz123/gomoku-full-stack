export  type GameRecord = {
    id: string | undefined
    boardSize: number
    gameNumber: number
    game: (string | number)[][][]
    date: string
    winner: string
}