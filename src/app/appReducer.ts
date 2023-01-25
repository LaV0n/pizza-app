import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {pizzaAPI} from "../api/pizza-api";
import {errorAsString} from "../utils/errorAsString";
import {AxiosResponse} from "axios";

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

type OrderMenuType = {
    id: number
    restaurant: string | undefined
    pizza: string | null | undefined
    order: number
}

type InitialStateType = {
    restaurants: RestaurantsType[]
    menu: MenuType[]
    status: StatusType
    notice: string
    orderMenu: OrderMenuType[]
}

const initialState: InitialStateType = {
    restaurants: [],
    menu: [],
    status: "success",
    notice: '',
    orderMenu: []
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setStatus(state, action: PayloadAction<{ status: StatusType }>) {
            state.status = action.payload.status
        },
        deleteAllMenu(state) {
            state.menu = []
        },
        addNewItem(state, action: PayloadAction<{ item: OrderMenuType }>) {
            state.orderMenu.push(action.payload.item)
        },
        deleteItem(state, action: PayloadAction<{ itemId: number }>) {
            state.orderMenu = state.orderMenu.filter(i => i.id !== action.payload.itemId)
        },
        setMenu(state, action: PayloadAction<{ menu: OrderMenuType[] }>) {
            state.orderMenu = action.payload.menu
        },
        changeItemOrder(state, action: PayloadAction<{ itemId: number, price: number }>) {
            state.orderMenu.find(i => i.id === action.payload.itemId)!.order = action.payload.price
        }
    },
    extraReducers: builder => {
        builder.addCase(getRestaurantsTC.fulfilled, (state, action) => {
            state.restaurants = action.payload
            state.status = 'success'
        })
        builder.addCase(getRestaurantsTC.rejected, (state, action) => {
            state.notice = action.payload ? action.payload.error : 'unknown error, please try again later'
            state.status = 'error'
        })
        builder.addCase(getMenuTC.fulfilled, (state, action) => {
            state.menu = action.payload
            state.status = 'success'
        })
        builder.addCase(getMenuTC.rejected, (state, action) => {
            state.notice = action.payload ? action.payload.error : 'unknown error, please try again later'
            state.status = 'error'
        })
    }
})

export const appReducer = slice.reducer
export const {setStatus, deleteAllMenu, addNewItem, deleteItem, setMenu, changeItemOrder} = slice.actions

export const getRestaurantsTC = createAsyncThunk<RestaurantsType[], undefined, { rejectValue: { error: string } }> //fix type
    ('app/getRestaurants',
        async (arg, {dispatch, rejectWithValue}) => {
            dispatch(setStatus({status: 'loading'}))
            try {
                const res = await pizzaAPI.getRestaurants()
                return res.data
            } catch (err) {
                const error = errorAsString(err)
                return rejectWithValue({error})
            }
        }
    )

export const getMenuTC = createAsyncThunk<MenuType[], number, { rejectValue: { error: string } }> //fix type
    ('app/getMenu',
        async (restId, {dispatch, rejectWithValue}) => {
            dispatch(setStatus({status: 'loading'}))
            try {
                const res:AxiosResponse<MenuType[]> = await pizzaAPI.getMenu(restId)
                return res.data.filter(m=>m.category==='Pizza')
            } catch (err) {
                const error = errorAsString(err)
                return rejectWithValue({error})
            }
        }
    )