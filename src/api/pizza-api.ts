import axios from "axios";

const instance=axios.create({
    baseURL:'https://private-anon-caf9193598-pizzaapp.apiary-mock.com/restaurants/'
})

export const pizzaAPI={
    getRestaurants(){
        return instance.get('')
    },
    getMenu(restaurantId:number){
        return instance.get(`${restaurantId}/menu?category=Pizza`)
    }
}