import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Jumbotron from "react-bootstrap/Jumbotron";
import "./BestBooks.css";
import { withAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/Button";
import NewBookModel from "./NewBookModel";
import Updatemodel from "./Updatemodel";


import FavBook from "./FavBook";
const axios = require("axios");

class BestBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favBook: [],
      show: false,
      id : '',
      showModel: false,
      showUpdate:false,
      email: "",
    };
  }
  updateBook=async (e,id)=>{
    e.preventDefault(); 

    let updateInfo = {
      email: this.state.email,
    }
    if(e.target.title.value)updateInfo['title']=e.target.title.value;
    if(e.target.description.value)updateInfo['description']=e.target.description.value;
    if(e.target.status.value)updateInfo['status']=e.target.status.value;

 
    let udateData = await axios.put(
      `${process.env.REACT_APP_API_SERVER_LINK}/updatebook/${this.state.id}`,updateInfo);
    this.setState({
      favBook: udateData.data,

     })

  }
  deletebook = async (id) => {
   
    let removeBook = await axios.delete(
      `${process.env.REACT_APP_API_SERVER_LINK}/deletebook/${id}?email=${this.state.favBook[0].email}`
    );
 
     this.setState({
      favBook: removeBook.data,

     })
  };
  showModel = () => {
    if (this.state.showModel === false) {
      this.setState({
        showModel: true,
      });
    } else {
      this.setState({
        showModel: false,
      });
    }
  };
  showModelUpdate = (id) => {
   
    if (this.state.showUpdate === false) {
      this.setState({
        showUpdate: true,
      id: id

      });
    } else {
      this.setState({
        showUpdate: false,
      });
    }
  };
  addNewBook = async (e) => {
    e.preventDefault();
    // const { user } = this.props.auth0;
    // let userEmail = user.email;
    console.log("dddddddddd", e.target.title.value);
    let newBookInfo = {
      email: this.state.email,
      title: e.target.title.value,
      description: e.target.description.value,
      status: e.target.status.value,
    };
    console.log(e.target.title.value);
    console.log("dddddddddd");

    //  this.setState({
    //   newBook : newBookInfo,
    // })

    let postNewBook = await axios.post(
      `${process.env.REACT_APP_API_SERVER_LINK}/addbook`,
      newBookInfo
    );
    await this.setState({
      favBook: postNewBook.data,
    });
    console.log(postNewBook.data);
  };
  
  componentDidMount = async () => {
    const { user } = this.props.auth0;
    console.log(this.props.auth0);
    if (user !== undefined) {
      let userEmail = user.email;
      this.setState({
        email: userEmail,
      });
      console.log("email", userEmail);

      let dataOfFavBook = await axios.get(
        `${process.env.REACT_APP_API_SERVER_LINK}/book?email=${userEmail}`
      );

      // console.log("book", dataOfFavBook);
      this.setState({
        favBook: dataOfFavBook.data,
        show: true,
      });

      console.log("lllllll", this.state.favBook);
      console.log(this.state.favBook);
    }

  };

  render() {
    return (
      <div>
        <>
          <Jumbotron>
            <h1>My Favorite favBook</h1>
            <p>This is a collection of my favorite favBook</p>
          </Jumbotron>
        </>
        <>
          <br />
          <br />
          {this.state.show && (
            <Button variant="primary" onClick={this.showModel} type="click">
              Add Book
            </Button>
          )}
          <br />
          <br />
        </>
        {this.state.showModel && (
          <>
            <NewBookModel
              showModel={this.showModel}
              addNewBook={this.addNewBook}
            />
          </>
        )}
        {this.state.showUpdate && (
          <>
            <Updatemodel
              showModelUpdate={this.showModelUpdate}
              updateBook={this.updateBook}
            />
          </>
        )}

        {this.state.show && (
          <>
            {this.state.favBook.map((element, idx) => {
              return (
                <FavBook
                idx={idx}
                  deletebook={this.deletebook}
                  showModelUpdate={this.showModelUpdate}
                  _id={element._id}
                  img={element.img}
                  title={element.title}
                  description={element.description}
                  status={element.status}
                />
              );
            })}
          </>
        )}
      </div>
    );
  }
}

export default withAuth0(BestBooks);

