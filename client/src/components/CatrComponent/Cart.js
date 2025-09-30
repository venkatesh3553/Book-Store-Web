import { Component } from "react"
import Cookies from "js-cookie"

import './Cart.css'
import AllCart from "../AllCartComponent/AllCart";
import Navbar from "../NavbarComponent/Navbar";
import { Link } from "react-router-dom";


class Cart extends Component {
    state = { cartList: [], userinput: '', placeorder: false };

    componentDidMount() {
        this.fetchCartBooks();
    }

    // Fetching Book data Function
    fetchCartBooks = async () => {
        const url = 'https://book-data-e8gp.onrender.com/getbooks';
        try {
            const token = Cookies.get("token");
            const response = await fetch(url, {
                headers: { 'x-token': token }
            });
            const data = await response.json();
            this.setState({ cartList: data.cartdata || [] });
        } catch (error) {
            console.error("Error fetching cart books:", error);
        }
    }

    // Delete Cart Book Function
    deleteCartBook = async (id) => {
        const url = `https://book-data-e8gp.onrender.com/deletebook/${id}`;
        try {
            const token = Cookies.get("token");
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'x-token': token }
            });

            if (response.ok) {
                this.fetchCartBooks();
            } else {
                // toast.error("Failed to remove book");
            }
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    }

    // Change user Search Function
    handleSearchChange = (event) => {
        this.setState({ userinput: event.target.value });
    }

    // Increase BookCount Function 
    increaseBookCount = async (id) => {
        const url = `https://book-data-e8gp.onrender.com/addcount/${id}`;
        try {
            const token = Cookies.get("token");
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token
                }
            });
            console.log(token)
            if (response.ok) {
                // Refresh cart to get updated count
                this.fetchCartBooks();
            } else {
                // toast.error("Failed to increase book count");
            }
            console.log(response)
        } catch (error) {
            console.error("Error increasing book count:", error);
        }
    }

    // Decrease BookCount Function
    decreaseBookCount = async (id) => {
        const url = `https://book-data-e8gp.onrender.com/${id}`;
        try {
            const token = Cookies.get("token");
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token
                }
            });
            if (response.ok) {
                // Refresh cart to get updated count
                this.fetchCartBooks();
            }
            else {
                // toast.error("Failed to decrease book count");
            }
        } catch (error) {
            console.error("Error decreasing book count:", error);
        }

    }

    // Total CartPrice Function
    totalCartPrice = () => {
        const { cartList } = this.state;

        // Sum up all items
        const total = cartList.reduce((sum, book) => {
            const price = Number((book.price || "0").toString().replace('$', '')) || 0;
            const count = Number(book.count) || 1;

            return sum + price * count;
        }, 0);

        return total.toFixed(2);
    }

    render() {
        const { cartList } = this.state;
        const cartLength = cartList.length;

        const filterCartBooks = cartList.filter((book) =>
            book.title.toLowerCase().includes(this.state.userinput.toLowerCase())
        );

        return (
            <>
                <Navbar
                    cartLength={cartLength}
                    handleSearchChange={this.handleSearchChange}
                    userinput={this.state.userinput}
                />

                {this.state.placeorder && (
                    <div className="order-summary">
                        <h2 className="order-head">Order Complate Successfully</h2>
                        <Link to='/' className="order-close-btn" onClick={() => this.setState({ placeorder: false })}>Go to Shoping</Link>
                    </div>
                )}

                {!this.state.placeorder && (
                    <>
                        {cartLength === 0 ? (
                            <div className="no-books-div">
                                <h1 className="no-books-heading">No Books in Cart</h1>
                                <img
                                    className="no-books-image"
                                    src="https://static.vecteezy.com/system/resources/previews/004/964/514/original/young-man-shopping-push-empty-shopping-trolley-free-vector.jpg"
                                    alt="no books"
                                />
                            </div>
                        ) : filterCartBooks.length === 0 ? (
                            <div className="no-books-container">
                                <h2 className="no-books-message">Books are not available</h2>
                                <img
                                    className="no-books-image"
                                    src="https://static.vecteezy.com/system/resources/previews/006/208/684/non_2x/search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                                    alt="No Books"
                                />
                            </div>
                        ) : null}

                        <ul className="cart-ul">
                            {filterCartBooks.map((book) => (
                                <AllCart
                                    cartList={book}
                                    key={book._id}
                                    deleteCartBook={this.deleteCartBook}
                                    increaseBookCount={this.increaseBookCount}
                                    decreaseBookCount={this.decreaseBookCount}
                                />
                            ))}
                        </ul>

                        {cartLength === 0 ?
                            <div className="go-home-container">
                                <Link to='/' className="go-home-btn">Go Home</Link>
                            </div>
                            :
                            <div className="place-order-card">
                                <h1>Grand Total: ₹{this.totalCartPrice()}</h1>
                                <button onClick={() => this.setState({ placeorder: true })}>Place order</button>
                            </div>

                        }
                    </>
                )}
            </>

        )
    }
}

export default Cart;
