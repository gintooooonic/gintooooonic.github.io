import React from 'react'

import './index.scss'

export const TOC = ({ toc }) => (
  <div className="toc">
    <h4 className="toc_header">Table of contents</h4>
    <div dangerouslySetInnerHTML={{ __html: toc }} />
  </div>
)
