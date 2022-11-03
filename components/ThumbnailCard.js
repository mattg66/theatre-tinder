export default function ThumbnailCard(props) {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg" key={props.id}>
            <img className="w-full" src={props.preview} alt="Mountain" />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{props.name}</div>
            </div>
            <button type="button" onClick={() => props.delete(props.id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
        </div>
    )
}