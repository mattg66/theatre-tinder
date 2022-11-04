import axios from 'axios';
import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import TinderStack from '../components/TinderStack';
import NoSSR from '../components/NoSSR'
import { socket } from '../utils/socket';

export default function Home() {

  const [images, setImages] = useState([])
  const [refresh, setRefresh] = useState(false)
  useEffect(() => {
    socket.on("IMAGES-UPDATED", () => updateImages());
  }, []);

  useEffect(() => {
    updateImages()
  }, [])

  function updateImages() {
    console.log("updated")
    socket.emit('GET-STATUS')
    socket.on('STATUS', (status) => {
      axios.get('/api/image/get').then((response) => {
        if (images === []) {
          setImages(response.data.images)
        } else {
          setImages(response.data.images)
        }
      }).catch((error) => {

      })
    })

  }

  return (
    <>
      {images.length > 0 && <TinderStack images={images} />}
    </>
  )
}