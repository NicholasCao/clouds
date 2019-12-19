import React from 'react'
import './file.css'

interface Iprops {
  name: string,
  type: string,
  onClick: () => void
}

const FileIcon: React.FC = () => (
  <svg className="file-icon icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path><path fill="none" d="M0 0h24v24H0z"></path></svg>
)
const PictureIcon: React.FC = () => (
  <svg className="picture-icon icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path fill="none" d="M24 24H0V0h24v24z"></path><path d="M21 3H3C2 3 1 4 1 5v14c0 1.1.9 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zM5 17l3.5-4.5 2.5 3.01L14.5 11l4.5 6H5z"></path></svg>
)
const FolderIcon: React.FC = () => (
  <svg className="folder-icon icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path fill="none" d="M0 0h24v24H0z"></path></svg>
)

const RenderIcon: React.FC<string> = (type) => {
  if (type === 'folder') {
    return (<FolderIcon/>)
  }
  else if (type === 'picture') {
    return (<PictureIcon/>)
  } else {
    return (<FileIcon/>)
  }
}

const File: React.FC<Iprops> = (props) => (
  <div className="file-container" onClick={props.onClick}>
    <div className="picture">
      { RenderIcon(props.type) }
    </div>
    <div className="file-name">
      { RenderIcon(props.type) }
      { props.name.length > 8 ? props.name.slice(0, 6) + '...' : props.name }
    </div>
  </div>
)

export default File
