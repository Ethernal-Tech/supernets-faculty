import { createSlice } from '@reduxjs/toolkit'

export const eventReducer = createSlice({
    name: 'event',
    initialState: {
        selectedEvent: undefined
    },
    reducers: {
        setSelectedEvent: (state, action) => {
            state.selectedEvent = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setSelectedEvent } = eventReducer.actions

export default eventReducer.reducer
