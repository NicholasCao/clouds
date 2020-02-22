import React, { useState, useEffect, useCallback } from 'react'
import { Icon, Button, Popover, Input, Upload, Modal, message } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu"

import './disk.css'

import FileItem from '../components/file'
import axios from '../lib/axios'
import { formatDate } from '../lib/utils'

// use IconFont
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1528394_vajadebven8.js',
})

interface File {
  _id: string,
  name: string,
  type: 'folder' | 'docs' | 'picture' | 'video' | 'music',
  path: string
}

// 'search' mean that is showing the search result
type SelectType = 'all' | 'docs' | 'picture' | 'video' | 'music' | 'search'

function collect(props: any) {
  return { id: props.id }
}

const Disk: React.FC<RouteComponentProps> = (props) => {
  const [username, setUsername] = useState('')
  const [selectType, setSelectType] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [path, setPath] = useState(['/'])
  const [visible, setVisible] = useState(false)
  const [moveFileVisable, setMoveFileVisable] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [moveFilePath, setMoveFilePath] = useState('/')
  // destinations for moving files
  const [destinations, setDestinations] = useState<string[]>([])
  // real destination
  const [moveTo, setMoveTo] = useState('')
  const [movingFile, setMovingFile] = useState<File>()

  const getFiles = useCallback((type: string = 'all', keyword: string = '') => {
    axios.get("/files", {
      params: {
        user: username,
        path: type === 'all' ? path.length > 1 ? path.join('/').slice(1) : path.join() : '',
        type,
        keyword
      }
    }).then(res => {
      let folders: File[] = []
      let files: File[] = []
      res.data.result.forEach((file: File) => {
        if (file.type === 'folder') {
          folders.push(file)
        }
      })
      res.data.result.forEach((file: File) => {
        if (file.type !== 'folder') {
          files.push(file)
        }
      })

      folders.sort((a, b) => {
        return a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1
      })
      files.sort((a, b) => {
        return a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1
      })

      setFiles([...folders, ...files])
    })
  }, [username, path])

  useEffect(() => {
    axios.post("/users/checkToken", {
      token: localStorage.getItem("clouds-token")
    }).then(res => {
      setUsername(res.data.username)
    }).catch(err => {
      props.history.push('/')
    })

  }, [props.history])

  useEffect(() => {
    getFiles()
  }, [path, getFiles])

  useEffect(() => {
    if (selectType !== 'search') getFiles(selectType)
  }, [selectType, getFiles])

  const select = (selectType: SelectType) => {
    setSelectType(selectType)
  }

  const signOut = () => {
    localStorage.removeItem("clouds-token")
    props.history.push('/')
  }

  const onDrop = useCallback((acceptedFiles:any[]) => {
    acceptedFiles.forEach(file => {
      let formData = new FormData()
      formData.append('file', file)
      formData.append('user', username)
      formData.append('path', path.length > 1 ? path.join('/').slice(1) : path.join())
      formData.append('lastModified', formatDate(new Date(file.lastModified)))
      axios.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        message.success(`${file.name} file uploaded successfully.`)
        if (selectType !== 'all') select('all')
        else getFiles()
      })
    })
  }, [username, path, selectType, getFiles])

  const { getRootProps, getInputProps } = useDropzone({onDrop, noClick: true, noKeyboard: true})

  const uploadProps = {
    name: 'file',
    action: '/api/files/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
        if (selectType !== 'all') select('all')
        else getFiles()
      }
    },
    data(file: any) {
      return {
        path: path.length > 1 ? path.join('/').slice(1) : path.join(),
        user: username,
        lastModified: formatDate(new Date(file.lastModified))
      }
    },
    showUploadList: false
  }

  const deleteFile = (file: File) => {
    axios.delete(`/files/${file._id}`, {
      params: {
        user: username,
        path: path.length > 1 ? path.join('/').slice(1) : path.join(),
        name: file.name
      }
    }).then(res => {
      getFiles(selectType)
      message.success(`${file.name} file deleted successfully.`)
    })
  }

  const handleClick = (e: any, data: any, target: HTMLElement) => {
    let file = files.find(file => file._id === data.id)
    if ((data.action === 'Download' || data.action === 'Enter') && file) {
      clickFile(file)
    } else if (data.action === 'Move' && file) {
      moveFile(file)
    } else if (data.action === 'Delete' && file) {
      deleteFile(file)
    }
  }

  const changePath = (pathItem: string) => {
    setPath(path.slice(0, path.indexOf(pathItem) + 1))
  }

  const clickFile = (file: File) => {
    if (file.type === 'folder') {
      let newPath = [...path]
      newPath.push(file.name)
      setPath(newPath)
    } else {
      // download
      // use axios and blob because of authorization
      axios.get('/files/download', {
        params: {
          user: username,
          path: path.length > 1 ? path.join('/').slice(1) : path.join(),
          name: file.name
        },
        responseType: 'blob'
      }).then(res => {
        let link = document.createElement('a')
        let url = window.URL.createObjectURL(res.data)
        link.style.display = 'none'
        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    }
  }

  const getDestinations = useCallback(() => {
    axios.get("/files", {
      params: {
        user: username,
        path: moveFilePath,
        type: 'folder'
      }
    }).then(res => {
      let result: string[]= res.data.result.map((folder: File) => folder.name)
      result.sort((a, b) => {
        return a.toLocaleLowerCase() > b.toLocaleLowerCase() ? 1 : -1
      })
      if (moveFilePath === '/') result.unshift('/')
      setDestinations(result)
    })
  }, [username, moveFilePath])

  const moveFile = (file: File) => {
    setMovingFile(file)
    setMoveFilePath('/')
    setMoveTo('')
    setMoveFileVisable(true)
    getDestinations()
  }

  useEffect(() => {
    if (moveFilePath.startsWith('//')) setMoveFilePath(moveFilePath.slice(1))
    else getDestinations()
  }, [moveFilePath, getDestinations])

  const changeMoveTo = (destination: string) => {
    if (destination === '/') {
      if(moveTo !== '/') setMoveTo('/')
    }
    else setMoveTo(moveFilePath === '/' ? `${moveFilePath}${destination}` : `${moveFilePath}/${destination}`)
  }

  const changeMoveFilePath = (destination: string) => {
    if (destination !== '/') setMoveFilePath(moveFilePath + '/' + destination)
  }

  const goBack = () => {
    setMoveFilePath(moveFilePath.lastIndexOf('/') === 0 ? '/' : moveFilePath.slice(0, moveFilePath.lastIndexOf('/')))
  }

  const move = () => {
    if (movingFile) {
      axios.post("/files/move", {
        name: movingFile.name,
        user: username,
        path: movingFile.path,
        newPath: moveTo
      }).then(res => {
        getFiles()
        setMoveFileVisable(false)
      })
    } else {
      message.error('move file error')
    }
  }

  // create folder modal
  const showModal = () => {
    setVisible(true)
  }
  const hideModal = () => {
    setVisible(false)
  }

  const search = () => {
    setSelectType('search')
    getFiles('', keyword)
  }

  const createFolder = () => {
    if (folderName) {
      axios.post("/files/folder", {
        name: folderName,
        user: username,
        path: path.length > 1 ? path.join('/').slice(1) : path.join()
      }).then(res => {
        message.success(`folder ${folderName} created successfully.`)
        if (selectType !== 'all') select('all')
        else getFiles()
      })
      hideModal()
    } else {
      message.error('please input folder name.')
    }
  }

  const attributes = {
    'data-id': 0,
    className: 'example-multiple-targets well'
  }
  return (
    <div className="disk">
      <header>
        <h2>Clouds</h2>
        <Popover
          placement="bottom"
          content={
            <Button onClick={signOut}  type="link">Sign Out</Button>
          }
          trigger="hover"
        >
          <Button className="user ant-dropdown-trigger" type="link">
            { username }
            <Icon type="down" style={{marginLeft: '2px', fontSize: '12px'}} />
          </Button>
        </Popover>
      </header>
      <main>
        <Modal
          title="New Folder"
          visible={visible}
          onOk={createFolder}
          onCancel={hideModal}
          okText="Create"
          cancelText="Cancel"
          closable={false}
          width={300}
        >
          <p>Folder Name:</p>
          <Input onChange={e => setFolderName(e.target.value)} onPressEnter={e => {e.preventDefault(); createFolder();}} />
        </Modal>
        <Modal
          title={'Move To ' + moveTo}
          visible={moveFileVisable}
          onOk={move}
          onCancel={() => {setMoveFileVisable(false); setMoveTo('');} }
          okText="Confirm"
          cancelText="Cancel"
          closable={false}
          width={260}
        >
          <ul>
            { moveFilePath === '/' ? <></> :
              <li className="destination-container" style={{ height: '38px' }} onClick={goBack}>
                <Icon type="arrow-up" style={{ fontSize: '1.3rem', marginRight: '1rem' }} />
                <span>..</span>
              </li>
            }
            { destinations.map((destination, index) => (
                <li 
                  key={index}
                  onClick={() => changeMoveTo(destination)}
                  className={ moveTo === (moveFilePath === '/' ? `${moveFilePath}${destination}` : `${moveFilePath}/${destination}`)  ? 'destination-container selected-destination' : 'destination-container' }>
                  <svg className="folder-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path fill="none" d="M0 0h24v24H0z"></path></svg>
                  <span>{ destination }</span>
                  <Button type="link" shape="circle" icon="right" onClick={(e: React.MouseEvent) => {e.stopPropagation();changeMoveFilePath(destination)}} />
                </li>
              ))
            }
          </ul>
          {/* <div>
            { moveTo === '' ? <></> :
              <p style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                Move To { moveTo }
              </p>
            }
          </div> */}
        </Modal>
        <div className="sidebar-container">
          <div className="sidebar">
            <div className="search-container">
              <Input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Search"
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                onPressEnter={e => {e.preventDefault(); search();}}
              />
            </div>
            <ul>
              <li onClick={() => select('all')} className={selectType === 'all' ? 'selected': ''}>
                <IconFont type="iconfiles" />
                all
              </li>
              <li onClick={() => select('docs')} className={selectType === 'docs' ? 'selected': ''}>
                <IconFont type="icondocs2" />
                docs
              </li>
              <li onClick={() => select('picture')} className={selectType === 'picture' ? 'selected': ''}>
                <IconFont type="iconpicture" />
                picture
              </li>
              <li onClick={() => select('video')} className={selectType === 'video' ? 'selected': ''}>
                <IconFont type="iconvideo" />
                video
              </li>
              <li onClick={() => select('music')} className={selectType === 'music' ? 'selected': ''}>
                <IconFont type="iconic_addmusic" />
                music
              </li>
            </ul>
            <div className="button-cotainer">
              <Upload {...uploadProps}>
                <Button icon="upload">
                  Upload
                </Button>
              </Upload>
              <Button onClick={showModal}>
                <IconFont type="iconiccreatenewfolder"/>Create
              </Button>
            </div>
          </div>
        </div>
        <div className="files-container">
          <div className="path-bar">
            {
              selectType === 'all' ?
                path.map((pathItem, index) => (
                  <React.Fragment key={ index }>
                    <Button type="link" className="path" onClick={() => { changePath(pathItem) }}>
                      { pathItem }
                    </Button>
                    { index === path.length - 1 ? '' : <Icon type="right" /> }
                  </React.Fragment>
                )) :
                (<Button type="link" className="path">
                  Result
                </Button>)
            }
          </div>
          <div className="files" {...getRootProps()}>
            <input {...getInputProps()} />
            { files.length === 0 ? (
              <div className="empty-container">
                <p>
                  <Icon type="inbox" />
                </p>
                <p>Drag File Here</p>
                <p>
                  Or click the 'Upload' button on the left to add a file
                </p>
              </div>
              ) : files.map((file, index) => (
                <React.Fragment key = { index }>
                  <ContextMenuTrigger id={file._id} collect={collect} attributes={attributes}>
                    <FileItem name={ file.name } type={ file.type } onClick={() => {clickFile(file)}} />
                  </ContextMenuTrigger>
                  <ContextMenu id={file._id}>
                    {
                      file.type === 'folder' ? 
                      <MenuItem onClick={handleClick} data={{ action: 'Enter' }}>
                        <Icon type="folder-open" />Enter
                      </MenuItem> :
                      <MenuItem onClick={handleClick} data={{ action: 'Download' }}>
                        <Icon type="cloud-download" />Download
                      </MenuItem>
                    }
                    <MenuItem onClick={handleClick} data={{ action: 'Rename' }}>
                      <Icon type="edit" />Rename
                    </MenuItem>
                    {
                      file.type === 'folder' ?
                      <></> :
                      <MenuItem onClick={handleClick} data={{ action: 'Move' }}>
                        <Icon type="export" />Move
                      </MenuItem>
                    }
                    <MenuItem onClick={handleClick} data={{ action: 'Delete' }}>
                      <Icon type="delete" />Delete
                    </MenuItem>
                  </ContextMenu>
                </React.Fragment>
              ))
            }
          </div>
        </div>
      </main>
    </div>
  )
}

export default withRouter(Disk)
