import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

// Basic Format of Mutation
// mutation NAME_OF_MUTATION_HERE($title: String!) { <-- Name of Mutation locally, it requires a string for the title
//  createItem( <-- This is the mutation from the server side
//        title: $title <-- It requires a title so we use our title from above as a variable
//     ) {
//         id <-- We want it to return an id
//     }
// }
const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      image: "",
      largeImage: "",
      price: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  handleChange = e => {
    const { name, type, value } = e.target;

    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();

    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/mwprojects/image/upload/",
      {
        method: "POST",
        body: data
      }
    );

    const file = await res.json();
    console.log("[matt] file", file);

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              // Prevent Default
              e.preventDefault();
              // Call the mutation
              const res = await createItem();
              // Send them to the single item page
              console.log("[matt] res", res);
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <h2>Sell an Item</h2>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an Image"
                  onChange={this.uploadFile}
                  required
                />
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={this.state.price}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={this.state.description}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;

export { CREATE_ITEM_MUTATION };
