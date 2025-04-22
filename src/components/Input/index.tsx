import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import styles from "./styles.module.css"

type Props = React.ComponentProps<"input">

export const Input = forwardRef<HTMLInputElement, Props>(({ ...rest }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // expõe a ref para o pai
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  useEffect(() => {
    if (rest.autoFocus) {
      inputRef.current?.focus()
    }
  }, [rest.autoFocus])

  return <input ref={inputRef} type="text" className={styles.input} {...rest} />
})
