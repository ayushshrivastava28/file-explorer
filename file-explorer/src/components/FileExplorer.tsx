import React, { useState } from 'react';
import './FileExplorer.css';
import { Files } from '../store/fileData';

// SVG for right,down and file icons
const RightArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 448 512">
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
    </svg>
);

const DownArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 384 512">
        <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
    </svg>
);

const FileLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 384 512">
        <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z" />
    </svg>
)

interface FileData {
    type: string;
    name: string;
    data?: FileData[];
}

// Recursive component to render file tree
const FileExplorer: React.FC = () => {
    const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({});
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ fileName: string; x: number; y: number } | null>(null);

    // Function to toggle folder open/close
    const toggleFolder = (folderName: string) => {
        setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
    };

    // Handle file selection
    const handleFileClick = (fileName: string) => {
        setSelectedFile(fileName);
        setContextMenu(null); // Close right-click menu
    };

    // Handle right-click on a file
    const handleRightClick = (e: React.MouseEvent, fileName: string) => {
        e.preventDefault();
        setContextMenu({ fileName, x: e.clientX, y: e.clientY });
    };

    // Handle file operations from context menu
    const handleFileOperation = (operation: string) => {
        if (contextMenu) {
            console.log(`${operation} file: ${contextMenu.fileName}`);
            setContextMenu(null); // Close context menu
        }
    };

    // Recursive render function
    const renderFileTree = (file: FileData, path = '') => {
        const fullPath = `${path}/${file.name}`;
        if (file.type === 'folder') {
            const isOpen = openFolders[fullPath] || false;
            return (
                <div key={fullPath} className="folder">
                    <div className="folder-header" onClick={() => toggleFolder(fullPath)}>
                        {isOpen ? <DownArrow /> : <RightArrow />}
                        <span>&nbsp;{file.name}</span>
                    </div>
                    {isOpen && (
                        <div className="folder-content">
                            {file.data?.map((child) => renderFileTree(child, fullPath))}
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div
                    key={fullPath}
                    className={`file ${selectedFile === fullPath ? 'selected' : ''}`}
                    onClick={() => handleFileClick(fullPath)}
                    onContextMenu={(e) => handleRightClick(e, fullPath)}
                >
                    <FileLogo />&nbsp;{file.name}
                </div>
            );
        }
    };

    return (
        <div className="file-explorer">
            {renderFileTree(Files)}
            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <div onClick={() => handleFileOperation('copy')}>Copy</div>
                    <div onClick={() => handleFileOperation('delete')}>Delete</div>
                    <div onClick={() => handleFileOperation('rename')}>Rename</div>
                </div>
            )}
        </div>
    );
};

export default FileExplorer;
