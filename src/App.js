import React from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import UserPage from "./UserPage";
import TodoListPage from "./TodoListPage";


export const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">User Page</Link>
                        </li>
                        <li>
                            <Link to="/todo-list/">Todo List</Link>
                        </li>
                    </ul>
                </nav>

                <Route path="/" exact component={UserPage}/>
                <Route path="/todo-list/" component={TodoListPage}/>
            </div>
        </Router>
    );
}