import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
let socket;

export default function Home() {
  const [input, setInput] = useState('')


  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', (msg) => {
      setInput(msg)
    })
  }

  useEffect(() => {
    socketInitializer()
  }, [])

  function onChangeHandler(e) {
    setInput(e.currentTarget.value)
    socket.emit('input-change', e.currentTarget.value)
  }

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  )
}