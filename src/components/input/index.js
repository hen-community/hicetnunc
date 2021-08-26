import React from 'react'
import styles from './styles.module.scss'

export const Input = ({
  type = 'text',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  maxlength = 500,
  label,
  onChange = () => null,
  onBlur = () => null,
  disabled,
  value,
  pattern
}) => (
  <div className={styles.container}>
    <label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        min={min}
        max={max}
        maxLength={maxlength}
        defaultValue={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        pattern={pattern}
        onWheel={(e) => e.target.blur()}
      />
      <p>{label}</p>
    </label>
  </div>
)

export const Textarea = ({
  type = 'text',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  maxlength = 5000,
  label,
  onChange = () => null,
  onBlur = () => null,
  disabled,
  value,
}) => (
  <div className={styles.container}>
    <label>
      <textarea
        type={type}
        placeholder={placeholder}
        name={name}
        min={min}
        max={max}
        maxLength={maxlength}
        defaultValue={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      <p>{label}</p>
    </label>
  </div>
)
