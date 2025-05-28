import nothingHereYet from "../assets/nothing-here-yet.webp";

const NoData = ({ message }) => {
    return (
        <div className="pb-[35%] lg:pb-[14%] w-full h-full flex flex-col items-center justify-center gap-5" >
            <div className="flex items-center justify-center">
                <img src={ nothingHereYet } alt="No Categories Found" className="max-w-3xs max-h-3xs" />
            </div>
            {
                message ? <h2 className="whitespace-pre flex items-center justify-center font-bold text-2xl text-neutral-400" >{ message }</h2> : <p className="whitespace-pre flex items-center justify-center font-bold text-2xl text-neutral-400" >No  Data</p>
            }
        </div>
    )
}

export default NoData