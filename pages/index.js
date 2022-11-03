import axios from 'axios';
import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import TinderStack from '../components/TinderStack';
import NoSSR from '../components/NoSSR'
let socket;

export default function Home() {
  const [input, setInput] = useState('')
  const [images, setImages] = useState([])

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
  useEffect(() => {
    axios.get('/api/image/get').then((response) => {
      setImages(response.data.images)
    }).catch((error) => {

    })
  }, [])
  function onChangeHandler(e) {
    setInput(e.currentTarget.value)
    socket.emit('input-change', e.currentTarget.value)
  }
  const onSwipe = (direction) => {
    console.log('You swiped: ' + direction)
  }
  
  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen')
  }
  return (
    <>
     
      {images !== [] ? <TinderStack images={images}/> : null}
      
    </>
  )
}