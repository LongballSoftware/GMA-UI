import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export type World = {
    id: number;
    name: string;
    description: string;
    system: string;
    genre: string;
    owner: string;
}

const initialState: World = {
    id: 0,
    name: '',
    description: '',
    system: '',
    genre: '',
    owner: ''
}

export const worldSlice = createSlice({
    name: 'world',
    initialState,
    reducers: {
        setWorld: (_state, action: PayloadAction<World>) => {
            return action.payload;
        }
    }
});

export const { setWorld } = worldSlice.actions;

export default worldSlice.reducer;