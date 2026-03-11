import AuthReducer from './slices/AuthSlice';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
    key: 'auth',
    version: 1,
    storage: storage,
    blacklist: ['isAuthenticated'],
};

const appReducers = combineReducers({
    auth: persistReducer(authPersistConfig, AuthReducer),
});

const rootReducers = (state: any, action: any) => {
    if (action.type === 'auth/logoutUser') {
        state = undefined;
    }
    return appReducers(state, action);
};

const store = configureStore({
    reducer: rootReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export default store;

export type IRootState = ReturnType<typeof store.getState>;
export type IAppDispatch = typeof store.dispatch;
