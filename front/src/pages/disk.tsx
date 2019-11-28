import React, { useState } from 'react'
import { Icon, Button, Popover, Input } from 'antd'
import './disk.css'
import File from '../components/file'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1528394_vajadebven8.js',
})

const RenderPath: React.FC<string[]> = (paths: string[]) => {
  let pathItems: JSX.Element[] =  paths.map((path, index) => (
    <>
      <Button type="link" className="path">
        { path }
      </Button>
      { index === paths.length - 1 ? '' : <Icon type="right" /> }
    </>
  ))
  return (
    <>
      { pathItems }
    </>
  )
}
export default () => {
  // const [selectType, setSelectType] = useState('all')
  // const handleClick = (e: any) => {
  //   setSelectType(e.key)
  // }
  return (
    <div className="disk">
      <header>
        <h2>Clouds</h2>
        <Popover placement="bottom" content={'Sign Out'} trigger="hover">
          <Button className="user ant-dropdown-trigger" type="link">
            Nicholas <Icon type="down" style={{marginLeft: '2px', fontSize: '12px'}} />
          </Button>
        </Popover>
      </header>
      <main>
        <div className="sidebar-container">
          <div className="sidebar">
            <div className="search-container">
              <Input
                placeholder="Search"
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            </div>
            <ul>
              <li>
                <IconFont type="iconfiles" />
                all
              </li>
              <li>
                <IconFont type="icondocs2" />
                docs
              </li>
              <li>
                <IconFont type="iconpicture" />
                picture
              </li>
              <li>
                <IconFont type="iconvideo" />
                video
              </li>
              <li>
                <IconFont type="iconic_addmusic" />
                music
              </li>
            </ul>
            <div className="button-cotainer">
              <Button icon="upload">
                {/* <IconFont type="iconiccreatenewfolder"/> */}
                Upload
              </Button>
              <Button><IconFont type="iconiccreatenewfolder"/>Create</Button>
            </div>
          </div>
        </div>
        <div className="files-container">
          <div className="path-bar">
            { RenderPath(['/', 'aa', 'abc'])}
          </div>
          <div className="files">
            <File name="111" type="folder" />
            <File name="111.doc" type="doc" />
            <File name="111.png" type="picture" />
            <File name="111.doc" type="doc" />
            <File name="111.png" type="picture"/>
            <File name="111.doc" type="doc" />
            <File name="111.png" type="picture" />
            <File name="111.doc" type="doc" />
          </div>
        </div>
      </main>
    </div>
)}
 