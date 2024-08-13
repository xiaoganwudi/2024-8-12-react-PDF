"use client";
import './globals.css';
import Header from './component/Header/index.jsx'
import Main from './component/Main/index.jsx'
import { useState } from "react";

export default function Home() {
  return (
    <div className='app'>
      <Header></Header>
      <Main></Main>
    </div>
  );
}
