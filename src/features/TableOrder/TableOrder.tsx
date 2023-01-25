import React, {useEffect, useState} from 'react';
import styles from './TableOrder.module.css'
import {useAppDispatch, useAppSelector} from "../../app/store";
import {addNewItem, changeItemOrder, deleteItem, setMenu} from "../../app/appReducer";

type TableOrderType = {
    restaurant: string | undefined
    pizza: string | null | undefined
    cost: number
}

export const TableOrder = ({restaurant, pizza, cost}: TableOrderType) => {

    let orderMenu = useAppSelector(state => state.app.orderMenu)
    const dispatch = useAppDispatch()
    const [selectedId, setSelectedId] = useState<number>()
    const [input, setInput] = useState<number>(0)

    const addOrderHandler = () => {
        let item = {
            id: new Date().getTime(),
            restaurant,
            pizza,
            order: cost
        }
        dispatch(addNewItem({item}))
    }
    const removeOrderHandler = (itemId: number) => {
        dispatch(deleteItem({itemId}))
    }

    const setInputHandler = (itemId: number, order: number) => {
        setSelectedId(itemId)
        setInput(order)
    }

    const closeInputHandler = (itemId: number) => {
        dispatch(changeItemOrder({itemId, price: input}))
        setSelectedId(0)
    }

    useEffect(() => {
        let myOrder = localStorage.getItem('myOrder')
        if (myOrder) {
            dispatch(setMenu({menu: JSON.parse((myOrder))}))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('myOrder', JSON.stringify(orderMenu))
    }, [orderMenu])

    return (
        <div className={styles.container}>
            <button disabled={!pizza} onClick={addOrderHandler}>
                Add to table
            </button>
            <table>
                <tr>
                    <th>Restaurant</th>
                    <th>Product</th>
                    <th>Cost</th>
                    <th>Action</th>
                </tr>
                {orderMenu.map(i =>
                    <tr key={i.id}>
                        <td>{i.restaurant}</td>
                        <td>{i.pizza}</td>
                        {selectedId === i.id
                            ? <input type="number" value={input}
                                     onChange={(e) => setInput(+e.target.value)}
                                     onBlur={() => closeInputHandler(i.id)}/>
                            : <td onDoubleClick={() => setInputHandler(i.id, i.order)}>
                                {i.order}
                            </td>
                        }
                        <td onClick={() => {
                            removeOrderHandler(i.id)
                        }}>Remove
                        </td>
                    </tr>
                )}
                <tr>
                    <td>Summary:</td>
                    <td>{orderMenu.reduce((acc, i) => acc + i.order, 0)}</td>
                    <td></td>
                </tr>
            </table>
        </div>
    );
};

