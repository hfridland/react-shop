import React, { useState, useEffect} from "react"
import { API_KEY, API_URL } from '../config'
import { Preloader } from "./Preloader"
import { GoodsList } from "./GoodsList"
import { Cart } from "./Cart"
import { BasketList } from "./BasketList"
import { Alert } from "./Alert"

function Shop() {
    const [goods, setGoods] = useState([])
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState([])
    const [isBacketShow, setBacketShow] = useState(false)
    const [alertName, setAlertName] = useState('')

    useEffect(function getGoods() {
        fetch(API_URL, {
            headers: {
                Authorization: API_KEY
            }
        })
            .then(response => response.json())
            .then(data => {
                data.featured && setGoods(data.featured)
                setLoading(false)
            })
    }, [])

    const addToBasket = item => {
        const itemIndex = order.findIndex(orderItem => orderItem.id === item.id)
        if (itemIndex < 0) {
            const newItem = { ...item, quantity: 1}
            setOrder([...order, newItem])
        } else {
            order[itemIndex].quantity++
            setOrder([...order])
        }
        setAlertName(item.name)
    }

    const handleBasketShow = () => {
        setBacketShow(!isBacketShow)
    }

    const removeFromBasket = itemId => {
        const newOrder = order.filter(el => el.id !== itemId)
        setOrder(newOrder)
    }

    const incQuantity = (itemId) => {
        const item = order.find(el => el.id === itemId)
        item.quantity++
        setOrder([...order])
    };
    const decQuantity = (itemId) => {
        let newOrder = [...order]
        const item = newOrder.find(el => el.id === itemId)
        item.quantity--
        if (item.quantity < 0) {
            item.quantity = 0
        }
        // if (item.quantity === 0) {
        //     newOrder = newOrder.filter(el => el.id !== itemId)
        // }
        setOrder(newOrder)
    };

    const closeAlert = () => {
        setAlertName('')
    }


    return (
        <main className="container content">
            <Cart quantity={order.length} handleBasketShow={handleBasketShow} />
            {loading ? <Preloader/> : <GoodsList goods={goods} addToBasket={addToBasket} />}
            { isBacketShow && <BasketList order={order} handleBasketShow={handleBasketShow} removeFromBasket={removeFromBasket} 
                incQuantity={incQuantity} decQuantity={decQuantity} />}
            {
                alertName && <Alert name={alertName} closeAlert={closeAlert} />
            }
        </main>
    )
}

export { Shop }