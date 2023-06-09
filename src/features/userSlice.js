import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: 'idle',
    usersDetail: [],
};


export const userSlice = createSlice({
    name: 'users',
    initialState,

    reducers: {
        showAllUser: (state, action) => {
            state.usersDetail = [...action.payload];
        },

        addUser: (state, action) => {
            state.usersDetail = [...state.usersDetail, action.payload];
        },

        deleteUser: (state, action) => {
            let prevUser = JSON.parse(JSON.stringify(state.usersDetail));
            state.usersDetail = prevUser.filter((user) => {
                return user._id !== action.payload;
            })
        },

        updateUser: (state, action) => {
            let prevUser = JSON.parse(JSON.stringify(state.usersDetail));
            const [userid, editDataResult] = action.payload;
            state.usersDetail = prevUser.map((user) => {
                if (user._id === userid) return { _id: user._id, ...editDataResult };
                return user;
            });
        }
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    // extraReducers: (builder) => {
    //   builder
    //     .addCase(incrementAsync.pending, (state) => {
    //       state.status = 'loading';
    //     })
    //     .addCase(incrementAsync.fulfilled, (state, action) => {
    //       state.status = 'idle';
    //       state.value += action.payload;
    //     });
    // },
});

export const { showAllUser, addUser, deleteUser, updateUser } = userSlice.actions;

export const usersDetail = (state) => state.userData.usersDetail;

export default userSlice.reducer;
