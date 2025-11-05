import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { loginApi, signupApi, logoutApi } from "../api/auth.api";
import { setAuth, clearAuth } from "../slices/auth.slice";
import { setAccessTokenHeader } from "../../lib/apiClient";

const mapRole = (roles: Array<"admin" | "user">): "admin" | "user" => {
  return roles.includes("admin") ? "admin" : "user";
}

export const loginUser = createAsyncThunk<void, { email: string; password: string }>(
  "auth/login",
  async ({ email, password }, { dispatch }) => {
    try {
      const { user, accessToken } = await loginApi(email, password);
      const mappedUser = { id: user.id, name: user.fullName, email: user.email, role: mapRole(user.role) };
      dispatch(setAuth({ user: mappedUser, accessToken }));
      setAccessTokenHeader(accessToken);
    } catch {
      toast.error("Login failed. Please check your credentials.");
      throw new Error("login failed");
    }
  }
);

export const signupUser = createAsyncThunk<void, { name: string; email: string; password: string }>(
  "auth/register",
  async ({ name, email, password }, { dispatch }) => {
    try {
      const { user, accessToken } = await signupApi(name, email, password);
      const mappedUser = { id: user.id, name: user.fullName, email: user.email, role: mapRole(user.role) };
      dispatch(setAuth({ user: mappedUser, accessToken }));
      setAccessTokenHeader(accessToken);
    } catch {
      toast.error("Signup failed. Try another email.");
      throw new Error("signup failed");
    }
  }
);

export const logoutUser = createAsyncThunk<void>(
  "auth/logout",
  async (_, { dispatch }) => {
    await logoutApi();
    dispatch(clearAuth());
    setAccessTokenHeader(null);
    localStorage.removeItem("auth");
  }
);
