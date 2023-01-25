import {MenuType, RestaurantsType} from "../app/appReducer";

export type SelectOptionType = { label: string, value: string }

export const setSelectFormat=(array:RestaurantsType[] | MenuType[]) =>{
    let result: SelectOptionType[]=[]
    for(let i=0;i<array.length;i++){
        result.push({label: array[i].name, value: array[i].name})
    }
    return result
}