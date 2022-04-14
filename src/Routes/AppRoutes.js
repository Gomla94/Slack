import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import { connect } from "react-redux";

import Home from "../components/Home";

const AppRoutes = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            props.currentUser.currentUser ? <Home /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

const mapStateToProps = (state) => {
  return { currentUser: state.user };
};

export default connect(mapStateToProps)(AppRoutes);
