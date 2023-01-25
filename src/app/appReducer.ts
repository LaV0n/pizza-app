import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {pizzaAPI} from "../api/pizza-api";
import { errorAsString } from "../utils/errorAsString";

export type StatusType = 'success' | 'loading' | 'error'

export type RestaurantsType = {
    id: number
    name: string
    address1: string
    address2: string
    latitude: string
    longitude: string
}

export type MenuType = {
    id: number
    category: string
    name: string
    topping: string[]
    price: number
    rank: number
}

type InitialStateType = {
    restaurants: RestaurantsType[]
    menu: MenuType[],
    status:StatusType
    notice:string
}

const initialState: InitialStateType = {
    restaurants: [],
    menu: [],
    status:"success",
    notice:''
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setStatus(state,action:PayloadAction<{status:StatusType}>){
            state.status=action.payload.status
        },
        deleteAllMenu(state){
            state.menu=[]
        }
    },
    extraReducers:builder => {
        builder.addCase(getRestaurantsTC.fulfilled,(state, action)=>{
            state.restaurants=action.payload
            state.status='success'
        })
        builder.addCase(getRestaurantsTC.rejected,(state,action)=>{
            state.notice = action.payload ? action.payload.error : 'unknown error, please try again later'
            state.status = 'error'
        })
        builder.addCase(getMenuTC.fulfilled,(state, action)=>{
            state.menu=action.payload
            state.status='success'
        })
        builder.addCase(getMenuTC.rejected,(state,action)=>{
            state.notice = action.payload ? action.payload.error : 'unknown error, please try again later'
            state.status = 'error'
        })
    }
})

export const appReducer = slice.reducer
export const {setStatus,deleteAllMenu}=slice.actions

export const getRestaurantsTC=createAsyncThunk<RestaurantsType[],undefined, {rejectValue: {error:string}}> //fix type
('app/getRestaurants',
    async (arg,{dispatch,rejectWithValue})=>{
    dispatch(setStatus({status:'loading'}))
    try{
        const res=await pizzaAPI.getRestaurants()
        return res.data
    } catch (err){
        const error=errorAsString(err)
        return rejectWithValue({error})
    }
}
    )

export const getMenuTC=createAsyncThunk<MenuType[],number, {rejectValue: {error:string}}> //fix type
    ('app/getMenu',
        async (restId,{dispatch,rejectWithValue})=>{
            dispatch(setStatus({status:'loading'}))
            try{
                const res=await pizzaAPI.getMenu(restId)
                return res.data
            } catch (err){
                const error=errorAsString(err)
                return rejectWithValue({error})
            }
        }
    )