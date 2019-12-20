import React, { useState, useEffect, useCallback } from 'react'
import { Icon, Button, Popover, Input, Upload, Modal, message } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu"

import './disk.css'

import File from '../components/file'
import axios from '../lib/axios'
import { formatDate } from '../lib/utils'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1528394_vajadebven8.js',
})

interface File {
  _id: string,
  name: string,
  type: 'folder' | 'doc' | 'picture' | 'video' | 'music'
}

type SelectType = 'all' | 'doc' | 'picture' | 'video' | 'music'

function collect(props: any) {
  return { id: props.id }
}

const Disk: React.FC<RouteComponentProps> = (props) => {
  const { username } = props.location.state
  const [selectType, setSelectType] = useState('all')
  const [files, setFiles] = useState<File[]>([])
  const [path, setPath] = useState(['/'])
  const [visible, setVisible] = useState(false)
  const [folderName, setFolderName] = useState('')

  const getFiles = () => {
    axios.get("/files", {
      params: {
        user: username,
        path: path.length > 1 ? path.join('/').slice(1) : path.join()
      }
    }).then(res => {
      setFiles(res.data.result)
      // setFiles(Files)
    })
  }

  // useEffect(() => {
  //   // getFiles()
  // }, [])

  useEffect(() => {
    getFiles()
  }, [path])

  // useEffect(() => {
    
  // }, [selectType])

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
        getFiles()
      })
    })
  }, [username, path])

  const { getRootProps, getInputProps } = useDropzone({onDrop, noClick: true, noKeyboard: true})

  const uploadProps = {
    name: 'file',
    action: '/api/files/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      // if (info.file.status !== 'uploading') {
      //   console.log(info.file, info.fileList)
      // }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
        getFiles()
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
      getFiles()
      message.success(`${file.name} file deleted successfully.`)
    })
  }

  const handleClick = (e: any, data: any, target: HTMLElement) => {
    let file = files.find(file => file._id === data.id)
    if ((data.action === 'Download' || data.action === 'Enter') && file) {
      clickFile(file)
    } else if (data.action === 'Delete' && file) {
      deleteFile(file)
    }
  }

  const changePath = (pathItem: string) => {
    setPath(path.slice(0, path.indexOf(pathItem) + 1))
  }

  const clickFile = (file:File) => {
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

  const showModal = () => {
    setVisible(true)
  }
  const hideModal = () => {
    setVisible(false)
  }

  const createFolder = () => {
    if (folderName) {
      axios.post("/files/folder", {
        name: folderName,
        user: username,
        path: path.length > 1 ? path.join('/').slice(1) : path.join()
      }).then(res => {
        message.success(`folder ${folderName} created successfully.`)
        getFiles()
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
          <Input onChange={(e) => setFolderName(e.target.value)}/>
        </Modal>
        <div className="sidebar-container">
          <div className="sidebar">
            <div className="search-container">
              <Input
                placeholder="Search"
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            </div>
            <ul>
              <li onClick={() => select('all')} className={selectType === 'all' ? 'selected': ''}>
                <IconFont type="iconfiles" />
                all
              </li>
              <li onClick={() => select('doc')} className={selectType === 'doc' ? 'selected': ''}>
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
              path.map((pathItem, index) => (
                <React.Fragment key={ index }>
                  <Button type="link" className="path" onClick={() => { changePath(pathItem) }}>
                    { pathItem }
                  </Button>
                  { index === path.length - 1 ? '' : <Icon type="right" /> }
                </React.Fragment>
              ))
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
                    <File name={ file.name } type={ file.type } onClick={() => {clickFile(file)}} />
                  </ContextMenuTrigger>
                  <ContextMenu id={file._id}>
                    {
                      file.type === 'folder' ? 
                      <MenuItem onClick={handleClick} data={{ action: 'Enter' }}>Enter</MenuItem> :
                      <MenuItem onClick={handleClick} data={{ action: 'Download' }}>Download</MenuItem>
                    }
                    <MenuItem onClick={handleClick} data={{ action: 'Delete' }}>Delete</MenuItem>
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
