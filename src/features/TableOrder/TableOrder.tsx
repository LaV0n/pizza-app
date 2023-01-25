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
                <caption>Calculation</caption>
                <thead>
                <tr>
                    <th className={styles.rightAlign}>Restaurant</th>
                    <th className={styles.rightAlign}>Product</th>
                    <th>Cost</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {orderMenu.map(i =>
                    <tr key={i.id}>
                        <td className={styles.rightAlign}>{i.restaurant}</td>
                        <td className={styles.rightAlign}>{i.pizza}</td>
                        {selectedId === i.id
                            ? <td >
                                <input type="number" value={input} size={1}
                                       autoFocus
                                       onChange={(e) => setInput(+e.target.value)}
                                       onBlur={() => closeInputHandler(i.id)}
                                />
                            </td>
                            : <td onDoubleClick={() => setInputHandler(i.id, i.order)}>
                                {i.order}
                            </td>
                        }
                        <td onClick={() => {
                            removeOrderHandler(i.id)
                        }}
                            style={{cursor: 'pointer'}}>
                            Remove
                        </td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={2} style={{textAlign: 'end'}}>Summary:</td>
                    <td style={{textAlign: 'end'}}>{orderMenu.reduce((acc, i) => acc + i.order, 0)} USD</td>

                </tr>
                </tfoot>
            </table>
        </div>
    );
};

