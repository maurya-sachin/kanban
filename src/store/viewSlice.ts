import { createSlice } from '@reduxjs/toolkit';

interface ViewState {
  view: 'list' | 'grid';
}

const initialState: ViewState = {
  view: 'list', // Default view
};

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    toggleView(state) {
      state.view = state.view === 'list' ? 'grid' : 'list';
    },
    setView(state, action: { payload: 'list' | 'grid' }) {
      state.view = action.payload;
    },
  },
});

export const { toggleView, setView } = viewSlice.actions;
export default viewSlice.reducer;
