import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  Button,
  Form,
  Alert,
  Modal,
  Navbar,
  Nav,
  NavDropdown,
  FormControl
} from "react-bootstrap";
import LogIn from "./components/User/LogIn.js";
import SignUp from "./components/User/signup";

import signOutService from "./services/signOutServices";

import Home from "./components/home";

import AddProduct from "./components/Product/addProduct";
import AddCategory from "./components/category/AddCategory";
import NavbarCategory from "./components/category/navBarCategory";
import checkToken from "./services/checkToken";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "axios";
import Product from "./components/Product/Product.js";
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userInfo: {
        id: null,
        name: null
      },
      showModalSignUp: false,
      showModalLogin: false
    };
    this.changeUserName = this.changeUserName.bind(this);
  }

  hundleSignOut() {
    const token = localStorage.getItem("token");
    signOutService
      .signOut(this.state.userInfo.name)
      .then(res => {
        if (res.data.deleted === "success") {
          localStorage.removeItem("token");
          this.setState({
            userInfo: {
              id: null,
              name: null
            }
          });
        } else {
          console.log("not deleted");
        }
      })
      .catch(err => console.log(err));
  }

  changeUserName(id, name) {
    //updates the page with the user
    this.setState({
      userInfo: {
        id,
        name
      }
    });
  }

  componentDidMount() {
    //checks if the token is valid
    checkToken.checkAuth(window.localStorage.getItem("token")).then(res => {
      if (res) {
        this.changeUserName(res.data._id, res.data.name);
      }
    });
  }

  handleShow(target) {
    console.log(target);
    this.setState({
      [`showModal${target}`]: !this.state[`showModal${target}`]
    });
  }

  render() {
    return (
      <div>
        <Router>
          <SignUp
            showModal={this.state.showModalSignUp}
            onHide={() => {
              this.handleShow("SignUp");
            }}
            changeUserName={this.changeUserName}
          />
          <LogIn
            showModal={this.state.showModalLogin}
            onHide={() => {
              this.handleShow("Login");
            }}
            changeUserName={this.changeUserName}
          />
          <Switch>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand>RBK Auction</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                {!this.state.userInfo.name ? (
                  <Nav className="mr-auto">
                    <Nav.Link
                      onClick={() => {
                        this.handleShow("SignUp");
                      }}
                    >
                      SignUp
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => {
                        this.handleShow("Login");
                      }}
                    >
                      Login
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => {
                        this.handleShow("Login");
                      }}
                    >
                      Home
                    </Nav.Link>
                  </Nav>
                ) : (
                  <Nav>
                    <Nav.Link
                      onClick={() => {
                        this.hundleSignOut();
                      }}
                    >
                      SignOut
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => {
                        this.handleShow("SignUp");
                      }}
                    >
                      {this.state.userInfo.name}
                    </Nav.Link>
                  </Nav>
                )}
                <Form inline>
                  <FormControl
                    type="text"
                    placeholder="Search"
                    className="mr-sm-2"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Navbar.Collapse>
            </Navbar>
          </Switch>
          <NavbarCategory />
        </Router>

        <Router>
          <Route path="/" exact component={Home} />
          <Route
            path="/product"
            component={() => <Product userInfo={this.state.userInfo} />}
          />
        </Router>
      </div>
    );
  }
}

{
  /*
  
  
    <Route path='/product'
            component={Product}
            userInfo={this.state.userInfo} />
            
            
              <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                {!this.state.userName ? (
                  <Route exact path="/">
                    <li>
                      <Button onClick={() => { this.hundleShowLogin() }} >Login</Button>
                      <Link to="/Login">LogIn</Link>
                    </li>
                    <li>
                      <Button onClick={() => { this.hundleShowSignUp() }} >signUp</Button>
                      <Link to="/SignUp">signUp</Link>
                    </li>
                    <div>not logged in</div>
                  </Route>
                ) : (
                    <div> {this.state.userName} </div>
                  )}
              </ul>
            </nav>


             <Route path="/SignUp" exact> <SignUp changeUserName={this.changeUserName} />  </Route>
            <Route path="/Login" exact> <LogIn changeUserName={this.changeUserName} />  </Route> 

          </div> */
}
export default App;
