import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import CustomDropzone from '../../components/CustomDropzone'

export default function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <CustomDropzone/>
  )
}