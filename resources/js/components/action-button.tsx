import React from 'react';

interface ActionButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    color?: string;
    children: React.ReactNode;
    type?: 'button' | 'submit';
    style?: React.CSSProperties;
}

export default function ActionButton({
    onClick,
    disabled = false,
    color = '#4f46e5',
    children,
    type = 'button',
    style = {},
}: ActionButtonProps) {
    return (
        <button
            type={type}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            style={{
                padding: '0.25rem 0.5rem',
                background: color,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.4 : 1,
                ...style,
            }}
        >
            {children}
        </button>
    );
}