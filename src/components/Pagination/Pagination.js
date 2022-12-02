import React from 'react'
import { Pagination as PaginationAntd } from 'antd'
import './Pagination.css'

const Pagination = (props) => {
  const { currentPage, totalResults, onChangeCurrentPageHandler, loading } = props
  return (
    <div className="paginationRenderer">
      {!loading ? (
        <PaginationAntd
          hideOnSinglePage={true}
          current={currentPage}
          total={totalResults}
          pageSize={20}
          pageSizeOptions={[]}
          onChange={onChangeCurrentPageHandler}
        />
      ) : null}
    </div>
  )
}

export default Pagination
