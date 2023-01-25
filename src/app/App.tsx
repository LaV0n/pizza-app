import React, {useEffect, useState} from 'react';
import styles from './App.module.css';
import {useAppDispatch, useAppSelector} from "./store";
import {deleteAllMenu, getMenuTC, getRestaurantsTC, MenuType, RestaurantsType} from "./appReducer";
import Select from "react-select";

type SelectOptionType = { label: string, value: string }

function App() {

    const restaurants = useAppSelector(state => state.app.restaurants)
    const menu = useAppSelector(state => state.app.menu)
    const dispatch = useAppDispatch()
    const [currentRestaurant, setCurrentRestaurant] = useState<SelectOptionType | null>()
    let currentRestaurantId = 0
    const [currentPizza, setCurrentPizza] = useState<SelectOptionType | null>()

    const setSelectFormat=(array:RestaurantsType[] | MenuType[]) =>{
        let result: SelectOptionType[]=[]
        for(let i=0;i<array.length;i++){
            result.push({label: array[i].name, value: array[i].name})
        }
        return result
    }

    let restaurantsFormat= setSelectFormat(restaurants)
    let menuFormat=setSelectFormat(menu)

    const handleSelectionChange = (option: SelectOptionType | null) => {
        if (option) {
            dispatch(deleteAllMenu)
            setCurrentRestaurant(option)
        }
    };
    const handleSelectionChangeMenu = (option: SelectOptionType | null) => {
        if (option) {
            setCurrentPizza(option)
        }
    };

    useEffect(() => {
        dispatch(getRestaurantsTC())
    }, [])


        if (currentRestaurant){
            currentRestaurantId=restaurants.find(r=>r.name===currentRestaurant.label)!.id
        }


        useEffect(()=>{
            dispatch(getMenuTC(currentRestaurantId))
            console.log('check')
        },[currentRestaurant])



    return (
        <div className={styles.App}>
            <div className={styles.container}>
                {menu.map(r =>
                    <div key={r.id}>{r.name}</div>
                )}
                <Select options={restaurantsFormat}
                        onChange={handleSelectionChange}/>
                <Select options={menuFormat}
                        onChange={handleSelectionChangeMenu}/>
                <div>
                    {currentPizza?.label}
                </div>
            </div>
        </div>
    );
}

export default App;
