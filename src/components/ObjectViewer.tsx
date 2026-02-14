"use client";

import React, { useEffect, useState } from "react";

interface ObjectViewerProps {
    src: string;      // .glbファイルのURL
    poster?: string;    // 読み込み中に表示する静止画
    name?: string;      // アイテム名
    alt?: string;
    interactive?: boolean;
    autoRotate?: boolean;
    className?: string;
}

export default function ObjectViewer({
    src,
    poster,
    name = "Object",
    alt,
    interactive = true,
    autoRotate = false,
    className = "w-full h-full"
}: ObjectViewerProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // クライアントサイドでのみ読み込み
        import("@google/model-viewer");
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className={`${className} flex items-center justify-center bg-[#F9F9F9] rounded-2xl`}>
                <p className="text-xs tracking-tighter text-gray-400">PREPARING MUSEUM OBJECT...</p>
            </div>
        );
    }

    const ModelViewer = "model-viewer" as any;

    return (
        <div className={`relative ${className} flex items-center justify-center bg-[#F9F9F9]`}>
            <ModelViewer
                src={src}
                alt={alt || `${name}の3Dモデル`}
                poster={poster}
                camera-controls={interactive}
                auto-rotate={autoRotate}
                shadow-intensity="1"
                environment-image="neutral"
                exposure="1"
                className="w-full h-full outline-none"
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
            >
                {/* 読み込み中のインジケーター */}
                <div slot="poster" className="flex items-center justify-center h-full w-full bg-[#F9F9F9]">
                    <p className="text-[10px] tracking-widest text-gray-400">LOADING MUSEUM OBJECT...</p>
                </div>
            </ModelViewer>
        </div>
    );

}



