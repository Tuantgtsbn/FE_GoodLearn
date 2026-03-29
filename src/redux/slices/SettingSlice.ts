import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const defaultSettingState = {
    theme: 'light',
    language: 'vi',
};

const settingSlice = createSlice({
    name: 'setting',
    initialState: defaultSettingState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        setLanguage: (state, action: PayloadAction<'vi' | 'en'>) => {
            state.language = action.payload;
        },
    },
});

export const { setTheme, setLanguage } = settingSlice.actions;
export default settingSlice.reducer;