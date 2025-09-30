import './AllCart.css';
const AllCart = (props) => {
    const { cartList, deleteCartBook, increaseBookCount, decreaseBookCount } = props;
    const { _id, title, subtitle, price, image, count } = cartList;
    // id is mongoDB add cart book Id

    const priceNum = parseFloat(price.replace('$', ''));
    return (
        <li className="cart-li">
            <img className="cart-book-image" src={image} alt={title} />
            <div className="cart-book-details">
                <h1 className="cart-book-title">{title}</h1>
                <p className="cart-book-subtitle">{subtitle}</p>
                <p className="cart-book-price">{price}</p>
                <button className="remove-cart-btn" onClick={() => deleteCartBook(_id)}>Romove</button>
                <div className="cart-count-container">
                    <button className="count-btn-minus" onClick={() => decreaseBookCount(_id)}>-</button>
                    <span className="count-number">{count || 1}</span>
                    <button className="count-btn-plus" onClick={() => increaseBookCount(_id)}>+</button>
                </div>
                <p className="cart-totla-book-price"><span className='book-total-span'>Total Book Proce:- </span>${priceNum * count}</p>
            </div>

        </li>
    )
}
export default AllCart;