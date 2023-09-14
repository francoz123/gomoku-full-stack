export  type GameRecord = {
    id: string | undefined
    boardSize: number
    game: (string | number)[][][]
    date: string
    winner: string
}