const [count, setCount] = useState(6)
const intervalCb = useRef(null)
useEffect(() => {
    intervalCb.current = () => {
        if (count > 1) {
            setCount(count - 1)
        }
    }
}, [count])

useEffect(() => {
    let CountTimer = window.setInterval(() => intervalCb.current(), 1000)
    return () => window.clearInterval(CountTimer)
}, [])

