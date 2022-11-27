import React from 'react'
import { Spin } from 'antd'

const Spinner = () => {
  return (
    <div key="spinner" className="spinWrap">
      <Spin size="large" />
    </div>
  )
}

export default Spinner
