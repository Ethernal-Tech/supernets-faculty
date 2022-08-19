import { createSlice } from '@reduxjs/toolkit'

export const eventReducer = createSlice({
    name: 'event',
    initialState: {
        allEvents: undefined,
        selectedEvent: undefined,
    },
    reducers: {
        setEvents: (state, action) => {
            state.allEvents = action.payload
        },
        setSelectedEvent: (state, action) => {
            state.selectedEvent = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setEvents, setSelectedEvent } = eventReducer.actions

export default eventReducer.reducer