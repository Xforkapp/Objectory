"use client";

import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";

interface ObjectViewerProps {
    src: string;      // .glbファイルのURL
    poster?: string;    // 読み込み中に表示する静止画
    name?: string;      // アイテム名
    alt?: string;
    interactive?: boolean;
    autoRotate?: boolean;
    className?: string;
}

export interface ObjectViewerRef {
    startRecording: (durationMs: number) => Promise<Blob>;
    stopRecording: () => void;
}

const ObjectViewer = forwardRef<ObjectViewerRef, ObjectViewerProps>(({
    src,
    poster,
    name = "Object",
    alt,
    interactive = true,
    autoRotate = false,
    className = "w-full h-full"
}, ref) => {
    const [isClient, setIsClient] = useState(false);
    const viewerRef = useRef<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        import("@google/model-viewer");
        setIsClient(true);
    }, []);

    useImperativeHandle(ref, () => ({
        startRecording: async (durationMs: number) => {
            if (!viewerRef.current) throw new Error("Viewer not ready");

            const canvas = viewerRef.current.shadowRoot?.querySelector("canvas");
            if (!canvas) throw new Error("Canvas not found");

            // 録画中はモデルを滑らかに回転させる
            const originalAutoRotate = viewerRef.current.autoRotate;
            const originalRotationSpeed = viewerRef.current.rotationSpeed;

            viewerRef.current.autoRotate = true;
            viewerRef.current.rotationSpeed = "400%"; // 撮影用に少し早める or 調整

            const stream = canvas.captureStream(60); // 60fps
            const recorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            return new Promise((resolve, reject) => {
                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunksRef.current.push(e.data);
                };

                recorder.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                    // 状態を戻す
                    viewerRef.current.autoRotate = originalAutoRotate;
                    viewerRef.current.rotationSpeed = originalRotationSpeed;
                    resolve(blob);
                };

                recorder.onerror = reject;

                recorder.start();
                setTimeout(() => {
                    if (recorder.state === "recording") {
                        recorder.stop();
                    }
                }, durationMs);
            });
        },
        stopRecording: () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
        }
    }));

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
                ref={viewerRef}
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
                <div slot="poster" className="flex items-center justify-center h-full w-full bg-[#F9F9F9]">
                    <p className="text-[10px] tracking-widest text-gray-400">LOADING MUSEUM OBJECT...</p>
                </div>
            </ModelViewer>
        </div>
    );
});

ObjectViewer.displayName = "ObjectViewer";

export default ObjectViewer;



