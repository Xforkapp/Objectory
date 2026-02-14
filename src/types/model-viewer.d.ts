import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': MyModelViewerAttributes;
        }
    }
}

interface MyModelViewerAttributes extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    src?: string;
    alt?: string;
    ar?: boolean;
    'ar-modes'?: string;
    'camera-controls'?: boolean;
    'shadow-intensity'?: string;
    'environment-image'?: string;
    'auto-rotate'?: boolean;
    'touch-action'?: string;
    poster?: string;
    loading?: string;
    reveal?: string;
    className?: string;
    'exposure'?: string;
    'camera-orbit'?: string;
    'field-of-view'?: string;
    'min-camera-orbit'?: string;
    'max-camera-orbit'?: string;
    'min-field-of-view'?: string;
    'max-field-of-view'?: string;
    'interaction-prompt'?: string;
    'interaction-prompt-style'?: string;
    'interaction-policy'?: string;
}
