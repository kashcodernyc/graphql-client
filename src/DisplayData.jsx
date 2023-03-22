import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";

const QUERY_ALL_USERS = gql`
    query getAllUsers {
        users {
            id
            name
            age
            username
        }
    }
`

const QUERY_ALL_MOVIES = gql`
    query getAllMovies{
        movies{
            id
            name
            yearReleased
            isInTheaters
        }
    }
`

const QUERY_MOVIE_NAME = gql`
    query Movie($name: String!){
        movie(name: $name) {
        name
        yearReleased
    }
}
`

const CREATE_USER_MUTATION = gql`
    input CreateUserInput {
        name: String!
        username: String!
        age: Int!
        nationality: Nationality = CANADA
    }
    mutation createUser($input: CreateUserInput!) {
        createUser(input: $inpur) {
        name
        username
        age
        nationality
    }
}
`

function DisplayData() {
    const [inputValue, setInputValue] = useState("");
    const [userInputName, setUserInputName] = useState("");
    const [userInputUsername, setUserInputUsername] = useState("");
    const [userInputAge, setUserInputAge] = useState(0);
    const [userInputNationality, setUserInputNationality] = useState("");

    const { data, loading, error, refetch } = useQuery(QUERY_ALL_USERS);
    const { data: moviedata } = useQuery(QUERY_ALL_MOVIES);

    const [fetchMovie, { data: movieSearchData, error: movieSearchError }] = useLazyQuery(QUERY_MOVIE_NAME)

    const [createUser] = useMutation(CREATE_USER_MUTATION)


    if (loading) {
        return <h1>Loading...</h1>
    }
    if (error) {
        console.error(error);
    }
    if (movieSearchError) {
        console.error(movieSearchError);
    }

    return (
        <div>
            <div>
                <input type="text" placeholder="full name" onChange={(e) => setUserInputName(e.target.value)} />
                <input type="text" placeholder="username" onChange={(e) => setUserInputUsername(e.target.value)} />
                <input type="number" placeholder="age" onChange={(e) => setUserInputAge(e.target.value)} />
                <input type="text" placeholder="nationality" onChange={(e) => setUserInputNationality(e.target.value.toUpperCase())} />
                <button onClick={() => {
                    createUser({
                        variables: {
                            input: { userInputName, userInputUsername, userInputAge: Number(userInputAge), userInputNationality }
                        }
                    })
                    refetch();
                }}>Create User</button>

            </div>
            {data && data.users.map((user) => {
                return (
                    <div>
                        <h1>Name: {user.name}</h1>
                        <h1>Username: {user.username}</h1>
                        <h1>Age: {user.age}</h1>
                    </div>
                )
            })}
            {moviedata && moviedata.movies.map((movie) => {
                return (
                    <div>
                        <h1>Movie: {movie.name}</h1>
                    </div>
                )
            })}
            <div>
                <input type="text" placeholder="Enter Movie" onChange={(e) => setInputValue(e.target.value)} />
                <button onClick={() => {
                    fetchMovie({
                        variables: {
                            name: inputValue,
                        }
                    })
                }}>Fetch Data</button>
                <div>
                    {movieSearchData &&
                        <div>
                            <h1>Movie Name: {movieSearchData.movie.name}</h1>
                            <h1>Year Released {movieSearchData.movie.yearReleased}</h1>
                        </div>
                    }
                    {movieSearchError && <h1>There was an error fetching the data</h1>}
                </div>
            </div>


        </div>
    )
}

export default DisplayData;