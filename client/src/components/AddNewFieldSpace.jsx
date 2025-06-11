import { useState } from "react"
import { IoClose } from "react-icons/io5"

const AddNewFieldSpace = ({ submit, close }) => {
    const [ data, setData ] = useState({
        name : ""
    })

    const handleChange = (e) => {
        const { name, value } = e?.target
        setData(prev => {
            return {
                ...prev,
                [ name ] : value
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        submit(data)
    }

    return (
        <section className="p-4 fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-200">
            <div className="p-4 pb-6 sm:px-8 bg-slate-200 w-lg rounded">
                <div className="flex items-center">
                    <IoClose onClick={ close } size={ 25 } className="ml-auto text-neutral-600 cursor-pointer" />
                </div>
                <form onSubmit={ handleSubmit } className="grid gap-8">
                    <div className="grid gap-1">
                        <label htmlFor="name" className="font-semibold text-neutral-800 tracking-wide" >Field Name</label>
                        <input onChange={ handleChange } autoFocus type="text" name="name" value={ data?.name } placeholder="Enter new field name" id="name" required className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <button disabled={ !data?.name.trim() } className={ `p-2 w-full font-bold tracking-widest rounded cursor-pointer ${ data?.name.trim() ? "bg-green-700 hover:bg-green-600 active:bg-green-500" : "bg-slate-500" } text-white` } >Add&nbsp;&nbsp;Field</button>
                </form>
            </div>
        </section>
    )
}

export default AddNewFieldSpace