import { Component } from "react";
import Navbar from "../NavbarComponent/Navbar";
import Allbooks from "../AllbooksComponent/Allbooks";
import About from "../AboutComponent/About";

import axios from "axios";
import Cookies from "js-cookie";


import './Home.css';

export class Home extends Component {
    state = { books: [], cart: [], userinput: ''};

    componentDidMount() {
        this.fetchBooks();
    }
    componentDidUpdate() {
        this.fetchCartBooks();
    }

    // Handle search input change //
    handleSearchChange = (event) => {
        this.setState({ userinput: event.target.value });
    }

    
    // Fetch books from API //
    fetchBooks = async () => {
        const url = 'https://api.itbook.store/1.0/new';
        try {
            const response = await fetch(url);
            const data = await response.json();

            // Get cart from DB
            const token = Cookies.get("token");
            const cartRes = await axios.get("https://book-data-e8gp.onrender.com/getbooks", {
                headers: {
                    'x-token': token,
                    "Content-Type": "application/json"
                }
            });
            // console.log(token)

            const cartBooks = cartRes.data.cartdata || [];
            const cartIds = cartBooks.map(book => book.id); // MongoDB book ids

            const modifyBooksData = (data) => {
                return data.map((book) => ({
                    id: book.isbn13,
                    title: book.title,
                    subtitle: book.subtitle,
                    price: book.price,
                    image: book.image,
                    url: book.url,
                    addbutton: !cartIds.includes(book.isbn13) // disable if already in cart
                }));
            };

            this.setState({
                books: modifyBooksData(data.books),
                cart: cartRes.data
            });
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    // Add book to cart and database //
    addCartBook = async (book) => {
        try {
            const token = Cookies.get("token");
            const res = await axios.post("https://book-data-e8gp.onrender.com/addbook", book, {
                headers: {
                    'x-token': token,
                    "Content-Type": "application/json"
                },

            });
            if (res.status === 201) {
                this.setState(prevState => ({
                    books: prevState.books.map(b =>
                        b.id === book.id ? { ...b, addbutton: false } : b
                    )
                }));
            }
        } catch (e) {
            console.log(e);
        }

    }

    // Fetch cart books from database //
    fetchCartBooks = async () => {
        const token = Cookies.get("token");
        try {
            const res = await axios.get("https://book-data-e8gp.onrender.com/getbooks", {
                headers: {
                    'x-token': token,
                    "Content-Type": "application/json"
                },
            });
            this.setState({ cart: res.data });
        } catch (e) {
                console.log(e);
        }
    }

    // Button Chanhe Function Like BUY or ADD Function
    btnChange = async (id) => {
        const url = `https://book-data-e8gp.onrender.com/addbook/${id}`;
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
                // Update books array in state
                this.setState(prevState => ({
                    books: prevState.books.map(book =>
                        book.id === id ? { ...book, addbutton: false } : book
                    )
                }));
            }
        } catch (error) {
            console.error("Error adding book to cart:", error);
        }
    }

    render() {
        const { books, cart } = this.state;
        const cartLength = cart.cartdata ? cart.cartdata.length : 0;

        const filteredBooks = books.filter((book) =>
            book.title.toLowerCase().includes(this.state.userinput.toLowerCase())
        );
        return (
            <>
                <div>
                    <Navbar cartLength={cartLength}
                        handleSearchChange={this.handleSearchChange}
                        userinput={this.state.userinput}
                    />
                    <div className="home-container">
                        {filteredBooks.length === 0 && this.state.userinput !== '' ? (
                            <div className="no-books-container">
                                <h2 className="no-books-message">Books are not avalable</h2>
                                <img className="no-books-image" src="https://static.vecteezy.com/system/resources/previews/006/208/684/non_2x/search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg" alt="No Books" />
                            </div>
                        ) : null}
                        {books.length === 0 ? (
                            <div className="loader-container">
                                <div className="spinner"></div>
                            </div>) : (
                            <ul className="books-div">
                                {filteredBooks.map((book) => (
                                    <Allbooks key={book.id}
                                        bookDetails={book}
                                        addCartBook={() => this.addCartBook(book)}
                                        btnChange={this.btnChange} />
                                ))}
                            </ul>
                        )}
                    </div>
                    <About />
                </div>

            </>
        );
    }
}
