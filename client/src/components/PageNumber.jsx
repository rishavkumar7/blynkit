const PageNumber = ({ currentPageNumber, setCurrentPageNumber, totalPageCount }) => {
    return (
        <section className="">
            <div className="flex items-center justify-center gap-1 select-none">
                {
                    (currentPageNumber - 4 > 0) && (currentPageNumber + 1 > totalPageCount) && (<div onClick={ () => { setCurrentPageNumber(currentPageNumber - 4) } } className="bg-[rgba(0,0,0,0.5)] text-md sm:text-lg text-white font-semibold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded cursor-pointer">
                        { currentPageNumber - 4 }
                    </div>)
                }
                {
                    (currentPageNumber - 3 > 0) && (currentPageNumber + 2 > totalPageCount) && (<div onClick={ () => { setCurrentPageNumber(currentPageNumber - 3) } } className="bg-[rgba(0,0,0,0.5)] text-md sm:text-lg text-white font-semibold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded cursor-pointer">
                        { currentPageNumber - 3 }
                    </div>)
                }
                {
                    (currentPageNumber - 2 > 0) && (<div onClick={ () => { setCurrentPageNumber(currentPageNumber - 2) } } className="bg-[rgba(0,0,0,0.5)] text-md sm:text-lg text-white font-semibold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded cursor-pointer">
                        { currentPageNumber - 2 }
                    </div>)
                }
                {
                    (currentPageNumber - 1 > 0) && (<div onClick={ () => { setCurrentPageNumber(currentPageNumber - 1) } } className="bg-[rgba(0,0,0,0.5)] text-md sm:text-lg text-white font-semibold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded cursor-pointer">
                        { currentPageNumber - 1 }
                    </div>)
                }
                {
                    (currentPageNumber > 0 && totalPageCount > 0) && (<div className="bg-[rgba(0,0,0,0.8)] text-xl sm:text-2xl text-white font-bold w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded cursor-default">
                        { currentPageNumber }
                    </div>)
                }
                {
                    (currentPageNumber + 1 <= totalPageCount) && (<div onClick={ () => { setCurrentPageNumber(currentPageNumber + 1) } } className="bg-[rgba(0,0,0,0.5)] text-md sm:text-lg text-white font-semibold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded cursor-pointer">
                        { currentPageNumber + 1 }
                    </div>)
                }
                {
                    (currentPageNumber + 2 <= totalPageCount) && (<div onClick={ () => { setCurrentPageNumber(currentPageNumber + 2) } } className="bg-[rgba(0,0,0,0.5)] text-md sm:text-lg text-white font-semibold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded cursor-pointer">
                        { currentPageNumber + 2 }
                    </div>)
                }
                {
                    (currentPageNumber + 3 <= totalPageCount) && (currentPageNumber - 2 <= 0) && (<div onClick={ () => { setCurrentPageNumber(currentPageNumber + 3) } } className="bg-[rgba(0,0,0,0.5)] text-md sm:text-lg text-white font-semibold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded cursor-pointer">
                        { currentPageNumber + 3 }
                    </div>)
                }
                {
                    (currentPageNumber + 4 <= totalPageCount) && (currentPageNumber - 1 <= 0) && (<div onClick={ () => { setCurrentPageNumber(currentPageNumber + 4) } } className="bg-[rgba(0,0,0,0.5)] text-md sm:text-lg text-white font-semibold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded cursor-pointer">
                        { currentPageNumber + 4 }
                    </div>)
                }
            </div>
        </section>
    )
}

export default PageNumber