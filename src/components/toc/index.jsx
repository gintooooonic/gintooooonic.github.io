import React from 'react'

import './index.scss'

export const TOC = ({ toc }) => (
  <div className="toc" dangerouslySetInnerHTML={{ __html: toc }} />
)
