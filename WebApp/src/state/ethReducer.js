import { createSlice } from '@reduxjs/toolkit'

export const ethReducer = createSlice({
    name: 'eth',
    initialState: {
        selectedAccount: undefined,
        gasPrice: undefined,
    },
    reducers: {
        setSelectedAccount: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.selectedAccount = action.payload
        },
        setGasPrice: (state, action) => {
            state.gasPrice = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setSelectedAccount, setGasPrice } = ethReducer.actions

export default ethReducer.reducer