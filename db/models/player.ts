import mongoose from "mongoose";

interface Player {
  firstName: string;
  age: number;
  height: number;
  active: boolean;
  favoriteBooks?: String[];
}
