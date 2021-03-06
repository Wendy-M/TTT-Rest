import React, { Component, useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import storage from "../../../firebase";

import "./DailyMenu.css";
import { Link } from "react-router-dom";

function UploadMenu() {
  const [imageStorage, setImageStorage] = useState("");
  const [images, setImages] = useState("");
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [dailyMenu, setDailyMenu] = useState({});

  const upload = (e) => {
    if (imageStorage == null) return;
    storage
      .ref(`/DailyMenu/${imageStorage.name}`)
      .put(imageStorage)
      .on("state_changed", alert("Votre menu a bien été enregistré"), alert);
  };

  const getDailyMenu = () => {
    const headers = new Headers({
      Authorization: "bearer " + localStorage.getItem("token"),
    });

    const options = {
      method: "GET",
      headers: headers,
    };

    fetch("https://back-end.osc-fr1.scalingo.io/restaurateur/menu", options)
      .then((response) => {
        return response.json();
      })
      .then(
        (data) => {
          setImages(data.menu.dailyMenu.picture);
          setLabel(data.menu.dailyMenu.label);
          setDailyMenu(data.menu);
          console.log("image", data.menu.dailyMenu.picture);
          console.log("image", images);
        },
        (err) => {
          console.log(err);
        }
      );
  };
  const deleteMenu = (e) => {
    window.confirm("Etes-vous sur de vouloir supprimer le menu du jour ?");
    e.preventDefault();
    const data = {
      dailyMenu: dailyMenu,
    };
    const headers = new Headers({
      Authorization: "bearer " + localStorage.getItem("token"),
    });

    const options = {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: headers,
    };

    fetch(
      "https://back-end.osc-fr1.scalingo.io/restaurateur/dailymenu/delete",
      options
    )
      .then((response) => {
        return response.json();
      })
      .then(
        (responseData) => {
          setMessage(responseData.message);
          getDailyMenu();
        },
        (err) => {
          console.log(err);
        }
      );
  };

  useEffect(() => {
    getDailyMenu();
  }, []);

  return (
    <Container className="dailyMenuContain">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Link className="linkButton" to="/menus">
            <h1 className="menujour">Menu du Jour</h1>
          </Link>
        </Col>
        <Col className="colMenu" md={12}>
          <form
            className="formMenu"
            onSubmit={(e) => {
              e.preventDefault();

              const data = new FormData(e.target);

              const headers = new Headers({
                Authorization: "bearer " + localStorage.getItem("token"),
              });

              const options = {
                method: "PUT",
                body: data,
                headers: headers,
              };

              fetch(
                "https://back-end.osc-fr1.scalingo.io/restaurateur/dailymenu/add",
                options
              )
                .then((response) => {
                  return response.json();
                })
                .then(
                  (responseData) => {
                    setMessage(responseData.message);

                    const headers = new Headers({
                      Authorization: "bearer " + localStorage.getItem("token"),
                    });

                    const options = {
                      method: "GET",
                      headers: headers,
                    };

                    fetch(
                      "https://back-end.osc-fr1.scalingo.io/restaurateur/menu",
                      options
                    )
                      .then((response) => {
                        return response.json();
                      })
                      .then(
                        (data) => {
                          setImageStorage(data.menu.dailyMenu.picture);
                          setLabel(data.menu.dailyMenu.label);
                          setDailyMenu(data.menu);
                        },
                        (err) => {
                          console.log(err);
                        }
                      );
                    getDailyMenu();
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            }}
          >
            <input
              className="button"
              type="file"
              name="file"
              onChange={(e) => {
                setImageStorage(e.target.files[0]);
              }}
            />
            <button className="bouton" type="submit" onClick={upload}>
              Valider
            </button>
          </form>

          <Card.Body className="cardsupp">
            <p>{label}</p>

            <Card.Img
              variant="top"
              src={"https://back-end.osc-fr1.scalingo.io/" + images}
              className="dailyMenu"
              alt="Menu du Jour1231312"
            />

            <button
              className="boutonSupprimer"
              type="submit"
              onClick={() => deleteMenu()}
            >
              Supprimer le menu
            </button>
          </Card.Body>
        </Col>
      </Row>
    </Container>
  );
}

class DailyMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }


  
  componentDidMount() {
 
  }

  render() {
    return <UploadMenu />;
  }
}

export default DailyMenu;
