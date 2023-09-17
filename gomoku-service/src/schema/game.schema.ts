import { object, string, number, array, TypeOf, boolean } from 'zod'

const payload = {
  body: object({
    board: array(
      array(
        string({
          required_error: 'Seats are required',
        })
      )
    ).nonempty(),
    moves: array(
      array(
        number({
          required_error: 'Moves are required',
        })
      )
    ).nonempty(),
    moveNumber: number({
      required_error: 'Move Number is required',
    }),
    boardSize: number({
      required_error: 'Board size is required',
    }),
    turn: string({
      required_error: 'Turn is required',
    }),
    date: string({
      required_error: 'Date is required',
    }),
    winner: string({
      required_error: 'Winner is required',
    }),
    gameOver: boolean({
      required_error: 'Move Number is required',
    }),
    lastMove: array(
      number({
        required_error: 'lastMove is required',
      })
    ).nonempty(),
  }),
}

const getParams = {
  params: object({
    id: string({
      required_error: 'ID id is required',
    }),
  }),
}

const updateDeleteParams = {
  params: object({
    _id: string({
      required_error: 'Game id is required',
    }),
  }),
}

export const createGameSchema = object({
  ...payload,
})
export const updateGameSchema = object({
  body: object({
    _id: string({
      required_error: 'Game id is required',
    }),
    board: array(
      array(
        string({
          required_error: 'Seats are required',
        })
      )
    ).nonempty(),
    moves: array(
      array(
        number({
          required_error: 'Moves are required',
        })
      )
    ).nonempty(),
    moveNumber: number({
      required_error: 'Move Number is required',
    }),
    boardSize: number({
      required_error: 'Board size is required',
    }),
    turn: string({
      required_error: 'Turn is required',
    }),
    date: string({
      required_error: 'Date is required',
    }),
    winner: string({
      required_error: 'Winner is required',
    }),
    gameOver: boolean({
      required_error: 'Move Number is required',
    }),
    lastMove: array(
      number({
        required_error: 'lastMove is required',
      })
    ).nonempty(),
  }),
})
export const deleteGameSchema = object({
  ...updateDeleteParams,
})
export const getGamesSchema = object({
  ...getParams,
})

export type CreateGameInput = TypeOf<typeof createGameSchema>
export type UpdateGameInput = TypeOf<typeof updateGameSchema>
export type ReadGamesInput = TypeOf<typeof getGamesSchema>
export type DeleteGameInput = TypeOf<typeof deleteGameSchema>
