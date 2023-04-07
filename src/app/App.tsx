import React, { useEffect, useState } from 'react'
import styles from './App.module.css'
import { useAppDispatch, useAppSelector } from './store'
import { deleteAllMenu, getMenuTC, getRestaurantsTC, setNotice } from './appReducer'
import Select from 'react-select'
import { SelectOptionType, setSelectFormat } from '../utils/selectFormat'
import { TableOrder } from '../features/TableOrder/TableOrder'

function App() {
   const restaurants = useAppSelector(state => state.app.restaurants)
   const menu = useAppSelector(state => state.app.menu)
   const dispatch = useAppDispatch()
   const [currentRestaurant, setCurrentRestaurant] = useState<SelectOptionType | null>()
   let currentRestaurantId = 0
   let currentCost = 0
   const [currentPizza, setCurrentPizza] = useState<SelectOptionType | null>()
   const notice = useAppSelector(state => state.app.notice)

   const restaurantsFormat = setSelectFormat(restaurants)
   const menuFormat = setSelectFormat(menu)

   const handleSelectionChange = (option: SelectOptionType | null) => {
      if (option) {
         dispatch(deleteAllMenu)
         setCurrentRestaurant(option)
      }
   }
   const handleSelectionChangeMenu = (option: SelectOptionType | null) => {
      if (option) {
         setCurrentPizza(option)
      }
   }

   useEffect(() => {
      dispatch(getRestaurantsTC())
   }, [])

   if (currentRestaurant) {
      currentRestaurantId = restaurants.find(r => r.name === currentRestaurant.label)!.id
   }
   if (currentPizza) {
      currentCost = menu.find(m => m.name === currentPizza.label)!.price
   }

   useEffect(() => {
      if (currentRestaurantId !== 0) {
         dispatch(getMenuTC(currentRestaurantId))
      }
   }, [currentRestaurant])

   if (notice) {
      setTimeout(() => {
         dispatch(setNotice({ notice: '' }))
      }, 1000)
   }

   return (
      <div className={styles.App}>
         <div className={styles.container}>
            <h3>Create new entry</h3>
            <Select
               options={restaurantsFormat}
               placeholder="Select restaurant"
               onChange={handleSelectionChange}
            />
            <Select
               options={menuFormat}
               placeholder="Select pizza"
               onChange={handleSelectionChangeMenu}
            />
            <TableOrder
               restaurant={currentRestaurant?.label}
               pizza={currentPizza?.label}
               cost={currentCost}
            />
         </div>
         {notice && <div className={styles.errorMessage}>{notice}</div>}
      </div>
   )
}

export default App
