import './Allbooks.css';
const Allbooks = (props) => {
    const { bookDetails, addCartBook  } = props;
    const {  title, subtitle, price, image , addbutton} = bookDetails;
    return ( 
        <li className="book-card">
            <img src={image} alt={title} className="home-book-img" />
            <h3 className="home-book-title">{title}</h3>
            <p className="home-book-sub">{subtitle}</p>
            <p className="home-book-price"> <strong>Price:</strong> {price}</p>
            {addbutton ? (
                <button className="buy-button" onClick={() => addCartBook(bookDetails)}>
                    Buy Now
                </button>
            ) : (
                <button className="added-button" disabled>
                    Added
                </button>
            )}
        </li>
     );
}   
export default Allbooks;