import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ThumbnailCard from '../../components/ThumbnailCard';
import axios from 'axios';

export default function MyDropzone() {
    const [files, setFiles] = useState([]);
    let tempFiles = files.slice(-1)[0]
    let index = 0;
    if (tempFiles !== undefined) {
        index = tempFiles.id + 1
    }

    function DeleteFile(id) {
        id = parseInt(id)
        console.log(id)
        setFiles(files => files.filter(file => file.id !== id))
    }

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg', '.jpeg'],
        },

        onDrop: acceptedFiles => {
            setFiles(files => files.concat(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }, { id: index++ }))));
            for (let i = tempFiles + 1; i < files.length; i++) {
                URL.revokeObjectURL(files[i].preview)
            }
        }
    });

    function upload() {
        if (files.length === 0) {
            alert("No Files Uploaded")
        } else {
            let fd = new FormData()
            files.map((file) => {
                fd.append(file.id, file);
            });
            axios.post('/api/image/upload', fd)
                .then(function (response) {
                    if (response.data.message === 'OK') {

                    } else {
                        alert("SPEAK TO TECHBOX")
                    }
                }).catch(function (error) {
                    alert("SPEAK TO TECHBOX")
                })
        }
    }

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div className="max-w-xl">
                    <label
                        className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="font-medium text-gray-600">
                                Drop files to Attach, or
                                <span className="text-blue-600 underline"> browse</span>
                            </span>
                        </span>
                    </label>
                </div>
            </div>
            <aside>
                <h4>Files</h4>
                {files.map(file => (
                    <ThumbnailCard preview={file.preview} name={file.path} key={file.id} id={file.id} delete={DeleteFile} />
                ))}
            </aside>
            <button type="button" onClick={() => upload()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Upload Images</button>
        </section>
    )
}