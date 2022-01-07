import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import jwt, { decode } from "jsonwebtoken";
import Course from "../components/Course/Course";
import MainLayout from "../components/Layouts/MainLayout";
import Login from "../components/Login/Login";
import Register from "./../components/Register/Register";
import Archive from "./../components/Course/Archive";
import SingleCourse from "./../components/Course/SingleCourse";
import UserProfile from "./../components/Profile/UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { paginate } from "./../utils/paginate";
import { addUser, clearUser } from "./../actions/user";
import { decodeToken } from "../utils/decodeToken";
import Logout from "./../components/Login/Logout";
const Toplearn = () => {
  const courses = useSelector((state) => state.courses);
  const dispatch = useDispatch();
  const indexCourses = paginate(courses, 1, 8);

  const checkToken = () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeToken(token);
      const dateNow = Date.now() / 1000;

      if (decodedToken.payload.exp < dateNow) {
        localStorage.removeItem("token");
        dispatch(clearUser());
      } else dispatch(addUser(decodedToken.payload.user));
    } else {
    }
  };

  useEffect(() => {
    checkToken();
  }, []);
  return (
    <MainLayout>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/register" component={Register} />
        <Route path="/archive" component={Archive} />
        <Route path="/course/:id" component={SingleCourse} />
        <Route path="/user-profile" component={UserProfile} />
        <Route
          path="/"
          exact
          render={() => <Course courses={indexCourses} />}
        />
      </Switch>
    </MainLayout>
  );
};

export default Toplearn;
