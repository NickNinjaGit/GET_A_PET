
import styles from './Input.module.css'
function Input
({
    type, 
    text, 
    name, 
    placeholder, 
    handleOnChange, 
    value, 
    required,
    multiple,
}) 
{
    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}:</label>
            <input 
            name={name} 
            type={type} 
            id={name} 
            placeholder={placeholder}
            onChange={handleOnChange}
            value={value}
            required={required}
            {...(multiple ? {multiple} : '')} 
            />
        </div>
    )
}

export default Input