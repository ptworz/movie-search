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

type MovieCardProps = MovieSearchItem;

const MovieCard: React.FC<MovieCardProps> = ({ Title, Year, Poster }) => (
  <Card body>
    <div className="card-title text-center mb-2">
      MOVIE TITLE: <h5>{Title}</h5>
    </div>

    <div className="card-body text-center mb-2">
      YEAR OF PRODUCTION: <h5>{Year}</h5>
    </div>

    {Poster !== "N/A" && (
      <div className="image-container text-center">
        <img src={Poster} />
      </div>
    )}
  </Card>
);

const App: React.FC = () => {
  const [query, setQuery] = useState("");

  const [apiResponse, setApiResponse] = useState<
    undefined | null | ApiResponse
  >();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      if (query.length === 0) {
        setApiResponse(undefined);
      } else {
        const { data } = await axios.get<ApiResponse>(
          `http://www.omdbapi.com/?s=${query}&apikey=33f3ef2f`
        );

        if (data.Response === "False") {
          throw Error();
        }

        setApiResponse(data);
      }
    } catch (error) {
      setApiResponse(null);
    }
  };

  const errorElement = apiResponse === null && (
    <Row>
      <Col sm={{ size: 6, offset: 3 }}>
        <div className="alert alert-danger" role="alert">
          An error has occured!
        </div>
      </Col>
    </Row>
  );

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
  };

  const movieItems =
    apiResponse &&
    apiResponse.Search.map((movieSearchItem) => (
      <Row className="mb-2">
        <Col sm={{ size: 6, offset: 3 }}>
          <MovieCard {...movieSearchItem} />
        </Col>
      </Row>
    ));

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
            <Form className="d-flex w-100" onSubmit={handleSubmit}>
              <div className="w-100 mb-2">
                <Input type="text" value={query} onChange={handleChange} />
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

      {errorElement}

      {movieItems}
    </Container>
  );
};
export default App;
