import React, { useState } from "react";
import "./App.css";
import { Button, Container, Row, Col, Input, Form, Card } from "reactstrap";
import axios from "axios";

type MovieSearchItem = {
  Title: string;
  // Integer as string
  Year: string;
  imdbID: string;
  Type: "movie";
  // URL
  Poster: string;
};

type ApiResponse = {
  Search: MovieSearchItem[];
  // Integer as string
  totalResults: string;
  Response: "True" | "False";
};

const App: React.FC = () => {
  const [query, setQuery] = useState("");

  const [apiResponse, setApiResponse] = useState<
    undefined | null | ApiResponse
  >();

  return (
    <Container>
      <Row>
        <Col sm={{ size: 6, offset: 3 }}>
          <header className="text-center mt-2 ">MOVIE SEARCH</header>
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 6, offset: 3 }}>
          <div className="d-flex my-2">
            <Form
              className="d-flex w-100"
              onSubmit={async (e) => {
                e.preventDefault();

                try {
                  if (query.length === 0) {
                    setApiResponse(undefined);
                  } else {
                    const { data } = await axios.get<ApiResponse>(
                      `http://www.omdbapi.com/?s=${query}&apikey=33f3ef2f`
                    );

                    setApiResponse(data);
                  }
                } catch (error) {
                  setApiResponse(null);
                }
              }}
            >
              <div className="w-100 mb-2">
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                />
              </div>
              <div className="flex-shrink-1 ms-1 mb-2">
                <Button type="submit" color="success">
                  SEARCH
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>

      {apiResponse === null && (
        <Row>
          <Col sm={{ size: 6, offset: 3 }}>
            <div className="alert alert-danger" role="alert">
              An error has occured!
            </div>
          </Col>
        </Row>
      )}

      {apiResponse &&
        apiResponse.Search.map((movieSearchItem) => (
          <Row className="mb-2">
            <Col sm={{ size: 6, offset: 3 }}>
              <Card body>
                <Row>
                  <Col>
                    <div className="card-title text-center mb-2">
                      MOVIE TITLE: <h5>{movieSearchItem.Title}</h5>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="card-body text-center mb-2">
                      YEAR OF PRODUCTION: <h5>{movieSearchItem.Year}</h5>
                    </div>
                  </Col>
                </Row>

                {movieSearchItem.Poster !== "N/A" && (
                  <Row>
                    <Col>
                      <div className="image-container text-center">
                        <img src={movieSearchItem.Poster} />
                      </div>
                    </Col>
                  </Row>
                )}
              </Card>
            </Col>
          </Row>
        ))}
    </Container>
  );
};
export default App;
