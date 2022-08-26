import React, {useEffect, useState} from 'react'
import '../paginationStyles.css'

function Pagination({ data, RenderComponent, onCheck, pageLimit, dataLimit }) {
    console.log('data length: ', data.length)
    const [pages, setPages] = useState(Math.ceil(data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);
  
    useEffect(() => {
        setPages(Math.ceil(data.length / dataLimit))
        setCurrentPage(1)
    }, [data.length, dataLimit])

    function goToNextPage() {
        setCurrentPage((page) => page + 1);
        debugger
        console.log(pages, currentPage)
    }
  
    function goToPreviousPage() {
        setCurrentPage((page) => page - 1);
    }
  
    function changePage(event) {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    }
  
    const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return data.slice(startIndex, endIndex);
    };
  
    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        let groupSize = Math.min(pageLimit, Math.ceil(data.length / dataLimit) - start);
        let a = new Array(groupSize).fill().map((_, idx) => start + idx + 1);
        return a; 
    };
  
    return (
        <div>
          <div className="dataContainer">
            {getPaginatedData().map((d, idx) => (
              <RenderComponent key={idx} student={d} onItemCheck={onCheck} />
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={goToPreviousPage}
              className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
            >
              prev
            </button>
      
            {getPaginationGroup().map((item, index) => (
              <button
                key={index}
                onClick={changePage}
                className={`paginationItem ${currentPage === item ? 'active' : null}`}
              >
                <span>{item}</span>
              </button>
            ))}
      
            <button
              onClick={goToNextPage}
              className={`next ${currentPage === pages ? 'disabled' : ''}`}
            >
              next
            </button>
          </div>
        </div>
      );
  }

  export default Pagination