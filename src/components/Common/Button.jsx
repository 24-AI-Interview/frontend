import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, text, onClick, className = '', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children ?? text} {/* 기존 text props도 호환 */}
    </button>
  );
};

export default Button;
