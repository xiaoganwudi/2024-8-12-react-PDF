import './index.scss';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
// 渲染pdf组件引入 
const MyDocument = dynamic(() => import('../MyDocument/index'), {
    ssr: false,
});

export default function Main() {
    return (
        <div className='main'>
            <div className='main-miaoshu'>
                <h1 className='h1-title'>旋转PDF页面</h1>
                <p className='p-meg'>只需单击页面即可旋转它。然后，您可以下载修改后的 PDF。</p>
            </div>
            <DragAndDropUpload></DragAndDropUpload>
        </div>
    )
}

function DragAndDropUpload() {
    const [file, setFile] = useState(null);
    // const [file, setFile] = useState('test.pdf');
    const fileInputRef = useRef(null);

    // 监听选择文件上传
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            alert('请选择PDF文件');
        }
    };

    // 阻止默认行为，允许拖放
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // 拖拽结束
    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
        } else {
            alert('请拖拽PDF文件');
        }
    };

    // 点击触发文件选择
    const handleClick = () => {
        fileInputRef.current.click();
    };

    // 删除file回调
    function emitDeleteFile() {
        setFile(null);
    }

    // file变化时的副状态处理逻辑
    useEffect(() => {
    }, [file]);

    return (
        <div className='DragAndDropUpload'>

            {
                !file ? (<div
                    className='DragAndDropUpload-box'
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <p>点击上传或拖动</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                        style={{ display: 'none' }}
                    />
                </div>) : <MyDocument file={file} emitDeleteFile={emitDeleteFile}></MyDocument>
            }
        </div>
    )
}