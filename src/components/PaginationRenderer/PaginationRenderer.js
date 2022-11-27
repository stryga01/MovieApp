import React from 'react'
import { Pagination } from 'antd'
import './PaginationRenderer.css'

const PaginationRenderer = (props) => {
  const { currentPage, totalResults, onChangeCurrentPageHandler, loading } = props
  return (
    <div className="paginationRenderer">
      {!loading ? (
        <Pagination
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

export default PaginationRenderer
